const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");

const { optimizeNodes } = require("../pooky/switch");

function cleanAllNodes(ast) {
  let nodes = [];

  if (ast.program.body[0].type == "FunctionDeclaration") {
    nodes = ast.program.body[0].body.body;
  } else {
    nodes = ast.program.body;
  }

  optimizeNodes(nodes);
}

let fileName = process.argv.slice(-1)[0];

let currentTree = fromFile(`${fileName}`);
cleanAllNodes(currentTree);
console.log(recast.print(currentTree).code);
