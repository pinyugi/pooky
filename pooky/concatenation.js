import * as t from "@babel/types";
import * as recast from "recast";
import traverse from "@babel/traverse";;

import {
  getFunctionMaskNames,
  getAllMaskValues,
  createDecodeFunction,
  getXorForDecodeFunction,
  getUriDataForDecodeFunction,
} from "./mask.js";

// path.get("declarations.0.id.name").node
function isVarDecArguments(path) {
  return (
    path.get("declarations.0.init").type == "ArrayExpression" &&
    path.get("declarations.0.init.elements").length == 1 &&
    path.get("declarations.0.init.elements.0.name").node == "arguments"
  );
}

//function replaceArgumentMembers(path, )

function maybeAssignment(path, name) {
  return (
    path.get("expression").type == "AssignmentExpression" &&
    (path.get("expression.operator").node == "=" || path.get("expression.operator").node == "+=") &&
    path.get("expression.left.object.name").node == name
  );
}

export function concatenateArguments(ast) {
  const { xorParam, xorFuncName } = getXorForDecodeFunction(ast);
  //const uri = getUriDataForDecodeFunction(ast);
  //const decoder = createDecodeFunction(xor, uri);
  //const funcNames = getFunctionMaskNames(ast);
  //const maskValues = getAllMaskValues(ast, funcNames);
  const varDeclarations = {};

  unmaskEverything(ast);

  /*	
	traverse(ast, {
		"VariableDeclaration"(path){
			if(isVarDecArguments(path)){
				const name = path.get("declarations.0.id.name").node
				varDeclarations[name] = {};

				const keepLooping = true;
				let nextPath = path.getNextSibling();

				while(keepLooping || !nextPath){

					if(maybeAssignment(nextPath, name)){
						const subscript = path("expression.left.property.value").node;
						const value = path("expression.right.property.value").node;
						const operator = path("expression.operator").node;

						if(VariableDeclaration[name].hasOwnProperty(subscript) && operator == "+="){

						}else if(VariableDeclaration[name].hasOwnProperty(subscript) && operator == "="){
							VariableDeclaration[name][subscript] = 

						}

					}else{
						keepLooping = false;
					}


				}
			}
		}
	});
	*/
}


