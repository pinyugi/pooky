const fromFile = require("../pooky/ast.js").fromFile;
const traverse = require("@babel/traverse").default;

const { StateManager, utils } = require("../pooky/flow");

const uniqueStates = new Set();
const count = {};
CONTROL_FLOW_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (utils.isForAControlFlow(path)) {
      const stateHolderName = utils.getStateHolderName(path);
      const manager = StateManager.fromPath(path);

      if (stateHolderName !== part) {
        return;
      }
      console.log("stateHolderName:", stateHolderName);

      for (let state in manager.states) {
        const { result, meta } = manager.traverser.evaluator.interpret(state);
        console.log("state:", state, " result:", result, " meta:", meta);
        const key = `state: ${state}  result: ${result}  meta: ${JSON.stringify(meta)}`;
        uniqueStates.add(key);

        if (count.hasOwnProperty(key)) {
          count[key] += 1;
        } else {
          count[key] = 1;
        }
      }
    }
  },
};

let currentPooky = process.argv.slice(-2)[0];
let part = process.argv.slice(-1)[0];

let currentTree = fromFile(`${currentPooky}`);
traverse(currentTree, CONTROL_FLOW_VISITOR);
