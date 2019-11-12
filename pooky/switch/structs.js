

const t = require("@babel/types");

const structs = {
  UNKNOWN : 0,
  INFINITE_LOOP : 1,
  DOES_NOT_CONVERGE : 2,
  SIMPLE : 4,
  IF_THEN : 8,
  IF_THEN_ELSE : 16,
  WHILE_LOOP : 32,
  DO_WHILE_LOOP : 64, 
  END_STATE : 128
};


class Struct {

  constructor(opts){
    this.state = opts.state;
    this.states = opts.states;
    this.statistics = opts.statistics;
    this.history = opts.history;
    this.traverser = opts.traverser;

  }
  simplify(){
    throw Error("Need to Implement!");
  }



  getStateTransitions(){

    const transition = this.states[this.state]["transition"];
    if(transition === null){
      return [];
    }

    return transition.states;
  }

  getResultFromEvaluator(){
    return this.states[this.state]["result"];
  }

  getStateMeta(){
    return this.states[this.state]["meta"];
  }

  getTestExpression(){

    return this.states[this.state]["transition"]["test"];
	
  }


  traverseUntil(stop){
    throw Error("Need to Implement!");
  }

  isStateABreak(){
    /*

		if(this.whileStart !== undefined){
			return this.state == this.whileNonLoopState;

		}
		*/

    return false;

  }

  isStateAContinue(){

    /*
		if(this.whileStart !== undefined){
			return this.state == this.whileLoopState;

		}
		*/

    return false;


  }

  isStateADoWhileEndState(){
		
    /*
		if(this.doWhileEndStates !== undefined){
			return Object.keys(this.doWhileEndStates).includes(this.state);
		}
		*/

    return false;


  }

}


class SimpleStruct extends Struct {

  constructor(opts){
    super(opts);
  }

  simplify(){

    const nodes = this.states[this.state]["nodes"];
    const transitions = this.getStateTransitions();
		
    this.traverser.currentState = transitions[0];
    this.history.push(this.state);

    return { nodes , result : this.getResultFromEvaluator() };

  }

}

class IfThenStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){
		
    const transitions = this.getStateTransitions();
    const meta = this.getStateMeta();
    const convergedState = meta["ifThenConvergedState"];

    this.traverser.currentState = convergedState == transitions[0] ? transitions[1] : transitions[0];
    this.history.push(this.state);

    let getNextStruct = false;


    const nodes = this.traverseUntil(stop=convergedState);
    const ifThenNode = t.ifStatement(this.getTestExpression(), t.blockStatement(nodes));

    return { nodes : [ifThenNode], result : this.getResultFromEvaluator()};

  }

}

class IfThenElseStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

    return { nodes : [], result : this.getResultFromEvaluator() };
  }

}

class WhileStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

    return false;
  }
}

class DoWhileStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

    return { nodes : [], result : this.getResultFromEvaluator() };
  }


}

class EndStateStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){
		
    const nodes = this.states[this.state]["nodes"];
    const transitions = this.getStateTransitions();
		
    this.history.push(this.state);


    return { nodes : [], result : this.getResultFromEvaluator() };
  }


}




module.exports = {
  SimpleStruct,
  EndStateStruct,
  IfThenStruct,
  IfThenElseStruct,
  WhileStruct,
  DoWhileStruct,
  structs
};
