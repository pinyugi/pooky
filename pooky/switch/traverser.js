


class StructTraverser{

  constructor(graph){

    this.graph = graph || cytoscape();
    this.currentState = null;
    this.evaluator = new Evaluator(this.graph);
  }


  getNextStruct(){

    const { result, meta }  = this.evaluator.interpret(this.currentState);
    console.log("state:", state, " evaluated:", result, " meta:", meta);

    switch(result){

      case (structs.DOES_NOT_CONVERGE):
        return IfThenElseStruct(state, this.manager, meta);

      case (structs.SIMPLE):
        return SimpleStruct(state, this.manager, meta);

      case (structs.IF_THEN):
        return IfThenStruct(state, this.manager, meta);

      case (structs.IF_THEN_ELSE):
        return IfThenElseStruct(state, this.manager, meta);

      case (structs.WHILE_LOOP):
        return WhileLoopStruct(state, this.manager, meta);

      case (structs.DO_WHILE_LOOP):
        return DoWhileLoopStruct(state, this.manager, meta);

      case (structs.END_STATE):
        return SimpleStruct(state, this.manager, meta);
			
      default:
        console.log("Could not evaluate:", evaluated.result);
        break;
    }


  }

  getStatistics(){

    const statistics = {};

    this.graph.$().nodes().forEach((n) =>{
      const stateId = n.id();
      const evaluated = this.evaluator.interpret(stateId);
      statistics[evaluated.result] = evaluated.result in statistics ? statistics[evaluated.result] + 1 : 1;

    });

    return statistics;

  }

  getCurrentState(){

    if(this.currentState === null){
      this.currentState = this.graph.$().roots().map(getEleId)[0];
    }
    
    return this.currentState;
  }
                    
}

 

module.exports = {
  StructTraverser
};



const { Evaluator } = require("./evaluator.js");
const { 
  SimpleStruct, 
  WhileStruct, 
  DoWhileStruct, 
  IfThenStruct, 
  IfThenElseStruct,
  structs
} = require("./structs.js");


const cytoscape = require("cytoscape");
