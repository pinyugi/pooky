
const cytoscape = require('cytoscape');
const StateManager = require("./manager.js").StateManager;

function addStatesToGraph(manager, graph){
	
  const states = manager.getAllStates();

  const elems = [];
  for(name of Object.keys(states)){
    const state = states[name];

    elems.push({
      group : "nodes",
      data : {
        isConditional : state.hasConditionalTransition(),
        id : state.getName()
      }
    });
		
    const transition = state.getTransition();
    if(transition !== null){
      for(transitionState of transition.getStates()){
        elems.push({
          group : "edges",
          data : {
            id : `${state.getName()}->${transitionState}`,
            test : transition.getTest(),
            isConditional : transition.isConditional(),
            source : state.getName(), 
            target : transitionState
          }
        });
      }
    }
  }

  graph.add(elems);


};


function fromStateManager(manager){
  if(!(manager instanceof StateManager)){
    throw Error("manager needs to be an instance of StateManager");
  }

  const graph = cytoscape();
  addStatesToGraph(manager, graph);

  return graph;
	

};


module.exports = {
  fromStateManager
}