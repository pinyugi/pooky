
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
			console.log("ARROWS");
			
			const getEleId = (n) => n.id();
			manager.graph.$().edges().map((n) =>{

				const edgeId = n.id();
				const source = n.source().map((n) => n.id())[0];
				const target = n.target().map((n) => n.id())[0];

				const transitionsTotal = manager.states[source].transition._states.length;

				if(transitionsTotal == 2){
					const transition = manager.states[source].transition._states.indexOf(parseInt(target, 10));
					console.log(`${source}->${target}["${transition ? "false" : "true"}"]`);
				}else{
					console.log(`${source}->${target}`);
				}

			})
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
