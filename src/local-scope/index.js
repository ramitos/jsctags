// Based on tern-local-scope-condense-plugin (https://github.com/sourcegraph/tern-local-scope-condense-plugin)

const tern = require('tern');
const includes = require('lodash.includes');
const defaults = require('lodash.defaults');
const isUndefined = require('lodash.isundefined');
const get = require('lodash.get');
const walk = require('acorn/dist/walk');
const format = require('util').format;
const forceArray = require('force-array');
const infer = require('tern/lib/infer');

const defnode = require('./defnode');
const walkall = require('./walkall');

const joinPaths = function(a, b) {
  if (a) {
    return a + '.' + b;
  }

  return b;
};

const getId = function(n) {
  return format('%d-%d', n.start, n.end);
};

const postCondenseReach = function(server, options, state) {
  const seenSpans = {};

  const visitScope = function(state, scope, path) {
    // Detect cycles
    if (scope._localScopeCondenseSeen) {
      return;
    }

    scope._localScopeCondenseSeen = true;

    Object.keys(get(scope, 'props', {}))
      .sort()
      .forEach(prop => {
        visitAVal(state, scope.props[prop], joinPaths(path, prop));
      });
  };

  const visitNode = function(state, node, path) {
    if (!node) {
      return;
    }

    walk.recursive(
      node,
      {
        path,
        ids: []
      },
      walkall.makeVisitors((node, st, walk) => {
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
      })
    );
  };

  const isArg = function(state, av) {
    return get(av, 'propertyOf.fnType.args', []).some(arg => {
      return arg.propertyName === av.propertyName;
    });
  };

  const isScoped = function(state, av) {
    const g = av.path === '<top>' || isUndefined(get(av, 'propertyOf.isBlock'));

    return g ? false : isArg(state, av);
  };

  const getType = function(state, av, proto) {
    const types = get(av, 'types', []).map(type => {
      return get(type, 'proto.name');
    });

    if (!types.length) {
      return false;
    }

    const single = types.reduce((a, b) => {
      return a === b ? a : undefined;
    });

    return single;
  };

  const isConstructor = function(state, type) {
    return !isUndefined(get(type, 'props.prototype'));
  };

  const visitAVal = function(state, av, path) {
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

    const span = state.getSpan(av);

    if (!span) {
      return;
    }

    if (seenSpans[span]) {
      return;
    }

    seenSpans[span] = true;

    const data = {
      scoped: isScoped(state, av),
      isArg: isArg(state, av),
      type: getType(state, av)
    };

    state.types[path] = {
      type: av,
      span,
      data: defaults(data, av.metaData)
    };

    if (!av.originNode) {
      return;
    }

    const node = av.originNode;
    const ast = node.sourceFile.ast;
    let defNode, type;

    try {
      type = infer.expressionType({
        node: defNode,
        state
      });
    } catch (err) {}

    state.types[path].data = defaults(
      {
        isConstructor: isConstructor(state, type)
      },
      state.types[path].data
    );

    forceArray(av.types).forEach(type => {
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
  Object.keys(state.types)
    .sort()
    .forEach(path => {
      const data = state.types[path];
      seenSpans[data.span] = true;

      data.data = defaults(
        {
          isConstructor: isConstructor(state, get(data, 'type')),
          type: getType(state, {
            types: [data.type]
          })
        },
        data.data
      );

      if (data.type.originNode) {
        visitNode(state, data.type.originNode, path);
      }
    });

  Object.keys(state.types)
    .sort()
    .forEach(path => {
      const data = state.types[path];

      Object.keys(get(data, 'type.props', {})).forEach(prop => {
        visitAVal(state, data.type.props[prop], joinPaths(path, prop));
      });
    });

  // Assume that file scope is not reachable.
  state.cx.parent.files.forEach(file => {
    const path = file.name.replace(/\./g, '`');
    visitScope(state, file.scope, path);

    if (state.isTarget(file.name)) {
      visitNode(state, file.ast, path);
    }
  });
};

tern.registerPlugin('local-scope', (server, options) => {
  return {
    passes: {
      postCondenseReach(state) {
        postCondenseReach(server, options, state);
      }
    }
  };
});
