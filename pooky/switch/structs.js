

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

  previousSeenInHistory(states){
    return states.filter(s=> this.history.indexOf(s) >= 0)
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


  traverseUntil(stop, stopSign="state"){
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
      
      if(stopSign == "state"){
        if(this.traverser.currentState == stop){
          getNextStruct = false;
        }

      }else if(stopSign == "result"){
        if(result == stop){
          getNextStruct = false;
        }

      }
      if(result == structs.END_STATE){
        getNextStruct = false;
      }

    }while(getNextStruct)

    return nodez;
    
  }
  traverseUntilState(stop){
    
    return this.traverseUntil(stop, stopSign="state");
  }

  traverseUntilResult(stop){

    return this.traverseUntil(stop, stopSign="result");
  }

  isStateABreak(state){
    /*

		if(this.whileStart !== undefined){
			return this.state == this.whileNonLoopState;

		}
		*/

    return false;

  }

  isStateAContinue(state){

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
    
    let ifThenNode = null;
    const testNode = this.getTestExpression();
    const transitions = this.getStateTransitions();
    const meta = this.getStateMeta();
    const convergedState = meta["ifThenConvergedState"];

    const previousSeen = this.previousSeenInHistory(transitions);
    
    this.traverser.currentState = convergedState == transitions[0] ? transitions[1] : transitions[0];
    this.history.push(this.state);

    if(previousSeen){
      const isFirstTransition = previousSeen[0] == transitions[0] ? true : false;
      const testExpression = isFirstTransition ?  testNode : t.unaryExpression("!",testNode);
      ifThenNode = t.ifStatement(testExpression, t.blockStatement(t.continueStatement()));

    }else{

      const testExpression = convergedState == transition[1] ? testNode : t.unaryExpression("!", testNode)
      const nodes = this.traverseUntilState(convergedState);
      ifThenNode = t.ifStatement(testExpression, t.blockStatement(nodes));

    }
    this.traverser.currentState = convergedState == transitions[0] ? transitions[0] : transitions[1];

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
    const transitionANodes = this.traverseUntilState(convergedState);
    this.traverser.currentState = transitions[1];
    const transitionBNodes = this.traverseUntilState(convergedState);
    
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
    const convergedState = meta["ifThenConvergedState"];
    const whileNonLoopState = meta["whileNonLoopState"];
    const whileLoopState = meta["whileLoopState"];

    const previousSeen = this.previousSeenInHistory(transitions);
    let isLoop = false;
    let isEndOfDoWhile = false;
    let isBreak = false;

    if(convergedState !== undefined){
      if(convergedState == whileLoopState){
        isEndOfDoWhile = true;
      }else{
        if(previousSeen){
          isBreak = true;
        }else{
          isLoop = true;
        }
      }
    }else{
      isLoop = true;
    }

    this.history.push(this.state);

    if(isEndOfDoWhile){

    }

    if(isBreak){

    }

    if(isLoop){
      this.traverser.currentState = whileLoopState;
      const nodes = this.traverseUntilResult(structs.DOES_NOT_CONVERGE);
      const testExpression = convergedState == transition[1] ? testNode : t.unaryExpression("!", testNode)

      whileNode = t.whileStatement(testExpression, t.blockStatement(nodes));


    }

    //return { nodes : [], result : this.getResultFromEvaluator() }; 
    return { nodes : [whileNode], result : structs.END_STATE };
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




module.exports = {
  DoesNotConvergeStruct,
  SimpleStruct,
  EndStateStruct,
  IfThenStruct,
  IfThenElseStruct,
  WhileStruct,
  DoWhileStruct,
  structs
};
