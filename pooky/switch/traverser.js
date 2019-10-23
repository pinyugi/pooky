

const { structs } = require("./constants.js");

class StructTraverser{

  constructor(graph){


    this.graph = graph || new Graph();
    this.currentState = null;
    this.evaluator = new Evaluator(this.graph);
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


  createStruct(startState){
    const type = this.evaluator.interpret(startState);
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


const { Graph } = require("./graph.js");
const { Evaluator } = require("./evaluator.js");
const { 
  SimpleStruct, 
  WhileStruct, 
  DoWhileStruct, 
  IfThenStruct, 
  IfThenElseStruct 
} = require("./structs.js");

