const fromFile = require("../pooky/ast.js").fromFile;
const traverse = require("@babel/traverse").default;


const { StateManager, utils } = require("../pooky/switch");

const uniqueStates = new Set();
const count = {};
SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (utils.isForAGoToSwitch(path)) {
      const stateHolderName = utils.getStateHolderName(path);
      const manager = StateManager.fromPath(path);

      if (stateHolderName !== part) {
        return;
      }
      console.log("ARROWS");

      manager.graph
        .$()
        .edges()
        .map((n) => {
          const source = n.source().map((n) => n.id())[0];
          const target = n.target().map((n) => n.id())[0];

          const transitionsTotal = manager.states[source].transition._states.length;

          if (transitionsTotal == 2) {
            const transition = manager.states[source].transition._states.indexOf(parseInt(target, 10));
            console.log(`${source}->${target}["${transition ? "false" : "true"}"]`);
          } else {
            console.log(`${source}->${target}`);
          }
        });
    }
  },
};

let currentPooky = process.argv.slice(-2)[0];
let part = process.argv.slice(-1)[0];

let currentTree = fromFile(`${currentPooky}`);
traverse(currentTree, SWITCH_TRANSITION_VISITOR);

const uniqueCount = Array.from(uniqueStates).map(function(e, i) {
  return `Count:${count[e]} ${e}`;
});
