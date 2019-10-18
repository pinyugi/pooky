

const { structs } = require("./constants.js");
const { Graph } = require("./Graph.js");
const _ = require("lodash");


function StructTraverser(options){
  defaults = {
    graph : Graph(),
    currentState : null,
    nonLoopingEdges : []
  };

  Object.assign(this, _.defaultDeeps(options, defaults));
  this.nonLoopingEdges = this.findNonLoopingEdges();


}

Object.assign(StructTraverser.prototype, {

  findNonLoopingEdges : function(){
    return this.graph.$().leaves().predecessors('edge').edges();

  },
  getNextStruct : function(){

  },

  getCurrentState : function(){
    if(this.currentState === null){
      this.currentState = this.graph.manager.getInitialState();
    }
		
    return this.currentState;
										
  },

  getStructEndState : function(startState){

  },

  findStructInfo : function(startState){

    let structType = structs.SIMPLE;

    if(evaluate.isWhileLoop(this.graph, startState)){
      structType = structs.WHILE;

    }else if(evaluate.isDoWhileLoop(this.graph, startState)){
      structType = structs.DO_WHILE;

    }else if(evaluate.isIfThen(this.graph, startState)){
      structType = structs.IF_THEN;

    }else if(evaluate.isIfThenElse(this.graph, startState)){
      structType = structs.IF_THEN_ELSE;
    }
	
    const endState = this.getStructEndState(startState);

    return {
      start : startState,
      end : endState,
      type : structType
    }

  },

  createStruct : function(startState){
    const {start, end, type} = findStruct(manager, options);

    switch(type){

      case structs.SIMPLE:

        return new SimpleStruct({
          startState :  start,
          endState : end
        });

      case structs.WHILE:

        return new WhileStruct({
          startState :  start,
          endState : end
        });

      case structs.DO_WHILE:

        return new DoWhileStruct({
          startState :  start,
          endState : end
        });

      case structs.IF_THEN:

        return new IfThenStruct({
          startState :  start,
          endState : end
        });

      case structs.IF_THEN_ELSE:
					
        return new IfThenElseStruct({
          startState :  start,
          endState : end
        });
    }
  },

})



const evaluate = {
  isWhileLoop : function(graph, startState){

  },

  isDoWhileLoop : function(graph, startState){

  },

  isIfThen : function(graph, startState){

  },

  isIfThenElse : function(graph, startState){

  }


}