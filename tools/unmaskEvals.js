const fs = require("fs");
const fromFile = require("../pooky/ast.js").fromFile;
const fromString = require("../pooky/ast.js").fromString;
const generate = require("@babel/generator").default;
const { decodeEvalFunction } = require("../pooky/xor.js");
const { unmaskEverything, getXorForDecodeFunction, getUriDataForDecodeFunction, createDecodeFunction, getFunctionMaskNames, getAliasForDecodeFunction, getAllMaskValues } = require("../pooky/mask.js");
const { getEvalFuncArguments, getEvalFuncName, cutEvalFunctionSourceCode } = require("../pooky/tampering.js");

let currentPooky = process.argv.slice(-1)[0];

let pookyAST = fromFile(currentPooky);
const pookySource = fs.readFileSync(currentPooky, "utf8");

const funcName = getEvalFuncName(pookyAST);
const sourceCodes = cutEvalFunctionSourceCode(pookySource, funcName);
const evalRawArguments = getEvalFuncArguments(pookyAST);

const { foundDecodeFunction, xorParam, xorFuncName } = getXorForDecodeFunction(pookyAST);
const xorAliasFuncNames = getAliasForDecodeFunction(pookyAST, xorFuncName);
const uri = getUriDataForDecodeFunction(pookyAST);
const decoder = createDecodeFunction(xorParam, uri);
const maskFuncNames = getFunctionMaskNames(pookyAST);
const maskValues = getAllMaskValues(pookyAST, maskFuncNames);


const zip = (x, y) => x.map((k, i) => [k, y[i]]);
const evaledSourcesUri = zip(sourceCodes, evalRawArguments).map((sourceAndUri) => {

	const [sourceCode, uri] = sourceAndUri;
	const decodedEval = decodeEvalFunction(sourceCode, uri);	
	console.log(decodedEval);

	//const evalAST = fromString(decodedEval);
	//console.log("pookyAST", evalAST);

	//unmaskEverything(pookyAST, evalAST);


	//console.log(decodedEval);
	return decodedEval;

});


//console.log(evaledSourcesUri);

/*
const { code } = generate(pookyAST, { compact: true, retainLines: true }); 
console.log(code);
*/
