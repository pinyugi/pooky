
class StateManager {

  constructor(states){

    this.states = {};
    this.graph = cytoscape();
    this.traverser = null;
    this.terminal = new Set();
    this.initial = null;
    
    if(states !== undefined && states.length) for(let state of states) this.addState(state);
  }
  
  addState(state, update=1){
    if(
      !this.states.hasOwnProperty(state)  ||
		  (this.states.hasOwnProperty(state) && update)
    ) this.states[state.name] = state;
  
  }
  
  getState(state){
	  const name = this.getStateName(state);
	  return this.states.hasOwnProperty(name) ? this.states[name] : 0;
  }
  
  getStateNodes(state){
    let stateNodes = [];
    const _state = this.getState(state);
    return _state ? _state.getNodes() : 0
  }
  
  getStateName(state){
    return state instanceof State ? state.name : state;
  }
	
  getInitialState(){
    return this.initial !== undefined ? this.getState(this.initial) : 0
  }

  removeState(state){
	  const name = this.getStateName(state);
	  if(this.states.hasOwnProperty(name)) delete this.states[name];
  
  }

  clearStates(){
    this.states = {};

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

  setupGraph(){

    this.graph = cytoscape();

    const elems = [];

    for(let name of Object.keys(this.states)){

      const state = this.states[name];
      const sourceState = state.name;

      elems.push({
        group : "nodes",
        data : {
          isConditional : state.hasConditionalTransition(),
          id : sourceState
        }
      });
        
      const transition = state.transition;

      if(transition !== null){
        for(let targetState of transition.states){
      
          elems.push({
            group : "edges",
            data : {
              id : `${sourceState}->${targetState}`,
              test : transition.test,
              isConditional : transition.isConditional() ,
              source : sourceState, 
              target : targetState
            }
          });
        }
      }
    }

    this.graph.add(elems);

  }

  simplify(){
  }


  setupTraverser(){
    this.traverser = new StructTraverser(this.graph);

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

  static fromPath(path){

    const manager = StateManager.fromSwitch(path);
    const explicitTerminalState = path.get("test.right.value").node;
    manager.setInitialState(utils.getInitialState(path));

    manager.addState(new State(explicitTerminalState));
    manager.markTerminalState(explicitTerminalState);

    manager.setupGraph();
    manager.setupTraverser();
    
    return manager;
  }

  
}

function createEmptyStateManager(){

  const manager = new StateManager();
  manager.addState(new State(1));
  manager.setInitialState(1);
  manager.markTerminalState(1);

  manager.setupGraph();
  manager.setupTraverser();

  return manager;

}
  
module.exports = {
  StateManager,
  createEmptyStateManager
};



const { 
  isTransition,
  isConditionalTransition,
  createTransition,
  createConditionalTransition,
  Transition,
} = require("./transition.js");



const t = require("@babel/types");
const cytoscape = require('cytoscape');
const { State } = require("./state.js");
const { StructTraverser } = require("./traverser.js");
const utils = require("./utils.js");
