
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
  'if_then' : fromFile("flowcharts/if_then.js"),
  'if_then_else' : fromFile("flowcharts/if_then_else.js"),
  'if_then_in_a_loop' : fromFile("flowcharts/if_then_in_a_loop.js"),
  'do_while_loop' : fromFile("flowcharts/do_while_loop.js"),
  'do_and_while_loop' : fromFile("flowcharts/do_and_while_loop.js"),
  'do_and_while_loop_inside_loop' : fromFile("flowcharts/do_and_while_loop_inside_loop.js"),
  'do_and_while_loop_inside_loop_B' : fromFile("flowcharts/do_and_while_loop_inside_loop_B.js"),
  'while_loop' : fromFile("flowcharts/while_loop.js"),
  'while_loop_no_ancestors' : fromFile("flowcharts/while_loop_no_ancestors.js"),
  'while_loop_inside_loop' : fromFile("flowcharts/while_loop_inside_loop.js"),
  'infinite_loop' : fromFile("flowcharts/infinite_loop.js"),
  'pooky' : fromFile("fixtures/pooky.min.b7a5e4c22669c5887624.js"),
  'pooky-i89C' : fromFile("fixtures/pookyparts/i89C.js"),
  'pooky-X1mC' : fromFile("fixtures/pookyparts/X1mC.js"),
  'pooky-H9VC' : fromFile("fixtures/pookyparts/H9VC.js"),
  'pooky-k7qC' : fromFile("fixtures/pookyparts/k7qC.js"),
  'pooky-s1Z' : fromFile("fixtures/pookyparts/s1Z.js"),
  'pooky-Z2Z' : fromFile("fixtures/pookyparts/Z2Z.js"),
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

      const initialState = utils.getInitialState(path);
      const manager = StateManager.fromPath(path);
      const nodes = manager.simplify();

      path.getPrevSibling().remove();
      path.replaceWithMultiple(nodes);

      //console.log("nodes:", nodes);


      currentlimit += 1

    }
  }
}

let currentTree;
currentTree = tree['pooky-Z2Z'];
//currentTree = tree['do_and_while_loop_inside_loop_B'];
//currentTree = tree['do_while_loop'];
//currentTree = tree['while_loop'];
traverse(currentTree, SWITCH_TRANSITION_VISITOR);
console.log(recast.print(currentTree).code);

