
const fs = require('fs');
const fromFile = require("../pooky/ast.js").fromFile;
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const { structs } = require("../pooky/switch/evaluator.js");

const {
  StateManager, 
  Evaluator,
  utils
} = require("../pooky/switch");



console.log(process.argv.slice(-1)[0]);
const tree = {
  'pooky' : fromFile(process.argv.slice(-1)[0]),
  //'pooky' : fromFile("fixtures/pookyparts/i89C.js")
};

const allStates = {};
const zeroes = [];
const statelines = [];
// write to a new file named 2pac.txt

SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {

    const states = {};
    if (utils.isForAGoToSwitch(path) || utils.isWhileAGoToSwitch(path)) {
      const stateHolderName = utils.getStateHolderName(path);

      const initialState = utils.getInitialState(path);
      const manager = StateManager.fromPath(path);
      for(let st of Object.keys(manager.states)){

      	const evaluated = manager.traverser.evaluator.interpret(st);

        states[evaluated.result] = evaluated.result in states ? states[evaluated.result] + 1 : 1;
        //console.log("state:", st, " evaluate:", manager.traverser.evaluator.interpret(st).result);


        allStates[evaluated.result] = evaluated.result in allStates ? allStates[evaluated.result] + 1 : 1;
      }

      if(states.hasOwnProperty(0)){
        zeroes.push(stateHolderName);

      }

      console.log(stateHolderName ,":", states);
      statelines.push(`${stateHolderName}:${JSON.stringify(states)}`);

      return false; 

    }
  }
}

let currentTree;
currentTree = tree['pooky'];
//currentTree = tree['pooky-i89C'];
traverse(currentTree, SWITCH_TRANSITION_VISITOR);

console.log("Total States :", JSON.stringify(allStates));
console.log("Total Zeroes :", zeroes.length);

fs.writeFile('zeroes.txt', zeroes.join("\n"), (err) => {
  console.log('Zeroes saved!');
});


fs.writeFile('statesreport.txt', statelines.join("\n"), (err) => {
  console.log('states saved!');
});
