import * as fs from 'fs';
import { fromFile } from "../pooky/ast.js";
import { fromString } from "../pooky/ast.js";
import generate from "@babel/generator";
import { decodeEvalFunction } from "../pooky/xor.js");
import { unmaskEverything, getXorForDecodeFunction, getUriDataForDecodeFunction, createDecodeFunction, getFunctionMaskNames, getAliasForDecodeFunction, getAllMaskValues } from "../pooky/mask.js");
import { getEvalFuncArguments, getEvalFuncName, cutEvalFunctionSourceCode } from "../pooky/tampering.js";

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
