


class StructTraverser{

  constructor(graph){


    this.graph = graph || cytoscape();
    this.currentState = null;
    this.evaluator = new Evaluator(this.graph);
  }


  getNextStruct(){

  }

  getCurrentState(){

    if(this.currentState === null){
      this.currentState = this.graph.$().roots().map(getEleId)[0];
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



const { Evaluator, structs } = require("./evaluator.js");
const { 
  SimpleStruct, 
  WhileStruct, 
  DoWhileStruct, 
  IfThenStruct, 
  IfThenElseStruct 
} = require("./structs.js");


const cytoscape = require("cytoscape");
