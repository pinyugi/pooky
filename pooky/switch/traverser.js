

const { structs } = require("./constants.js");
const { Graph } = require("./graph.js");
const { Evaluator } = require("./evaluator.js");
const { 
  SimpleStruct, 
  WhileStruct, 
  DoWhileStruct, 
  IfThenStruct, 
  IfThenElseStruct 
} = require("./structs");
const _ = require("lodash");


class StructTraverser{

  constructor(options){

    defaults = {
      graph : new Graph(),
      evaluator : null,
      currentState : null,
      nonLoopingEdges : this.findNonLoopingEdges()
    };

    Object.assign(this, _.defaultDeeps(options, defaults));

    this.nonLoopingEdges = this.findNonLoopingEdges();
    this.evaluate = new Evaluator(this.graph);


  }

  findNonLoopingEdges(){
    return this.graph.$().leaves().predecessors('edge').edges();
  }


  getNextStruct(){

  }

  getCurrentState(){
    if(this.currentState === null){
      this.currentState = this.graph.manager.getInitialState();
    }
    
    return this.currentState;
                    
  }

  getStructEndState(startState, type){

  }

  findStructType(startState){

    let structType = structs.SIMPLE;

    if(this.evaluate.isWhileLoop(startState)){
      structType = structs.WHILE;

    }else if(this.evaluate.isDoWhileLoop(startState)){
      structType = structs.DO_WHILE;

    }else if(this.evaluate.isIfThen(startState)){
      structType = structs.IF_THEN;

    }else if(this.evaluate.isIfThenElse(startState)){
      structType = structs.IF_THEN_ELSE;
    }else{
      structType = null;

    }

    return structType;  

  }

  createStruct(startState){
    const type = this.findStructType(startState);
    const end  = this.getStructEndState(startState, type);

    switch(type){

      case structs.SIMPLE:

        return new SimpleStruct({
          startState :  start,
          endState : end,
          traverser : this.traverser
        });

      case structs.WHILE:

        return new WhileStruct({
          startState :  start,
          endState : end,
          traverser : this.traverser
        });

      case structs.DO_WHILE:

        return new DoWhileStruct({
          startState :  start,
          endState : end,
          traverser : this.traverser
        });

      case structs.IF_THEN:

        return new IfThenStruct({
          startState :  start,
          endState : end,
          traverser : this.traverser
        });

      case structs.IF_THEN_ELSE:
          
        return new IfThenElseStruct({
          startState :  start,
          endState : end,
          traverser : this.traverser
        });
    }
  }

}

 

module.exports = {
  StructTraverser
};
