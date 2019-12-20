const t = require("@babel/types");
const traverse = require("@babel/traverse").default;

function removeDebugger(ast) {
  traverse(ast, {
    DebuggerStatement(path) {
      path.remove();
    },
  });
}

module.exports = {
  removeDebugger,
};
