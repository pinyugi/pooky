const t = require("@babel/types");
const recast = require("recast");
const traverse = require("@babel/traverse").default;

function isDecoderVarDec(path){
	return (
		path.get("declarations").length == 5 && 
		path.get("declarations.4.init").type == "SequenceExpression" &&
		path.get("declarations.4.init.expressions.0.right").type == "CallExpression" &&
		path.get("declarations.4.init.expressions.0.right.callee.name").node == "decodeURI" 
	);

}

function extractXORDecoder(path){
	
	const bodyNodes = [];
	const parent = path.getStatementParent();
	const whileNode = path.getStatementParent().getSibling(parent.key+1);
	const decoderVariable = path.getStatementParent().getSibling(parent.key+2);
	const decoderVariableName = decoderVariable.get("declarations.0.id.name").node;
		
	bodyNodes.push(parent.node, whileNode.node, decoderVariable.node);

	const evaled = bodyNodes.map((node) => recast.print(node).code).join("\n");
	
	const iife = (function() {
		eval(evaled);
		return eval(`${decoderVariableName};`);
	})()

	parent.remove();
	whileNode.remove();
	decoderVariable.remove();

	return { [decoderVariableName] : iife };

}

function hasXORedIdentifier(path, xoredIdentifiers){
	const name = path.get("object.name").node;
	return xoredIdentifiers.hasOwnProperty(name);
}
function replaceXORedIdentifiers(ast){
	const xoredIdentifiers = {};

	traverse(ast, {
		"VariableDeclaration"(path) {
			if (isDecoderVarDec(path)){
				const xorDecoder = extractXORDecoder(path);
				Object.assign(xoredIdentifiers, xorDecoder);

			}
		}
	});

	traverse(ast, {
		"MemberExpression"(path){
			if (hasXORedIdentifier(path, xoredIdentifiers)){

				const name = path.get("object.name").node;
				const index = path.get("property.value").node;
				//console.log("found:", xoredIdentifiers[name][index]);
				path.replaceWith(t.stringLiteral(xoredIdentifiers[name][index]));
			}
		}

	});
	//console.log(xoredIdentifiers);
}

module.exports = {
	replaceXORedIdentifiers
};
