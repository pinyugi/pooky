import { fromFile } from "../pooky/ast.js";
import * as recast from "recast";
import traverse from "@babel/traverse";;
import generate from "@babel/generator";

import { ControlFlow, isWhileAControlFlow, getStateHolderName } from "../pooky/flow";

CONTROL_FLOW_VISITOR = {
  WhileStatement(path) {
    if (isWhileAControlFlow(path)) {
      const stateHolderName = getStateHolderName(path);
      const flow = ControlFlow.fromPath(path);

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
const { code } = generate(currentTree, { compact: true, retainLines: true });
console.log(code);
