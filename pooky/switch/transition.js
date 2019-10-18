const t = require("@babel/types");
const recast = require("recast");
const { SINGLE_PATH, DUAL_PATH } = require("./constants.js").transition;


class Transition {

  constructor(config){

    this.states = [];
    this.setStates(config.states || this.states);
    this.setTest(config.test || null);
    this.setType(config.type);

  }


  isConditional(){
    return !this.type == SINGLE_PATH;
  }

  hash(){
	  return [this.states.join(","), this.type, this.test].join("|");

  }

  getStates(){
    return this.states;

  }

  getTest(){
    return this.test;

  }

  setStates(states){
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

  }

  setTest(test){
	  test === null || t.assertNode(test);
	  this.test = test === null ? test : test.node.value;

  }

  setType(_type){
	  if(![SINGLE_PATH, DUAL_PATH].includes(_type)){
		  throw Error(`Transition type must be either ${SINGLE_PATH} or ${DUAL_PATH}`);
	  }

	  this.type = _type;

  }

  static isTransition(path, stateHolderName) {
	
    return path.get("expression").type !== undefined &&
  	  path.get("expression").type == "AssignmentExpression" &&
  	  recast.print(path.get("expression.left").node).code == stateHolderName;
  }

  static isConditionalTransition(path, stateHolderName) {
    return isTransition(path, stateHolderName) &&
  	  path.get("expression.right").type == "ConditionalExpression";
  }
  
  static createTransition(path) {
    return new Transition({
      type : SINGLE_PATH,
      states : [path.get("expression.right")],
      test : null
    });
  }

  static createConditionalTransition(path) {
    return new Transition({
      type : DUAL_PATH,
      states : [path.get("expression.right.consequent"), path.get("expression.right.alternate")],
      test : path.get("expression.right.test")
    });
  }

}


module.exports = {
  SINGLE_PATH,
  DUAL_PATH, 
  Transition
}
