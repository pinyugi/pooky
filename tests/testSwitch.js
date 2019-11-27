
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
  'pooky-H9qC' : fromFile("fixtures/pookyparts/H9qC.js"),
  'pooky-R7qC' : fromFile("fixtures/R7qC.js")
};

//const states = {};
const limit = 9;
let currentlimit = 0;
const allStates = {};
const zeroes = [];
const statelines = [];
// write to a new file named 2pac.txt

SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {

    if (utils.isForAGoToSwitch(path)) {
      const stateHolderName = utils.getStateHolderName(path);
      console.log("stateHolderName:", stateHolderName);

      const initialState = utils.getInitialState(path);
      const manager = StateManager.fromPath(path);
      manager.simplify(path);



      //console.log("nodes:", nodes);



    }
  }
}

let currentTree;
//currentTree = tree['pooky-H9qC'];
currentTree = tree['pooky-R7qC'];
//currentTree = tree['do_and_while_loop_inside_loop_B'];
//currentTree = tree['do_while_loop'];
//currentTree = tree['while_loop'];
traverse(currentTree, SWITCH_TRANSITION_VISITOR);
console.log(recast.print(currentTree).code);

