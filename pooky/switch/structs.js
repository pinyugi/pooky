

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
  END_STATE : 128,
  SAME_TRANSITION : 256
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

  previousSeenInHistory(states){
    return states.filter(s => this.history.indexOf(s) >= 0);
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

  getEndStates(){
    return this.states["endStates"];

  }

  traverseUntilStates(stopStates){
    const nodez = [];
    let getNextStruct = true;
 
    do{

      const { 
        nodes, 
        result 
      } = this.traverser.getNextStruct(
        {
          states : this.states, 
          statistics : this.statistics, 
          history : this.history
        }
      );
      if(nodes){
        nodez.push(...nodes);
      }
      
      if(stopStates.includes(this.traverser.currentState)){
        getNextStruct = false;
      }
      
      if(result == structs.END_STATE){
        getNextStruct = false;
      }

    }while(getNextStruct);

    return nodez;
    
  }

	isWhileLoop(){

		const result = this.getResultFromEvaluator();
		const transitions = this.getStateTransitions();
		const maybeLoop = structs.WHILE_LOOP; 
		const maybeLoopWithBreak = structs.WHILE_LOOP | structs.IF_THEN;
		const maybeLoopWithEndState = structs.WHILE_LOOP | structs.DOES_NOT_CONVERGE;
		const maybeLoopTypes = [maybeLoop, maybeLoopWithBreak, maybeLoopWithEndState];

		if(!maybeLoopTypes.includes(result)){
			return false;
		}

		return this.previousSeenInHistory(transitions);

	}

	isEndOfDoWhileLoop(){
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
    
    let ifThenNode = null;
    const testNode = this.getTestExpression();
    const transitions = this.getStateTransitions();
    const meta = this.getStateMeta();
    const convergedState = meta["ifThenConvergedState"];
    
    this.history.push(this.state);
    this.traverser.currentState = convergedState == transitions[0] ? transitions[1] : transitions[0];

    const testExpression = convergedState == transitions[1] ? testNode : t.unaryExpression("!", testNode);
    const nodes = this.traverseUntilStates([convergedState]);
    ifThenNode = t.ifStatement(testExpression, t.blockStatement(nodes));

    this.traverser.currentState = convergedState;

    return { nodes : [ifThenNode], result : this.getResultFromEvaluator()};

  }

}

class IfThenInsideLoopStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){
    
    let ifThenNode = null;
    const testNode = this.getTestExpression();
    const transitions = this.getStateTransitions();
    const meta = this.getStateMeta();
    const convergedState = meta["ifThenConvergedState"];
    
    this.history.push(this.state);
    this.traverser.currentState = convergedState == transitions[0] ? transitions[1] : transitions[0];

    const testExpression = convergedState == transitions[1] ? testNode : t.unaryExpression("!", testNode);
    const nodes = this.traverseUntilStates([convergedState]);
    ifThenNode = t.ifStatement(testExpression, t.blockStatement(nodes));

    this.traverser.currentState = convergedState;

    return { nodes : [ifThenNode], result : this.getResultFromEvaluator()};

  }

}

class IfThenElseStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

    const transitions = this.getStateTransitions();
    const meta = this.getStateMeta();
    const convergedState = meta["ifThenElseConvergedState"];
    this.history.push(this.state);

    this.traverser.currentState = transitions[0];
    const transitionANodes = this.traverseUntilStates([convergedState]);
    this.traverser.currentState = transitions[1];
    const transitionBNodes = this.traverseUntilStates([convergedState]);
    
    const ifThenElseNode = t.ifStatement(
      this.getTestExpression(),
      t.blockStatement(transitionANodes),
      t.blockStatement(transitionBNodes)
    );

    return { nodes : [ifThenElseNode], result : this.getResultFromEvaluator() };
  }

}

class IfThenElseInsideLoopStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

    const transitions = this.getStateTransitions();
    const meta = this.getStateMeta();
    const convergedState = meta["ifThenElseConvergedState"];
    this.history.push(this.state);

    this.traverser.currentState = transitions[0];
    const transitionANodes = this.traverseUntilStates([convergedState]);
    this.traverser.currentState = transitions[1];
    const transitionBNodes = this.traverseUntilStates([convergedState]);
    
    const ifThenElseNode = t.ifStatement(
      this.getTestExpression(),
      t.blockStatement(transitionANodes),
      t.blockStatement(transitionBNodes)
    );

    return { nodes : [ifThenElseNode], result : this.getResultFromEvaluator() };
  }

}

class WhileStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

		let whileNode = null;
    const testNode = this.getTestExpression();
    const transitions = this.getStateTransitions();
    const meta = this.getStateMeta();

    const whileNonLoopState = meta["whileNonLoopState"];
    const whileLoopState = meta["whileLoopState"];
    const endStates = this.getEndStates();

    this.history.push(this.state);

		if(this.isWhileLoop()){
			return { nodes : [whileNode], result : this.getResultFromEvaluator() };

		}

		const opts = {
			state : this.state,
			states : this.states,
			statistics : this.statistics,
			history : this.history,
			traverser : this.traverser
		};

		return this.getResultFromEvaluator() & structs.IF_THEN ? IfThenInsideLoopStruct(...opts) : IfThenElseInsideLoopStruc(...opts);
  }

}

class EndOfDoWhileStruct extends Struct {

  constructor(opts){
    super(opts);
  }

  simplify(){

    return { nodes : [], result : this.getResultFromEvaluator() };
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

class DoesNotConvergeStruct extends Struct {
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


class SameTransitionStruct extends Struct {

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
  DoesNotConvergeStruct,
  SimpleStruct,
  EndStateStruct,
  IfThenStruct,
  IfThenInsideLoopStruct,
  IfThenElseStruct,
  IfThenElseInsideLoopStruct,
  WhileStruct,
  DoWhileStruct,
  EndOfDoWhileStruct,
  SameTransitionStruct,
  structs
};
