import { removeTamperingChecks }  from "../pooky/tampering.js";
import { fromFile } from "../pooky/ast.js";
import generate from "@babel/generator";

let addLocalStorage = process.argv.slice(-1)[0];
let currentPooky = process.argv.slice(-2)[0];
let currentTree = fromFile(currentPooky);
removeTamperingChecks(currentTree, currentPooky, addLocalStorage == "yes" ? true : false);
const { code } = generate(currentTree, { compact: true, retainLines: true }); 
console.log(code);
