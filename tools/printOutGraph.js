import { fromFile } from "../pooky/ast.js";
import traverse from "@babel/traverse";;

import { ControlFlow, isForAControlFlow, getStateHolderName } from "../pooky/flow";

const uniqueStates = new Set();
const count = {};
CONTROL_FLOW_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (isForAControlFlow(path)) {
      const stateHolderName = getStateHolderName(path);
      const flow = ControlFlow.fromPath(path);

      if (stateHolderName !== part) {
        return;
      }
      console.log("ARROWS");

      flow.graph
        .$()
        .edges()
        .map((n) => {
          const source = n.source().map((n) => n.id())[0];
          const target = n.target().map((n) => n.id())[0];

          const transitionsTotal = flow.states[source].transition._states.length;

          if (transitionsTotal == 2) {
            const transition = flow.states[source].transition._states.indexOf(parseInt(target, 10));
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
traverse(currentTree, CONTROL_FLOW_VISITOR);
