
const { StateManager, createEmptyStateManager } = require("./manager.js");
const { StructTraverser } = require("./structs.js");
const cytoscape = require('cytoscape');
const _ = require("lodash");



function Graph(config){

	defaults = {
		manager : createEmptyStateManager(),
		graph : cytoscape()
	};

	Object.assign(this, _.defaultDeeps(config, defaults));
	this.addStatesToGraph(this.manager, this.graph);

}

Object.assign(Graph.prototype, {

	getAllStructs : function(){
		const structs = [];

		let currentState = this.manager.getInitialState().getName();
		do{

			if(nextStruct){
				structs.push(nextStruct);
				currentState = end;
			}

		}while(!nextStruct)

    return structs;
		
  },

	simplify : function(){
		
		const nodes = [];

		this.getAllStructs().forEach(function(struct){
			nodes.push(struct);
		})

		return nodes;

	},
 
	addStatesToGraph : function(manager, graph){
		this.verifyStateManager(this.manager);
	
    const states = manager.getAllStates();

    const elems = [];
    for(name of Object.keys(states)){

			const state = states[name];
			const sourceState = state.getName();

      elems.push({
        group : "nodes",
        data : {
          isConditional : state.hasConditionalTransition(),
          id : sourceState
        }
      });
				
      const transition = state.getTransition();

      if(transition !== null){
        for(targetState of transition.getStates()){
			
          elems.push({
            group : "edges",
            data : {
              id : `${sourceState}=>${targetState}`,
              test : transition.getTest(),
              isConditional : transition.isConditional(),
              source : sourceState, 
              target : targetState
            }
          });
        }
      }
    }

    graph.add(elems);


  },

	verifyStateManager : function(manager){
    if(!(manager instanceof StateManager)){
      throw Error("manager needs to be an instance of StateManager");
    }
  }

});

module.exports = {
  Graph
}
