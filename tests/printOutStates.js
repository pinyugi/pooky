
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
  'pooky-i89C' : fromFile("fixtures/pookyparts/i89C.js"),
  'pooky-X1mC' : fromFile("fixtures/pookyparts/X1mC.js"),
  'pooky-H9VC' : fromFile("fixtures/pookyparts/H9VC.js"),
  'pooky-k7qC' : fromFile("fixtures/pookyparts/k7qC.js"),
  'pooky-s1Z' : fromFile("fixtures/pookyparts/s1Z.js"),
  'pooky-e1Z' : fromFile("fixtures/pookyparts/e1Z.js"),
  'pooky-q9qC' : fromFile("fixtures/pookyparts/q9qC.js"),
};


SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {

    if (utils.isForAGoToSwitch(path)) {
      const stateHolderName = utils.getStateHolderName(path);

      if(stateHolderName == 'q9qC'){
        const initialState = utils.getInitialState(path);
        const manager = StateManager.fromPath(path);
  
        for(let state in manager.states){
            const { result, meta } = manager.traverser.evaluator.interpret(state);
          console.log("state:", state, " result:", result, " meta:", meta);
        }
      }

    }
  }
}

let currentTree;
currentTree = tree['while_loop'];
currentTree = tree['pooky-e1Z'];
currentTree = tree['pooky-q9qC'];
traverse(currentTree, SWITCH_TRANSITION_VISITOR);
//console.log(recast.print(currentTree).code);

