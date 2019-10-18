const t = require("@babel/types");
const State =  require("./state.js").State;
const utils = require("./utils.js");

const {
  Transition, 
  isConditionalTransition, 
  isTransition, 
  createConditionalTransition, 
  createTransition

} = require("./transition.js");

class StateManager {

  constructor(states){

    this.states = {};
    this.terminal = new Set();
    this.initial = null;
    
    if(states !== undefined && states.length) for(let state of states) this.addState(state);
  }
  
  addState(state, update=1){
    if(
      !this.states.hasOwnProperty(state)  ||
		(this.states.hasOwnProperty(state) && update)
    ) this.states[state.getName()] = state;
  
  }
  
  getState(state){
	  const name = this.getStateName(state);
	  return this.states.hasOwnProperty(name) ? this.states[name] : 0;
  }
	
  getAllStates(){
    return this.states;
  }
  
  getStateNodes(state){
    let stateNodes = [];
    const _state = this.getState(state);
    return _state ? _state.getNodes() : 0
  }
  
  getStateName(state){
    return state instanceof State ? state.getName() : state;
  }
	
  getInitialState(){
    return this.initial !== undefined ? this.getState(this.initial) : 0
  }

  removeState(state){
	  const name = this.getStateName(state);
	  if(this.states.hasOwnProperty(name)) delete this.states[name];
  
  }
  
  markTerminalState(state){
	  const name = this.getStateName(state);
	  this.terminal.add(name);
  
  }

  setInitialState(state){
    const name = this.getStateName(state);
    if(!this.states.hasOwnProperty(name)){
      throw Error(
        "State " +
        name +
        " does not exist.Thus cannot be set as the initial state."
      )}
    this.initial = name;

  }

  isStateTerminal(state){
    const name = this.getStateName(state);
    return this.terminal.has(name);
  }

  static fromSwitch(path){

    t.assertNode(path);

    const manager = new StateManager();
    const stateHolderName = utils.getStateHolderName(path);

    path.get("body.body.0.cases").forEach(function (_case) {

      const stateName = _case.get("test.value").node;
      manager.addState(new State(stateName));

      _case.get("consequent").forEach(function (_block) {
        if (!(isTransition(_block, stateHolderName))) {

          if (_block.type == "ReturnStatement") manager.markTerminalState(stateName);
          if (_block.type != "BreakStatement") manager.getState(stateName).addNode(_block.node);

        } else {
        
          const transition = isConditionalTransition(_block, stateHolderName) ? 
            createConditionalTransition(_block) : createTransition(_block);
      
          manager.getState(stateName).setTransition(transition);
        }
      });
    });
    
    return manager;

  }

  static buildStateManager(path){

    const manager = fromSwitch(path);
    const explicitTerminalState = path.get("test.right.value").node;
    manager.setInitialState(getInitialState(path));
    manager.markTerminalState(explicitTerminalState);
    
    return manager;

  }

  static createEmptyStateManager(){

    const manager = StateManager();
    manager.addState(new State(1));
    manager.setInitialState(1);
    manager.markTerminalState(1);

    return manager;
  
  }
  
}

  
module.exports = {
  StateManager 
};

