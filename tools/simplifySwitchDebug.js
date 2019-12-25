const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");
const traverse = require("@babel/traverse").default;

const { ControlFlow, utils } = require("../pooky/flow");

CONTROL_FLOW_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (utils.isForAControlFlow(path)) {
      const stateHolderName = utils.getStateHolderName(path);
      const flow = ControlFlow.fromPath(path, (debug = true));

      if (part != "--all") {
        if (stateHolderName !== part) {
          return;
        }
      }
      flow.simplify(path);
    }
  },
};

let currentPooky = process.argv.slice(-2)[0];
let part = process.argv.slice(-1)[0];

let currentTree = fromFile(`${currentPooky}`);
traverse(currentTree, CONTROL_FLOW_VISITOR);
console.log(recast.print(currentTree).code);
