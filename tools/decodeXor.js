const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");
const generate = require("@babel/generator").default;

const { replaceXORedIdentifiers } = require("../pooky/decode.js");
const { removeDebugger } = require("../pooky/debugger.js");

let currentFile = process.argv.slice(-1)[0];
let currentTree = fromFile(`${currentFile}`);
replaceXORedIdentifiers(currentTree);
removeDebugger(currentTree);
const { code } = generate(currentTree, { compact: true, retainLines: true });
console.log(code);
