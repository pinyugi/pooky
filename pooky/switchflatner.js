const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const recast = require("recast");



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


function getAllStates(path) {

  const states = {};
  const stateHolderName = getStateHolderName(path);
  states["initial"] = getInitialState(path);
  states["terminal"] = [path.get("test.right.value").node];

  path.get("body.body.0.cases").forEach(function (_case) {

    const currentState = _case.get("test.value").node;
    if (!(currentState in states)) states[currentState] = {};

    states[currentState]["nodes"] = [];
    states[currentState]["transitions"] = [];

    _case.get("consequent").forEach(function (_block) {
			console.log("_block:", _block.type);
      if (!(isTransition(_block, stateHolderName))) {

        if (_block.type == "ReturnStatement") states["terminal"].push(currentState);
        if (_block.type != "BreakStatement") states[currentState]["nodes"].push(_block.node);

      } else {
        isConditionalTransition(_block, stateHolderName)
          ? createConditionalTransition(states, currentState, _block)
          : createTransition(states, currentState, _block)
      }
    })
  });

  return states;
}

function doesStateConverge(states, currentState, currentStateValue, endStates) {

  const transitions = currentState["transitions"]["states"];
  const newEndStates = [...endStates, ...transitions];
  let _walked;
  
  _walked = walkStates(states, transitions[0], newEndStates, [], true);
  if(_walked["endState"] == transitions[1]) return {'converged' : true, 'nodes' : _walked["nodes"], 'direction' : transitions[1]};
  _walked = walkStates(states, transitions[1], newEndStates, [], true);

  if(_walked["endState"] == transitions[0]) return {'converged' : true, 'nodes' : _walked["nodes"], 'direction' : transitions[0]};

  return  {'converged' : false, 'nodes' : []}


}

function doesStateLoopBack(states, currentState, currentStateValue, endStates){

  const transitions = currentState["transitions"]["states"];
  const newEndStates = [...endStates, currentStateValue];
  let _walked;

  _walked = walkStates(states, transitions[0], newEndStates, [], false);
  if(_walked["endState"] == currentStateValue) return {'looped' : true, 'nodes' : _walked["nodes"]};


  _walked = walkStates(states, transitions[1], newEndStates, [], false);
  if(_walked["endState"] == currentStateValue) return {'looped' : true, 'nodes' : _walked["nodes"]};

  return {'looped' : false, 'nodes' : []};

}


function walkStates(states, initialState, endStates, nodes, pushEndNodes=true) {

  const currentStateValue = initialState;
  const currentState = states[currentStateValue];

  //console.log("currentStateValue:", currentStateValue);
  //console.log("currentState:", currentState);
  const transitions = currentState["transitions"];
  const transitionStates = currentState["transitions"]["states"];
  let hasEndState = [];


  //console.log("currentState:", currentState);
  //If the switch only have 1 case then the implicit terminal state is that case
  if(Object.keys(states).length == 3){
    return {"endState" : initialState, "nodes" : currentState["nodes"]}
  }
  
  //console.log("endStates:", endStates);
  //console.log("transitionStates:", transitionStates);
  if(transitionStates.length == 1){
    
    hasEndState = endStates.filter(t => transitionStates.includes(t))
    
    if (hasEndState.length) {
      if(pushEndNodes)nodes.push(...currentState["nodes"]);

      //console.log("wtf2!!!");
      return { "endState": hasEndState[0], "nodes": nodes };
    }

  }
  console.log("transitions type:", transitions["type"], currentStateValue);
  switch (transitions["type"]) {

    case "conditional":
      //console.log("currentStateValue is conditional:", currentStateValue);
      //console.log("currentStateValue:", currentStateValue);
      //console.log("currentState:", currentState);
      const loopedState = doesStateLoopBack(states, currentState, currentStateValue, endStates);
      if(loopedState["looped"]){
        console.log("state does loop back:")
        
        const whileStatement = t.whileStatement(currentState["transitions"]["test"], t.blockStatement(loopedState["nodes"]));
        nodes.push(whileStatement)
        return {
          "endState" : currentStateValue, 
          "nodes" : nodes
        };
      }
      
      const convergedState = doesStateConverge(states, currentState, currentStateValue, endStates);
      if (convergedState["converged"]) {
        console.log("converted state does converge:");
        //console.log("converted currentStateValue:", currentStateValue);
        //console.log("converted  currentState:", currentState);
        
        nodes.push(
          t.ifStatement(
            currentState["transitions"]["test"], 
            t.blockStatement(convergedState["nodes"])
          )
        );

        return walkStates(states, convergedState["direction"], endStates, nodes)

      }
      const consequent = walkStates(states, transitionStates[0], endStates, nodes);
      const alternate = walkStates(states, transitionStates[1], endStates, nodes);

      nodes.push(
        t.ifStatement(
          currentState["test"],
          t.blockStatement(consequent["nodes"]),
          t.blockStatement(alternate["nodes"])

        )
      );

      return  {"endState" : endStates[0], "nodes" : nodes};

    case "transition":
      const newInitialState = currentState["transitions"]["states"][0]
      nodes.push(...currentState["nodes"]);
      
      console.log("states in transition:");
      return walkStates(states, newInitialState, endStates, nodes)

  }

}

SWITCH_TRANSITION_VISITOR = {
  "ForStatement|WhileStatement"(path) {
    if (isForAGoToSwitch(path) || isWhileAGoToSwitch(path)) {

      const initialState = getInitialState(path);
      const states = getAllStates(path);
      const nodes = [];
      console.log(states);
     
      const ast = walkStates(states, initialState, states["terminal"], nodes)

      path.getPrevSibling().remove();
      path.replaceWithMultiple(ast["nodes"]);
    }
  },

  WhileStatement(path){

  }

}
const flatSwitch = (ast) => {

  traverse(ast, SWITCH_TRANSITION_VISITOR);

}

module.exports = flatSwitch;
