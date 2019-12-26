import { fromFile } from "../pooky/ast.js";
import * as recast from "recast";
import generate from "@babel/generator";

import { replaceXORedIdentifiers } from "../pooky/decode.js";
import { removeDebugger } from "../pooky/debugger.js";

let currentFile = process.argv.slice(-1)[0];
let currentTree = fromFile(`${currentFile}`);
replaceXORedIdentifiers(currentTree);
removeDebugger(currentTree);
const { code } = generate(currentTree, { compact: true, retainLines: true });
console.log(code);
