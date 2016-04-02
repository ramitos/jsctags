// Based on defnode.js (https://github.com/sourcegraph/defnode.js)

var walk = require('acorn/dist/walk');

var walkall = require('./walkall');

// findDefinitionNode takes the start/end position of an Identifier node and
// returns the definition node (in ast) corresponding to the definition that
// the Identifier identifies. For a FunctionDeclaration name, this is the
// FunctionDeclaration; for a VariableDeclaration variable name, this is the
// VariableDeclarator init; for ObjectExpression keys, this is the
// corresponding value; for function parameters, this is itself; and for all
// other inputs, this is undefined.
//
// This mapping is intended to correspond to what tern considers the identifier
// of a given definition. I.e., if you use tern to ask for the definition of
// some symbol, and it gives you an Identifier, you can use findDefinitionNode
// to find the definition value of the Identifier.
exports.findDefinitionNode = function(ast, start, end) {
  var origin = exports.findOriginPseudonode(ast, start, end);

  if (!origin) {
    return;
  }

  if (!origin.type && origin.key && origin.value && origin.kind) {
    // ObjectExpression property
    return origin.value;
  }

  switch (origin.type) {
    case 'AssignmentExpression':
      return rightmostExprOfAssignment(origin);
    case 'Identifier':
      return origin;
    case 'VariableDeclarator':
      return origin.init && rightmostExprOfAssignment(origin.init);
    default:
      return origin;
  }
};

// findNameNodes finds the Identifier AST node(s) corresponding to a definition
// node (in ast).
//
// This mapping is intended to correspond to the mapping between a tern defs
// JSON file !span and the names/paths of keys pointing to that !span.
exports.findNameNodes = function(ast, start, end) {
  var def = walk.findNodeAt(ast, start, end, null, walkall.traversers);

  if (!def) {
    throw new Error('No definition node found at position ' + start + '-' + end);
  }

  def = def.node;

  // When we search for the enclosing node, we don't want to just end up with
  // the def node itself, so exclude it (node != def).
  var test = function(type, node) {
    return (def.type === 'FunctionDeclaration' && type === 'FunctionDeclaration') ||
      (node !== def && ['AssignmentExpression', 'FunctionDeclaration', 'FunctionExpression', 'ObjectExpression', 'VariableDeclarator'].indexOf(type) !== -1);
  };

  var enc = walk.findNodeAround(ast, end, test, walkall.traversers);

  if (!enc) {
    throw new Error('No enclosing declaration node found for definition at position ' + end);
  }

  enc = enc.node;
  switch (enc.type) {
    case 'AssignmentExpression':
      // We only want to consider Identifiers and MemberExpression properties as
      // name nodes for this definition. Anything else is not really a receiver
      // of this definition.
      return collectChainedAssignmentNames(ast, enc);
    case 'FunctionDeclaration':
    case 'FunctionExpression':
      if (enc === def) {
        return def.id && [def.id];
      }

      if (enc.params.indexOf(def) !== -1) {
        // the def is a function param
        return [def];
      }

      break;
    case 'ObjectExpression':
      var prop = findPropInObjectExpressionByValuePos(enc, start, end);

      if (!prop) {
        throw new Error('No property found for ObjectExpression value at position ' + start + '-' + end);
      }

      return [prop.key];
    case 'VariableDeclarator':
      return [enc.id];
  }
};

// findOriginPseudonode finds the AST node or node-like object of the
// declaration/definition that encloses the Identifier AST node with the
// specified start/end.
//
// This function returns ObjectExpression property objects if the Identifier is
// an ObjectExpression property key. These objects are not true AST nodes (thus
// the "pseudonode" description).
exports.findOriginPseudonode = function(ast, start, end) {
  var nameNode = walk.findNodeAt(ast, start, end, okNodeTypes(['Identifier', 'Literal']), walkall.traversers);

  if (!nameNode) {
    throw new Error('No name node found at position ' + start + '-' + end);
  }

  nameNode = nameNode.node;

  // find enclosing decl-like node
  var enc = walk.findNodeAround(ast, end, okNodeTypes([
    'AssignmentExpression',
    'FunctionDeclaration',
    'FunctionExpression',
    'ObjectExpression',
    'VariableDeclarator'
  ]), walkall.traversers);

  if (!enc) {
    throw new Error('No enclosing declaration node found for Identifier at position ' + start + '-' + end);
  }

  enc = enc.node;

  switch (enc.type) {
    case 'AssignmentExpression':
      // We only want to consider this assignment a definition if our name node
      // is the LHS of the AssignmentExpression, or the property of the
      // AssignmentExpression's LHS MemberExpression. Otherwise, we're not really
      // defining something with this ident.
      if (enc.left === nameNode || (enc.left.type === 'MemberExpression' && identOrLiteralString(enc.left.property) === identOrLiteralString(nameNode))) {
        return enc;
      }

      break;
    case 'FunctionDeclaration':
    case 'FunctionExpression':
      if (enc.id === nameNode) {
        // the ident is the function name
        return enc;
      } else if (enc.params.indexOf(nameNode) !== -1) {
        // the ident is a function param
        return nameNode;
      }

      break;
    case 'ObjectExpression':
      return findPropInObjectExpressionByKeyPos(enc, start, end);
    case 'VariableDeclarator':
      return enc;
  }
};

function okNodeTypes(types) {
  return function(_t) {
    return types.indexOf(_t) !== -1;
  };
}

function findPropInObjectExpressionByKeyPos(objectExpr, start, end) {
  for (var i = 0; i < objectExpr.properties.length; ++i) {
    var prop = objectExpr.properties[i];
    if (prop.key.start === start && prop.key.end === end) {
      return prop;
    }
  }
}

function findPropInObjectExpressionByValuePos(objectExpr, start, end) {
  for (var i = 0; i < objectExpr.properties.length; ++i) {
    var prop = objectExpr.properties[i];
    if (prop.value.start === start && prop.value.end === end) {
      return prop;
    }
  }
}

// rightmostExprOfAssignment follows chained AssignmentExpressions to the rightmost
// expression. E.g., given the AssignmentExpression AST node of `a = b = c =
// 7`, it returns the Literal value 7 on the far right.
function rightmostExprOfAssignment(assignmentExpr) {
  while (assignmentExpr.type === 'AssignmentExpression') {
    assignmentExpr = assignmentExpr.right;
  }
  return assignmentExpr;
}

function collectChainedAssignmentNames(ast, expr, seen) {
  var names = [];
  if (expr.type === 'VariableDeclarator') {
    names.push(expr.id);
  } else if (expr.left.type === 'Identifier') {
    names.push(expr.left);
  } else if (expr.left.type === 'MemberExpression' && identOrLiteralString(expr.left.property)) {
    names.push(expr.left.property);
  }

  // Avoid infinite loop (AssignmentExpr and VariableDeclarator have same end pos).
  if (!seen) {
    seen = [];
  }

  seen.push(expr);

  // Traverse to parent AssignmentExpressions to return all names in chained assignments.
  var test = function(type, node) {
    return seen.indexOf(node) === -1 && ((type === 'AssignmentExpression' && node.right === expr) || (type === 'VariableDeclarator' && node.init === expr));
  };

  var outer = walk.findNodeAround(ast, expr.end, test, walkall.traversers);
  if (outer) {
    names.push.apply(names, collectChainedAssignmentNames(ast, outer.node, seen));
  }

  return names;
}

// identOrLiteralString takes an AST node whose type is either Identifier or
// Literal and returns the Identifier name or Literal string value. It is
// useful when you have a name node in an ObjectExpression property or
// MemberExpression property, which could be either an Identifier or Literal,
// and you just want to extract the string name.
var identOrLiteralString = exports.identOrLiteralString = function(n) {
  if (n.type === 'Identifier') {
    return n.name;
  }

  if (n.type === 'Literal' && typeof n.value === 'string') {
    return n.value;
  }
};
