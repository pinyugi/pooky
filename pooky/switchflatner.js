const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const recast = require("recast");

function isForAGoToSwitch(path){
  return path.get("init").node === null && 
    path.get("test").type == "BinaryExpression" &&
    path.get("test.operator").node == "!==" &&
    path.getPrevSibling().type == "VariableDeclaration" &&
    path.getPrevSibling().get("declarations").length && 
    getStateHolderName(path) == path.get("test.left.name").node;
};

function isTransition(path, stateHolderName){
  return path.get("expression").type !== undefined && 
    path.get("expression").type == "AssignmentExpression" &&
    path.get("expression.left.name").node == stateHolderName;
}

function isConditionalTransition(path, stateHolderName){
  return isTransition(path, stateHolderName) && 
        path.get("expression.right").type == "ConditionalExpression";
}


function createTransition(states, currentState, path){
  states[currentState]["transitions"] = {
    'type' : 'transition',
    'transitions' : [path.get("expression.right.value").node],
    'conditional' : null
  };
}

function createConditionalTransition(states, currentState, path){
  states[currentState]["transitions"] = {
    'type' : 'conditional',
    'transitions' : [path.get("expression.right.consequent.value").node, path.get("expression.right.alternate.value").node],
    'conditional' : path.get("expression.right.test").node
  };
}

function getStateHolderName(path){
  return path.getPrevSibling().get("declarations.0.id.name").node;
}

function getAllStates(path){
    
  const states = {};
  const stateHolderName = getStateHolderName(path);
  states["terminal"] = [path.get("test.right.value").node];

  path.get("body.body.0.cases").forEach(function(_case){

    const currentState = _case.get("test.value").node;
    if(!(currentState in states)) states[currentState] = {};
    
    states[currentState]["nodes"] = [];
    states[currentState]["transitions"] = [];
    
    _case.get("consequent").forEach(function(_block){
      if(!(isTransition(_block, stateHolderName) || _block.type == "ReturnStatement")){
        states[currentState]["nodes"].push(_block.node);
      }
      
      if(isConditionalTransition(_block, stateHolderName)){
        createConditionalTransition(states, currentState, _block);

      }else if(isTransition(_block, stateHolderName)) {

        createTransition(states, currentState, _block);
      }

      if(_block.type == "ReturnStatement"){
        states["terminal"].push(_block.type)
      }
    })
    
  });

  return states;
}

function getStateHolderName(path){
  return path.getPrevSibling().get("declarations.0.id.name").node;
}

function getInitialState(path){
  return path.getPrevSibling().get("declarations.0.init.value").node;
}

function getAllStates(path){
    
  const states = {};
  const stateHolderName = getStateHolderName(path);
  states["initial"] = getInitialState(path);
  states["terminal"] = [path.get("test.right.value").node];

  path.get("body.body.0.cases").forEach(function(_case){

    const currentState = _case.get("test.value").node;
    if(!(currentState in states)) states[currentState] = {};
    
    states[currentState]["nodes"] = [];
    states[currentState]["transitions"] = [];
    
    _case.get("consequent").forEach(function(_block){
      if(!(isTransition(_block, stateHolderName))){

        if(_block.type == "ReturnStatement"){
          states["terminal"].push(_block.type)

        }
        states[currentState]["nodes"].push(_block.node);

      }else{
        isConditionalTransition(_block, stateHolderName) 
          ? createConditionalTransition(states, currentState, _block)
          : createTransition(states, currentState, _block)

      }

    })
    
  });

  return states;
}

function doesStateConverge(states, transitions){




}

function doesStateLoopBack(states, initialState, endStates){

}

function walkStates(states, initialState, endStates, nodes){

  const currentState = initialState;
  const transitions = states[currentState]["transitions"];
  const hasEndState = endStates.filter(t => transitions.includes(t))

  if(hasEndState){
    nodes.push(states[currentState]["nodes"])
    return {"endState" : hasEndState[0], "nodes" : nodes};
  }

  switch(transitions["type"]){

    case "conditional":
      if(doesStateConverge(states, transitions)){
        
      }
  
      if(doesStateLoopBack(states, transitions)){
  
      }
      break;
    
    case "transition":
      const newInitialState = states[currentState]["transitions"][0]
      return walkStates(states, newInitialState,  endStates, nodes)
    
  }

}

SWITCH_TRANSITION_VISITOR = {
  ForStatement(path, state){
    if(isForAGoToSwitch(path)){
      const stateHolder = getStateHolderName(path);
      const initialState = getInitialState(path);
      const states = getAllStates(path);
      const nodes = [];
      const ast = walkStates(states, initialState, states["terminal"], nodes)
      console.log(ast);
    }

  }

}
const flatSwitch = (ast, state) => {
  
  traverse(ast, SWITCH_TRANSITION_VISITOR, {}, state = Object.create(null));

}


module.exports = {
  flatSwitch : flatSwitch
}