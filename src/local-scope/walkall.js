// Based on acorn-walkall (https://github.com/sourcegraph/acorn-walkall)

// types is an array of all SpiderMonkey AST node types recognized by acorn.
var types = exports.types = [
  'ArrayExpression',
  'AssignmentExpression',
  'BinaryExpression',
  'BlockStatement',
  'BreakStatement',
  'CallExpression',
  'CatchClause',
  'ClassDeclaration',
  'ComprehensionExpression',
  'ConditionalExpression',
  'ContinueStatement',
  'DebuggerStatement',
  'DoWhileStatement',
  'EmptyStatement',
  'ExportDeclaration',
  'ExportNamedDeclaration',
  'Expression',
  'ExpressionStatement',
  'ForInStatement',
  'ForInit',
  'ForStatement',
  'ArrowFunctionExpression',
  'Function',
  'FunctionDeclaration',
  'FunctionExpression',
  'Identifier',
  'IfStatement',
  'ImportDeclaration',
  'ImportSpecifier',
  'ImportDefaultSpecifier',
  'LabeledStatement',
  'Literal',
  'LogicalExpression',
  'MemberExpression',
  'MethodDefinition',
  'NewExpression',
  'ObjectExpression',
  'ObjectPattern',
  'Program',
  'ReturnStatement',
  'ScopeBody',
  'SequenceExpression',
  'Statement',
  'SwitchCase',
  'SwitchStatement',
  'TaggedTemplateExpression',
  'ThisExpression',
  'ThrowStatement',
  'TryStatement',
  'UnaryExpression',
  'UpdateExpression',
  'VariableDeclaration',
  'VariableDeclarator',
  'WhileStatement',
  'WithStatement',
  'Property'
];

// makeVisitors returns an object with a property keyed on each AST node type whose value is c.
exports.makeVisitors = function(c) {
  var visitors = {};
  for (var i = 0; i < types.length; ++i) {
    var type = types[i];
    visitors[type] = c;
  }
  return visitors;
};

// traverser is an AST visitor that programmatically traverses the AST node by inspecting its object
// structure (as opposed to following hard-coded paths).
exports.traverser = function(node, st, c) {
  var keys = Object.keys(node).sort();
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var v = node[key];

    if (!v) {
      continue;
    }

    if (v instanceof Array) {
      for (var j = 0; j < v.length; ++j) {
        if (v[j].type) {
          c(v[j], st);
        } else if (typeof v[j] === 'object') {
          exports.traverser(v[j], st, c);
        }
      }
    } else if (typeof v === 'object' && !(v instanceof RegExp) && v.type) {
      c(v, st);
    }
  }
};

// traversers is an AST walker that uses the traverser visitor for all AST node types.
exports.traversers = exports.makeVisitors(exports.traverser);
