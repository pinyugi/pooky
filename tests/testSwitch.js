
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
  'pooky' : fromFile("fixtures/pooky.min.2d8ba5f04df1bcd5a874.js"),
  'doWhile-state5' : fromFile("flowcharts/v0j.js"),
  'While-state5' : fromFile("flowcharts/n2cc.w1k.js"),
  'ifThen-state3' : fromFile("flowcharts/n599.E0k.js"),
  'ifThenElse-state2' : fromFile("flowcharts/N0j.js"),
  'M1k' : fromFile("flowcharts/M1k.js")
};




SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (utils.isForAGoToSwitch(path) || utils.isWhileAGoToSwitch(path)) {

      const initialState = utils.getInitialState(path);
      const manager = StateManager.fromPath(path);
      const nodes = [];
      const G = new Graph(manager);
      const evaluate = new Evaluator(G);
      //console.log("ifThen:", evaluate.isIfThen(5));
      console.log("ifThen:", evaluate.isIfThen(3));
     

    }
  }


}



//const currentTree = tree["ifThenElse-state2"];
const currentTree = tree["ifThen-state3"];
//const currentTree = tree["While-state5"];
console.log(State);
traverse(currentTree, SWITCH_TRANSITION_VISITOR);
//console.log(recast.print(currentTree).code);


  
