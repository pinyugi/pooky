
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


const tree = {
  'pooky' : fromFile("fixtures/pooky.min.b7a5e4c22669c5887624.js"),
  'while_loop' : fromFile("flowcharts/while_loop.js"),
  'pooky-q9qC' : fromFile("fixtures/pookyparts/q9qC.js"),
};


SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {

    if (utils.isForAGoToSwitch(path)) {
      const stateHolderName = utils.getStateHolderName(path);
      if(stateHolderName == process.argv.slice(-1)[0]){

        const initialState = utils.getInitialState(path);
        const manager = StateManager.fromPath(path);
  
        for(let state in manager.states){
					if(state == process.argv.slice(-2)[0]){

						const { result, meta } = manager.traverser.evaluator.interpret(state);
						console.log("state:", state, " result:", result, " meta:", meta);
					}
        }
      }

    }
  }
}

let currentTree = fromFile(`fixtures/pookyparts/${process.argv.slice(-1)[0]}.js`);

traverse(currentTree, SWITCH_TRANSITION_VISITOR);
//console.log(recast.print(currentTree).code);

