import { fromFile } from "../pooky/ast.js";
import traverse from "@babel/traverse";;

import { ControlFlow, getStateHolderName, isForAControlFlow } from "../pooky/flow";

const tree = {
  "pooky": fromFile("fixtures/pooky.min.b7a5e4c22669c5887624.js"),
  "while_loop": fromFile("flowcharts/while_loop.js"),
  "pooky-q9qC": fromFile("fixtures/pookyparts/q9qC.js"),
};

CONTROL_FLOW_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (isForAControlFlow(path)) {
      const stateHolderName = getStateHolderName(path);
      if (stateHolderName == process.argv.slice(-1)[0]) {
        const flow = ControlFlow.fromPath(path);

        for (let state in flow.states) {
          if (state == process.argv.slice(-2)[0]) {
            const { result, meta } = flow.traverser.evaluator.interpret(state);
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
