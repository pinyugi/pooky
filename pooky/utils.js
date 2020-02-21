function isUselessAssignment(node){
	return (
		node.type == "ExpressionStatement" &&
		node.expression.type == "AssignmentExpression" &&
		node.expression.left.type == "MemberExpression" &&
		(
			node.expression.right.type == "StringLiteral" || 
			node.expression.right.type == "NumericLiteral" ||
			node.expression.right.type == "BooleanLiteral" ||
			node.expression.right.type == "NullLiteral"
		)
	);
} 

function isUselessFunc(node){
	return (
		node.type == "FunctionDeclaration" &&
		node.body.type == "BlockStatement" &&
		!node.body.body.length
	);
}
function isUselessBigFunc(node){
	return (
		node.type == "ExpressionStatement" &&
		node.expression.type == "CallExpression" &&
		node.expression.arguments.length && 
		node.expression.arguments[0].type == "ArrayExpression" &&
		node.expression.callee.type == "CallExpression" &&
		node.expression.callee.callee.type == "FunctionExpression"
	);
	
}

function isAliasFunc(node){
	return (
		node.type == "ExpressionStatement" &&
		node.expression.type == "AssignmentExpression" &&
		node.expression.right.type == "FunctionExpression" &&
		node.expression.right.body.type == "BlockStatement" &&
		node.expression.right.body.body.length &&
		node.expression.right.body.body[0].type == "ReturnStatement" && 
		node.expression.right.body.body[0].argument.type == "ConditionalExpression" && 
		node.expression.right.body.body[0].argument.test.type == "BinaryExpression" && 
		node.expression.right.body.body[0].argument.test.operator == "===" && 
		node.expression.right.body.body[0].argument.test.left.type == "UnaryExpression" && 
		node.expression.right.body.body[0].argument.test.left.operator == "typeof" 
	);
	
}

module.exports = {
	isUselessAssignment,
	isUselessFunc,
	isUselessBigFunc,
	isAliasFunc
};