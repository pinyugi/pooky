const t = require("@babel/types");
const recast = require("recast");
const traverse = require("@babel/traverse").default;

const {
  getFunctionMaskNames,
  getAllMaskValues,
  createDecodeFunction,
  getXorForDecodeFunction,
  getUriDataForDecodeFunction,
} = require("./mask.js");

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

function concatenateArguments(ast) {
  //const xor = getXorForDecodeFunction(ast);
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

function unmaskEverything(ast, source) {
  const xor = getXorForDecodeFunction(ast);
  const uri = getUriDataForDecodeFunction(ast);
  const decoder = createDecodeFunction(xor, uri);
  const funcNames = getFunctionMaskNames(ast);
  const maskValues = getAllMaskValues(ast, funcNames);

  traverse();
}

module.exports = {
  concatenateArguments,
};
