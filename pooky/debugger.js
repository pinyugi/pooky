import * as t from "@babel/types";
import traverse from "@babel/traverse";;

export function removeDebugger(ast) {
  traverse(ast, {
    DebuggerStatement(path) {
      path.remove();
    },
  });
}

