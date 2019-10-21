const cytoscape = require('cytoscape');


class Graph {

  constructor(manager){


    this.manager = manager || createEmptyStateManager();;
    this.graph = cytoscape();

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
    this.verifyStateManager(manager);
	
    const { states } = manager;

    const elems = [];
    for(let name of Object.keys(states)){

      const state = states[name];
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
};


const { StateManager, createEmptyStateManager } = require("./manager.js");
const { StructTraverser } = require("./traverser.js");