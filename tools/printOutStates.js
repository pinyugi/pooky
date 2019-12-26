import { fromFile } from "../pooky/ast.js";
import traverse from "@babel/traverse";;

import { ControlFlow, isForAControlFlow, getStateHolderName } from "../pooky/flow";

const uniqueStates = new Set();
const count = {};
CONTROL_FLOW_VISITOR = {
  "ForStatement"(path) {
    if (isForAControlFlow(path)) {
      const stateHolderName = getStateHolderName(path);
      const flow = ControlFlow.fromPath(path);

      if (stateHolderName !== part) {
        return;
      }
      console.log("stateHolderName:", stateHolderName);

      for (let state in flow.states) {
        const { result, meta } = flow.traverser.evaluator.interpret(state);
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
