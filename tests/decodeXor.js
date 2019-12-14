const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");

const { replaceXORedIdentifiers } = require("../pooky/decode.js");
const { removeDebugger } = require("../pooky/debugger.js");


let currentFile = process.argv.slice(-1)[0];
let currentTree = fromFile(`${currentFile}`);
replaceXORedIdentifiers(currentTree);
removeDebugger(currentTree);
console.log(recast.print(currentTree).code);
