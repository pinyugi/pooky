
const fs = require('fs');
const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const { structs } = require("../pooky/switch/structs.js");

const {
  StateManager, 
  Evaluator,
  utils
} = require("../pooky/switch");


SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {

    if (utils.isForAGoToSwitch(path)) {
			const stateHolderName = utils.getStateHolderName(path);
			const initialState = utils.getInitialState(path);
			const manager = StateManager.fromPath(path, debug=true);

			if(part != "--all"){

				if(stateHolderName !== part){
					
					return;
				}
			}
			manager.simplify(path);

		}
	}
}



let currentPooky = process.argv.slice(-2)[0];
let part = process.argv.slice(-1)[0];

let currentTree = fromFile(`fixtures/${currentPooky}.js`);
traverse(currentTree, SWITCH_TRANSITION_VISITOR);
console.log(recast.print(currentTree).code);

