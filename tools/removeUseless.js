const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");
const { isUselessAssignment, isUselessFunc, isUselessBigFunc, isAliasFunc } = require("../pooky/utils.js");


function removeUselessTopAssignments(ast){
	const cleaned = [];
	ast.program.body.forEach((n) => !isUselessAssignment(n) ? cleaned.push(n) : "");
	ast.program.body = cleaned;
}
function removeUselessFuncs(ast){
	const cleaned = [];
	ast.program.body.forEach((n) => !isUselessFunc(n) ? cleaned.push(n) : "");
	ast.program.body = cleaned;
}
function removeBigFunc(ast){
	const cleaned = [];
	ast.program.body.forEach((n) => !isUselessBigFunc(n) ? cleaned.push(n) : "");
	ast.program.body = cleaned;
}

function removeAliasFuncs(ast){
	const cleaned = [];
	ast.program.body.forEach((n) => !isAliasFunc(n) ? cleaned.push(n) : "");
	ast.program.body = cleaned;
}


let currentTree = fromFile(`${process.argv.slice(-2)[0]}`);
let parts = process.argv.slice(-1)[0];

if(parts == "--all"){

	removeBigFunc(currentTree);
	removeUselessTopAssignments(currentTree);
	removeUselessFuncs(currentTree);
	removeAliasFuncs(currentTree);
}else if (parts == "--bigfunc"){
	removeBigFunc(currentTree);
}else if (parts == "--assignments"){
	removeUselessTopAssignments(currentTree);
}else if (parts == "--funcs"){
	removeUselessFuncs(currentTree);
}else if (parts == "--alias"){
	removeAliasFuncs(currentTree);

}


console.log(recast.print(currentTree).code);
