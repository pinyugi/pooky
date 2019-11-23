


class StructTraverser{

  constructor(graph){

    this.graph = graph || cytoscape();
    this.currentState = null;
    this.evaluator = new Evaluator(this.graph);
  }


  getNextStruct(opts){

    const { states, history, statistics } = opts;
    const currentState = this.getCurrentState();
    const structType = states[currentState]["result"];

    switch(structType){

      case (structs.DOES_NOT_CONVERGE): //2
      case (structs.DOES_NOT_CONVERGE | structs.INFINITE_LOOP): //3
        return new DoesNotConvergeStruct({state : currentState, traverser : this, history, statistics}).simplify();

      case (structs.SIMPLE): //4
        return new SimpleStruct({state : currentState, traverser : this, history, statistics}).simplify();

      case (structs.IF_THEN): //8
      case (structs.IF_THEN | structs.DOES_NOT_CONVERGE): //10
        return new IfThenStruct({state : currentState, traverser : this, history, statistics}).simplify();

      case (structs.IF_THEN_ELSE | structs.DOES_NOT_CONVERGE): //18
        return new IfThenElseStruct({state : currentState, traverser : this, history, statistics}).simplify();

      case (structs.WHILE_LOOP): //32 there are no breaks or end states in a while loop
      case (structs.WHILE_LOOP | structs.DOES_NOT_CONVERGE): //34 there is at least 1 endstate in a while loop
      case (structs.WHILE_LOOP | structs.IF_THEN):// 40 there is at least 1 break in a while loop// 
      case (structs.WHILE_LOOP | structs.IF_THEN | structs.DOES_NOT_CONVERGE)://42
      case (structs.WHILE_LOOP | structs.IF_THEN_ELSE | structs.DOES_NOT_CONVERGE): //50
        return new WhileStruct({state : currentState, traverser : this, history, statistics}).simplify();
			

      case (structs.DO_WHILE_LOOP): //64
        return new DoWhileStruct({state : currentState, traverser : this, history, statistics}).simplify();

      case (structs.END_STATE): //128
        return new EndStateStruct({state : currentState, traverser : this, history, statistics}).simplify();

      case (structs.SAME_TRANSITION | structs.DO_WHILE_LOOP | structs.WHILE_LOOP | structs.IF_THEN):// 360
        return new SameTransitionStruct({state : currentState, traverser : this, history, statistics}).simplify();

      default:
        console.log("Could not evaluate:", evaluated.result);
        return [];
        
    }


  }

  visitAll(){

    const statistics = {};
    const states = {
      'endStates' : []
    };

    this.graph.$().nodes().forEach((n) =>{
      const stateId = n.id();
      const { result } = states[stateId] = this.evaluator.interpret(stateId);
      statistics[result] = result in statistics ? statistics[result] + 1 : 1;

      if(result == structs.END_STATE){
        states['endStates'].push(stateId);
      }

    });

    return { states, statistics };
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
  DoesNotConvergeStruct,
  SimpleStruct,
  EndStateStruct,
  IfThenStruct,
  IfThenElseStruct,
  WhileStruct,
  DoWhileStruct,
  EndOfDoWhileStruct,
  SameTransitionStruct,
  structs
} = require("./structs.js");




const cytoscape = require("cytoscape");
