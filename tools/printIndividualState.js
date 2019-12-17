const fromFile = require("../pooky/ast.js").fromFile;
const traverse = require("@babel/traverse").default;


const { StateManager, utils } = require("../pooky/flow");

const tree = {
  "pooky": fromFile("fixtures/pooky.min.b7a5e4c22669c5887624.js"),
  "while_loop": fromFile("flowcharts/while_loop.js"),
  "pooky-q9qC": fromFile("fixtures/pookyparts/q9qC.js"),
};

CONTROL_FLOW_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (utils.isForAControlFlow(path)) {
      const stateHolderName = utils.getStateHolderName(path);
      if (stateHolderName == process.argv.slice(-1)[0]) {
        const manager = StateManager.fromPath(path);

        for (let state in manager.states) {
          if (state == process.argv.slice(-2)[0]) {
            const { result, meta } = manager.traverser.evaluator.interpret(state);
            console.log("state:", state, " result:", result, " meta:", meta);
          }
        }
      }
    }
  },
};

let currentTree = fromFile(`${process.argv.slice(-1)[0]}`);

traverse(currentTree, CONTROL_FLOW_VISITOR);
//console.log(recast.print(currentTree).code);
