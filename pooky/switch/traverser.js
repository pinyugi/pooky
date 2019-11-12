


class StructTraverser{

  constructor(graph){

    this.graph = graph || cytoscape();
    this.currentState = null;
    this.evaluator = new Evaluator(this.graph);
  }


  getNextStruct(opts){

    const { states, statistics, history } = opts;
    const currentState = this.getCurrentState();
    const structType = states[currentState]["result"];

    switch(structType){

      case (structs.DOES_NOT_CONVERGE):
        return new IfThenElseStruct({state : currentState, traverser : this, ...opts}).simplify();

      case (structs.SIMPLE):
        return new SimpleStruct({state : currentState, traverser : this, ...opts}).simplify();

      case (structs.IF_THEN):
        return new IfThenStruct({state : currentState, traverser : this, ...opts}).simplify();

			case (structs.IF_THEN_ELSE):
      case (structs.IF_THEN_ELSE | structs.DOES_NOT_CONVERGE):
        return new IfThenElseStruct({state : currentState, traverser : this, ...opts}).simplify();

      case (structs.WHILE_LOOP):
      case (structs.WHILE_LOOP | structs.IF_THEN):
      case (structs.WHILE_LOOP | structs.IF_THEN_ELSE):
        return new WhileLoopStruct({state : currentState, traverser : this, ...opts}).simplify();
			

      case (structs.DO_WHILE_LOOP):
        return new DoWhileLoopStruct({state : currentState, traverser : this, ...opts}).simplify();

      case (structs.END_STATE):
        return new EndStateStruct({state : currentState, traverser : this, ...opts}).simplify();
			
      default:
        console.log("Could not evaluate:", evaluated.result);
        break;
    }


  }

  visitAll(){

    const statistics = {};
    const states = {
      'endStates' : []
    };

    this.graph.$().nodes().forEach((n) =>{
      const stateId = n.id();
      const { result, meta } = states[stateId] = this.evaluator.interpret(stateId);
      statistics[result] = result in statistics ? statistics[result] + 1 : 1;

      if(result == structs.END_STATE){
        states['endStates'].push(stateId);
      }

    })

    return { states, statistics }
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



const { Evaluator  } = require("./evaluator.js");
const { getEndStates, getEleId } = require("./graph.js");
const { 
  SimpleStruct, 
  EndStateStruct, 
  WhileStruct, 
  DoWhileStruct, 
  IfThenStruct, 
  IfThenElseStruct,
  structs
} = require("./structs.js");




const cytoscape = require("cytoscape");
