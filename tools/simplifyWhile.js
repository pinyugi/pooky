const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");
const traverse = require("@babel/traverse").default;
const generate = require('@babel/generator').default;

const { StateManager, utils } = require("../pooky/flow");



CONTROL_FLOW_VISITOR = {
  "WhileStatement"(path) {
    if (utils.isWhileAControlFlow(path)) {
      const stateHolderName = utils.getStateHolderName(path);
      const manager = StateManager.fromPath(path);

      if (part != "--all") {
        if (stateHolderName !== part) {
          return;
        }
			}
      manager.simplify(path);
    }
  },
};

let currentPooky = process.argv.slice(-2)[0];
let part = process.argv.slice(-1)[0];

let currentTree = fromFile(`${currentPooky}`);
traverse(currentTree, CONTROL_FLOW_VISITOR);
const { code } = generate(currentTree, {compact : true, retainLines : true});
console.log(code);
