import { fromFile } from "../pooky/ast.js";
import traverse from "@babel/traverse";;
import generate from "@babel/generator";

import { ControlFlow, isForAControlFlow, isWhileAControlFlow } from "../pooky/flow";

CONTROL_FLOW_VISITOR = {
  ForStatement(path) {
    if (isForAControlFlow(path)) {
      const flow = ControlFlow.fromPath(path);
      flow.simplify(path);
    }
  },
};

CONTROL_FLOW_VISITOR_WHILE = {
  WhileStatement(path) {
    if (isWhileAControlFlow(path)) {
      const flow = ControlFlow.fromPath(path);
      flow.simplify(path);
    }
  },
};

let currentPooky = process.argv.slice(-1)[0];

let currentTree = fromFile(`${currentPooky}`);
traverse(currentTree, CONTROL_FLOW_VISITOR);
traverse(currentTree, CONTROL_FLOW_VISITOR_WHILE);
const { code } = generate(currentTree, { compact: true, retainLines: true });
console.log(code);
