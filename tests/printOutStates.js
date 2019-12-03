
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



const uniqueStates = new Set();
const count = {};
SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {

    if (utils.isForAGoToSwitch(path)) {
      const stateHolderName = utils.getStateHolderName(path);
			const initialState = utils.getInitialState(path);
			const manager = StateManager.fromPath(path);

			if(stateHolderName !== part){
				return;
			}
			console.log("stateHolderName:", stateHolderName);

			for(let state in manager.states){

				const { result, meta } = manager.traverser.evaluator.interpret(state);
				console.log("state:", state, " result:", result, " meta:", meta);
				const key = `state: ${state}  result: ${result}  meta: ${JSON.stringify(meta)}`;
				uniqueStates.add(key);

				if(count.hasOwnProperty(key)){
					count[key] += 1;
				}else{
					count[key] = 1;
				}


			}
    }
  }
}



let currentPooky = process.argv.slice(-2)[0];
let part = process.argv.slice(-1)[0];

let currentTree = fromFile(`fixtures/${currentPooky}.js`);
traverse(currentTree, SWITCH_TRANSITION_VISITOR);


const uniqueCount = Array.from(uniqueStates).map(function(e, i) {
  return `Count:${count[e]} ${e}`;
});
