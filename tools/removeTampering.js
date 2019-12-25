const { removeTamperingChecks } = require("../pooky/tampering.js");
const fromFile = require("../pooky/ast.js").fromFile;
const generate = require("@babel/generator").default;

let addLocalStorage = process.argv.slice(-1)[0];
let currentPooky = process.argv.slice(-2)[0];
let currentTree = fromFile(currentPooky);
removeTamperingChecks(currentTree, currentPooky, addLocalStorage == "yes" ? true : false);
const { code } = generate(currentTree, { compact: true, retainLines: true }); 
console.log(code);
