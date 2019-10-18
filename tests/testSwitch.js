
const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const {
  fromSwitch,
  fromStateManager,
  StateManager, 
  State, 
  Transition,
	Graph
} = require("../pooky/switch");


const tree = {
  'pooky' : fromFile("fixtures/pooky.min.2d8ba5f04df1bcd5a874.js"),
  'v0j' : fromFile("flowcharts/v0j.js"),
  'N0j' : fromFile("flowcharts/N0j.js"),
  'M1k' : fromFile("flowcharts/M1k.js")
};


function getStateHolderType(path){
  const prev = path.getPrevSibling();
  const isVarDec = prev.type == "VariableDeclaration" && prev.get("declarations").length == 1;
  const isAssignment = prev.get("expression").type = "AssignmentExpression";

  if(isVarDec) return "vardec";
  if(isAssignment) return "assignment";

}

function getStateHolderName(path) {
  const prev = path.getPrevSibling();
  const _type = getStateHolderType(path);
  switch(_type){
    case "vardec":
      return recast.print(prev.get("declarations.0.id").node).code;
    case "assignment":
      return recast.print(prev.get("expression.left").node).code;
    default:
      return false
  }

}

function getInitialState(path) {

  const prev = path.getPrevSibling();
  const _type = getStateHolderType(path);
  switch(_type){
    case "vardec":
      return prev.get("declarations.0.init.value").node; 
    case "assignment":
      return prev.get("expression.right.value").node;
    default:
      return false
  }

}

function hasStateHolder(path){
  return getStateHolderName(path) && getInitialState(path) ;

}
function hasGoToSibling(path){
  return hasStateHolder(path) &&
  getStateHolderName(path) == recast.print(path.get("test.left").node).code;
}

function isWhileAGoToSwitch(path){
  return path.type == "WhileStatement" &&
    path.get("test").type == "BinaryExpression" &&
    path.get("test.operator").node == "!==" &&
    hasGoToSibling(path);

}

function isForAGoToSwitch(path) {
 
  return path.type == "ForStatement" &&
    path.get("init").node === null &&
    path.get("test").type == "BinaryExpression" &&
    path.get("test.operator").node == "!==" &&
    hasGoToSibling(path);
};

function isTransition(path, stateHolderName) {
  return path.get("expression").type !== undefined &&
    path.get("expression").type == "AssignmentExpression" &&
    recast.print(path.get("expression.left").node).code == stateHolderName;
}

function isConditionalTransition(path, stateHolderName) {
  return isTransition(path, stateHolderName) &&
    path.get("expression.right").type == "ConditionalExpression";
}

function createTransition(states, currentState, path) {
  states[currentState]["transitions"] = {
    'type': 'transition',
    'states': [path.get("expression.right.value").node],
    'test': null
  };
}

function createConditionalTransition(states, currentState, path) {
  states[currentState]["transitions"] = {
    'type': 'conditional',
    'states': [path.get("expression.right.consequent.value").node, path.get("expression.right.alternate.value").node],
    'test': path.get("expression.right.test").node
  };
}


function buildStateManager(path) {

  const manager = fromSwitch(path);
  const explicitTerminalState = path.get("test.right.value").node;
  manager.setInitialState(getInitialState(path));
  manager.markTerminalState(explicitTerminalState);

  return manager;
}

SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (isForAGoToSwitch(path) || isWhileAGoToSwitch(path)) {

      const initialState = getInitialState(path);
      const manager = buildStateManager(path);
      const nodes = [];
      const graph = fromStateManager(manager);
      const alle = graph.$().nodes();
      console.log(alle);
      const alln = graph.$().leaves().predecessors('edge').edges();
      console.log(alln);
      //console.log(alle.diff(graph.$id('5').edges()));
      //console.log(graph.$('edge').edges());

      //console.log(graph.$().absoluteComplement(graph.$().leaves().predecessors('edge'));
     

    }
  }


}



const currentTree = tree["M1k"];
console.log(State);
traverse(currentTree, SWITCH_TRANSITION_VISITOR);
//console.log(recast.print(currentTree).code);


  
