
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
  'b7a5e4c22669c5887624' : fromFile("fixtures/pooky.min.b7a5e4c22669c5887624.js"),
  'a32d107d1e0c251a0811' : fromFile("fixtures/pooky.min.a32d107d1e0c251a0811.js"),
  '7eff37970545687d45f9' : fromFile("fixtures/pooky.min.7eff37970545687d45f9.js"),
  'while_loop' : fromFile("flowcharts/while_loop.js"),
  'pooky-i89C' : fromFile("fixtures/pookyparts/i89C.js"),
  'pooky-X1mC' : fromFile("fixtures/pookyparts/X1mC.js"),
  'pooky-H9VC' : fromFile("fixtures/pookyparts/H9VC.js"),
  'pooky-k7qC' : fromFile("fixtures/pookyparts/k7qC.js"),
  'pooky-s1Z' : fromFile("fixtures/pookyparts/s1Z.js"),
  'pooky-e1Z' : fromFile("fixtures/pookyparts/e1Z.js"),
  'pooky-q9qC' : fromFile("fixtures/pookyparts/q9qC.js"),
  'pooky-H9qC' : fromFile("fixtures/pookyparts/H9qC.js"),
  'pooky-e0MC' : fromFile("fixtures/pookyparts/e0MC.js"),
  'pooky-F9qC' : fromFile("fixtures/pookyparts/F9qC.js"),
};


const uniqueStates = new Set();
const count = {};
SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {

    if (utils.isForAGoToSwitch(path)) {
      const stateHolderName = utils.getStateHolderName(path);
			const initialState = utils.getInitialState(path);
			const manager = StateManager.fromPath(path);
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


let currentTree;
//let currentPooky = "7eff37970545687d45f9";
let currentPooky = "b7a5e4c22669c5887624";
currentTree = tree['while_loop'];
currentTree = tree['pooky-e1Z'];
currentTree = tree['pooky-q9qC'];
currentTree = tree['pooky-H9qC'];
//currentTree = tree['pooky-e0MC'];
//currentTree = tree['pooky-F9qC'];
//currentTree = tree[currentPooky];
traverse(currentTree, SWITCH_TRANSITION_VISITOR);


const uniqueCount = Array.from(uniqueStates).map(function(e, i) {
  return `Count:${count[e]} ${e}`;
});
//fs.writeFile(`${currentPooky}-uniqueStates.txt`, Array.from(uniqueStates).join("\n"), (err) =>{
fs.writeFile(`${currentPooky}-uniqueStates.txt`, uniqueCount.join("\n"), (err) =>{
  console.log("uniqueStates saved!");
});


