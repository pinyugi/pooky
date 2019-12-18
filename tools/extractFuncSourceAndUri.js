const fs = require("fs");
const fromFile = require("../pooky/ast.js").fromFile;
const { getEvalFuncArguments, getEvalFuncName, cutEvalFunctionSourceCode } = require("../pooky/tampering.js");

let currentPooky = process.argv.slice(-2)[0];
let saveLocation = process.argv.slice(-1)[0];
fs.readFile(currentPooky, "utf8", (err, data) => {

	const ast = fromFile(currentPooky);
	const funcName = getEvalFuncName(ast);
	const sourceCodes = cutEvalFunctionSourceCode(data, funcName);
	const rawArguments = getEvalFuncArguments(ast);
	const zip = (x, y) => x.map((k, i) => [k, y[i]]);
	const zipUp = zip(sourceCodes, rawArguments).flat(Infinity);

	fs.writeFile(saveLocation, zipUp.join("\r\n"), (err) => {})
});
