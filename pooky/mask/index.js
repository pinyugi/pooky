
const fromFile = require("../ast.js").fromFile;
const fromString = require("../ast.js").fromString;

const SOURCES = {
	AST : 1,
	STRING : 2,
	FILE : 3
}

class UnMasker{

	constructor(code, source=SOURCES.AST){
		this.ast = this.setAST(code, source);
	}

	cleanCode(code, source=SOURCES.AST, options={}){
		console.log("options:", options);

		const ast = this.setAST(code, source);
		
	}

	setAST(code){


	}

}

const un = new UnMasker("sss");
un.cleanCode("sss",options= {"x": "xxxx"});