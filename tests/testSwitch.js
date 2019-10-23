
const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const {
  StateManager, 
  State, 
  Transition,
	Graph,
  Evaluator,
  utils
} = require("../pooky/switch");


const tree = {
  'do_while_loop' : fromFile("flowcharts/do_while_loop.js"),
  'do_while_loop_break_if_then_else' : fromFile("flowcharts/do_while_loop_break_if_then_else.js"),
  'do_while_loop_if_then' : fromFile("flowcharts/do_while_loop_if_then.js"),
  'do_while_loop_if_then_else' : fromFile("flowcharts/do_while_loop_if_then_else.js"),
  'do_while_loop_not_conditional_ending' : fromFile("flowcharts/do_while_loop_not_conditional_ending.js"),
  'while_loop' : fromFile("flowcharts/while_loop.js"),
  'while_loop_if_then_ending' : fromFile("flowcharts/while_loop_if_then_ending.js"),
  'while_loop_break_if_then' : fromFile("flowcharts/while_loop_break_if_then.js"),
  'infinite_loop' : fromFile("flowcharts/infinite_loop.js"),
  'if_then' : fromFile("flowcharts/if_then.js"),
  'if_then_else' : fromFile("flowcharts/if_then_else.js")
};

SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (utils.isForAGoToSwitch(path) || utils.isWhileAGoToSwitch(path)) {
      const stateHolderName = utils.getStateHolderName(path);
      console.log(stateHolderName);

      const initialState = utils.getInitialState(path);
      const manager = StateManager.fromPath(path);
      const nodes = [];
      const G = new Graph(manager);
      const evaluator = new Evaluator(G);
      console.log(evaluator.interpret(3));

    }
  }
}


let currentTree;
//const currentTree = tree["ifThenElse-state2"];
//currentTree = tree['do_while_loop'];
//currentTree = tree['do_while_loop_break_if_then_else'];
//currentTree = tree['do_while_loop_if_then'];
//currentTree = tree['do_while_loop_if_then_else'];
//currentTree = tree['do_while_loop_not_conditional_ending'];
//currentTree = tree['while_loop'];
//currentTree = tree['while_loop_if_then_ending'];
//currentTree = tree['while_loop_break_if_then'];
//currentTree = tree['infinite_loop'];
//currentTree = tree['if_then'];
//currentTree = tree['if_then_else'];
traverse(currentTree, SWITCH_TRANSITION_VISITOR);
//console.log(recast.print(currentTree).code);

