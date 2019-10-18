
const { StateManager, createEmptyStateManager } = require("./manager.js");
const { StructTraverser } = require("./traverser.js");
const cytoscape = require('cytoscape');
const _ = require("lodash");



class Graph {

  constructor(config){

  	defaults = {
  		manager : createEmptyStateManager(),
  		graph : cytoscape()
  	};

  	Object.assign(this, _.defaultDeeps(config, defaults));
  	this.addStatesToGraph(this.manager, this.graph);
  }


  getAllStructs(){

    const structs = [];
    const traverser = new StructTraverser();

    do{

      const nextStruct = traverser.getNextStruct();

      if(nextStruct){
        structs.push(nextStruct);
      }

    }while(nextStruct)

    return structs;
		
  }

  simplify(config){

    defaults = {
      path : null,
      removeSibling : false,
      replaceNodes : false
    };

    config = _.defaultDeeps(config, defaults);

    const { path, removeSibling, replaceNodes } = config;

    if(path.constructor.name !== "NodePath"){
      throw Error("path needs to be a NodePath from the Babel library")
    }

    const structs = this.getAllStructs();

    if(removeSibling){
      path.getPrevSibling().remove();
    };

    if(replaceNodes){
      path.replaceWithMultiple(structs);
    }


  }
 
  addStatesToGraph(manager, graph){
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


  }

  verifyStateManager(manager){
    if(!(manager instanceof StateManager)){
      throw Error("manager needs to be an instance of StateManager");
    }
  }

}

module.exports = {
  Graph
}
