const fromFile = require("../pooky/ast.js").fromFile;
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const recast = require("recast");

const { ControlFlow, utils } = require("../pooky/flow");

CONTROL_FLOW_VISITOR = {
  ForStatement(path) {
    if (utils.isForAControlFlow(path)) {
      const flow = ControlFlow.fromPath(path);
      flow.simplify(path);
    }
  },
};

CONTROL_FLOW_VISITOR_WHILE = {
  WhileStatement(path) {
    if (utils.isWhileAControlFlow(path)) {
      const flow = ControlFlow.fromPath(path);
      flow.simplify(path);
    }
  },
};

let currentPooky = process.argv.slice(-1)[0];

let currentTree = fromFile(`${currentPooky}`);
traverse(currentTree, CONTROL_FLOW_VISITOR);

traverse(currentTree, CONTROL_FLOW_VISITOR_WHILE);
//const { code } = generate(currentTree);
//console.log(code);
console.log(recast.print(currentTree).code);
