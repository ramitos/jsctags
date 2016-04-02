// Based on tern-local-scope-condense-plugin (https://github.com/sourcegraph/tern-local-scope-condense-plugin)

var tern = require('tern');
var includes = require('lodash.includes');
var defaults = require('lodash.defaults');
var isUndefined = require('lodash.isundefined');
var get = require('lodash.get');
var walk = require('acorn/dist/walk');
var format = require('util').format;
var forceArray = require('force-array');
var infer = require('tern/lib/infer');

var defnode = require('./defnode');
var walkall = require('./walkall');

var joinPaths = function(a, b) {
  if (a) {
    return a + '.' + b;
  }

  return b;
};

var getId = function(n) {
  return format('%d-%d', n.start, n.end);
};

var postCondenseReach = function(server, options, state) {
  var seenSpans = {};

  var visitScope = function(state, scope, path) {
    // detect cycles
    if (scope._localScopeCondenseSeen) {
      return;
    }

    scope._localScopeCondenseSeen = true;

    Object.keys(get(scope, 'props', {})).sort().forEach(function(prop) {
      visitAVal(state, scope.props[prop], joinPaths(path, prop));
    });
  };

  var visitNode = function(state, node, path) {
    if (!node) {
      return;
    }

    walk.recursive(node, {
      path: path,
      ids: []
    }, walkall.makeVisitors(function(node, st, walk) {
      if (includes(st.ids, getId(node))) {
        return;
      }

      st.ids.push(getId(node));

      if (!node.scope) {
        return;
      }

      visitScope(state, node.scope, st.path);

      walk(node, {
        ids: st.ids,
        path: st.path
      });
    }));
  };

  var isArg = function(state, av) {
    return get(av, 'propertyOf.fnType.args', []).some(function(arg) {
      return arg.propertyName === av.propertyName;
    });
  };

  var isScoped = function(state, av) {
    var g = (
      (av.path === '<top>') ||
      isUndefined(get(av, 'propertyOf.isBlock'))
    );

    return g ? false : isArg(state, av);
  };

  var getType = function(state, av, proto) {
    var types = get(av, 'types', []).map(function(type) {
      return get(type, 'proto.name');
    });

    if (!types.length) {
      return false;
    }

    var single = types.reduce(function(a, b) {
      return (a === b) ? a : undefined;
    });

    return single;
  };

  var isConstructor = function(state, type) {
    return !isUndefined(get(type, 'props.prototype'));
  };

  var visitAVal = function(state, av, path) {
    if (av._localScopeCondenseSeen) {
      return;
    }

    av._localScopeCondenseSeen = true;

    if (!state.isTarget(av.origin)) {
      return;
    }

    if (av.fnArgs) {
      return;
    }

    var span = state.getSpan(av);

    if (!span) {
      return;
    }

    if (seenSpans[span]) {
      return;
    }

    seenSpans[span] = true;

    var data = {
      scoped: isScoped(state, av),
      isArg: isArg(state, av),
      type: getType(state, av)
    };

    state.types[path] = {
      type: av,
      span: span,
      data: defaults(data, av.metaData)
    };

    if (!av.originNode) {
      return;
    }

    var node = av.originNode;
    var ast = node.sourceFile.ast;
    var defNode, type;

    try {
      type = infer.expressionType({
        node: defNode,
        state: state
      });
    } catch (err) {}

    state.types[path].data = defaults({
      isConstructor: isConstructor(state, type)
    }, state.types[path].data);

    forceArray(av.types).forEach(function(type) {
      visitScope(state, type, path);
    });

    try {
      defNode = defnode.findDefinitionNode(ast, node.start, node.end);
    } catch (err) {
      return;
    }

    visitNode(state, defNode, path);
  };

  // Traverse accessible types first so we name things with reachable path
  // prefixes if possible.
  Object.keys(state.types).sort().forEach(function(path) {
    var data = state.types[path];
    seenSpans[data.span] = true;

    data.data = defaults({
      isConstructor: isConstructor(state, get(data, 'type')),
      type: getType(state, {
        types: [data.type]
      })
    }, data.data);

    if (data.type.originNode) {
      visitNode(state, data.type.originNode, path);
    }
  });

  Object.keys(state.types).sort().forEach(function(path) {
    var data = state.types[path];

    Object.keys(get(data, 'type.props', {})).forEach(function(prop) {
      visitAVal(state, data.type.props[prop], joinPaths(path, prop));
    });
  });

  // Assume that file scope is not reachable.
  state.cx.parent.files.forEach(function(file) {
    var path = file.name.replace(/\./g, '`');
    visitScope(state, file.scope, path);

    if (state.isTarget(file.name)) {
      visitNode(state, file.ast, path);
    }
  });
};

tern.registerPlugin('local-scope', function(server, options) {
  return {
    passes: {
      postCondenseReach: function(state) {
        postCondenseReach(server, options, state);
      }
    }
  };
});
