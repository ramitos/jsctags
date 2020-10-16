const infer = require('tern/lib/infer');
const tern = require('tern/lib/tern');
// Var defs = require('tern/defs/react.json');
const acorn = require('acorn');
const walk = require('acorn-walk');
const { inject } = require('./acorn-jsx');

// Override acorn.walk with JSX
// see https://github.com/chtefi/acorn-jsx-walk/blob/master/index.js
const overrideAcornWalkBase = () => {
  const { base } = walk;
  base.JSXElement = (node, st, c) => {
    node.children.forEach((n) => {
      c(n, st);
    });
  };

  base.JSXExpressionContainer = (node, st, c) => {
    c(node.expression, st);
  };

  base.JSXEmptyExpression = (node, st, c) => {
    c(node, st);
  };
};

const overrideTernScopeGatherer = () => {
  // If (!infer.scopeGatherer) return;
  const { scopeGatherer } = infer;
  scopeGatherer.JSXElement = () => {
    // Console.log(node)
  };
};

const overrideTernInferWrapper = () => {
  // If (!infer.inferWrapper) return;
  const { inferWrapper } = infer;
  inferWrapper.JSXElement = () => {
    // Console.log(node)
  };
};

const overrideTernTypeFinder = () => {
  // If (!infer.typeFinder) return;
  const { typeFinder } = infer;
  typeFinder.JSXElement = (node, scope) => {
    // Console.log(node)
    return scope;
  };
};

const overrideTernSearchVisitor = () => {
  // If (!infer.searchVisitor) return;
  const { searchVisitor } = infer;
  searchVisitor.JSXElement = () => {
    // Console.log(node)
  };
};

tern.registerPlugin('jsx', () => {
  inject(acorn);
  overrideAcornWalkBase();
  overrideTernScopeGatherer();
  overrideTernInferWrapper();
  overrideTernTypeFinder();
  overrideTernSearchVisitor();

  // Server.addDefs(defs);
  // server.on('preParse', function(text, options) {
  //   var plugins = options.plugins;
  //   if (!plugins) plugins = options.plugins = {};
  //   plugins.jsx = true;
  // });
});
