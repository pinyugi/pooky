const t = require("@babel/types");
const recast = require("recast");
const { SINGLE_PATH, DUAL_PATH } = require("./constants.js").transition;


function Transition(props){

  this.states = [];
  this.setStates(props.states || this.states);
  this.setTest(props.test || null);
  this.setType(props.type);

}

Object.assign(Transition.prototype, {


  isConditional : function(){
    return !this.type == SINGLE_PATH;
  },

  hash : function(){
	  return [this.states.join(","), this.type, this.test].join("|");

  },

  getStates : function(){
    return this.states;

  },

  getTest : function(){
    return this.test;

  },

  setStates : function(states){
    if(!(states instanceof Array) && !(states instanceof String)) states = [states];
    if(!states.length && (states.length == 1 || states.length == 2)){
    	throw Error("A transition cannot have no states. It must have at least 1 or 2 state(s) max");
    }
	
    for(let state of states){
      try{
        t.assertNode(state);
        this.states.push(state.node.value);

      }catch(e){
        if(!state || !(state instanceof String)){
          throw Error("States must contain either a Node containing "  +
					"the state name in the value, or a state name as a string value");
        }

        this.states.push(state);
      }
    }	

  },

  setTest : function(test){
	  test === null || t.assertNode(test);
	  this.test = test === null ? test : test.node.value

  },

  setType : function(_type){
	  if(![SINGLE_PATH, DUAL_PATH].includes(_type)){
		  throw Error(`Transition type must be either ${SINGLE_PATH} or ${DUAL_PATH}`);
	  }

	  this.type = _type;

  }

});

function isTransition(path, stateHolderName) {
	
  return path.get("expression").type !== undefined &&
	  path.get("expression").type == "AssignmentExpression" &&
	  recast.print(path.get("expression.left").node).code == stateHolderName;
}
  
function isConditionalTransition(path, stateHolderName) {
  return isTransition(path, stateHolderName) &&
	  path.get("expression.right").type == "ConditionalExpression";
}
  
function createTransition(path) {
  return new Transition({
    type : SINGLE_PATH,
    states : [path.get("expression.right")],
    test : null
  });

}
  
function createConditionalTransition(path) {
  return new Transition({
    type : DUAL_PATH,
    states : [path.get("expression.right.consequent"), path.get("expression.right.alternate")],
    test : path.get("expression.right.test")
  });
}


module.exports = {
  SINGLE_PATH,
  DUAL_PATH, 
  isTransition,
  isConditionalTransition,
  createConditionalTransition,
  createTransition,
  Transition
}
