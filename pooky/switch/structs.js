

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
  SAME_TRANSITION : 256,
  END_OF_DO_WHILE_LOOP : 512
};


class Struct {

  constructor(opts){
    this.state = parseInt(opts.state, 10);
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

  getStateNodes(){
    return [...this.states[this.state]["nodes"]];

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

  getStructData(){
    return {
      meta : this.getStateMeta(),
      transitions : this.getStateTransitions(),
      result : this.getResultFromEvaluator(),
      nodes : this.getStateNodes(),
      endStates : this.getEndStates(),
    };

  }

  getNextStruct(){
    const { 
      state,
      nodes, 
      result 
    } = this.traverser.getNextStruct(
      {
        states : this.states, 
        statistics : this.statistics, 
        history : this.history
      }
    );

    return { state, nodes, result };
   
  }

  traverseUntilStates(stopStates){
    const nodez = [];
    let getNextStruct = true;
 
    do{

      const { nodes, result } = this.getNextStruct();
      if(nodes){
        nodez.push(...nodes);
      }
      
      if(stopStates.includes(this.traverser.currentState)){
        getNextStruct = false;
      }

      const breakResults = [structs.END_STATE];
      if(breakResults.includes(result)){
        getNextStruct = false;
      }
      

    }while(getNextStruct);

    return nodez;
    
  }


  getPreviousSeenStructs(callback, structType){

    const results = [];
    for(let prevState of this.history){
      const result = this.states[prevState]["result"];
      const meta = this.states[prevState]["meta"];

      if(result & structType){
        results.push(callback(prevState, meta));
      }
    }

    return results;

  }

  isContinueLoop(state){

    return this.getPreviousSeenStructs( 
      (prevState, meta) => prevState == state, 
      structs.WHILE_LOOP
    ).some( (x) => x);
		
  }

  isBreakLoop(state){

    return this.getPreviousSeenStructs( 
      (prevState, meta) => meta["whileNonLoopState"] == state, 
      structs.WHILE_LOOP
    ).some( (x) => x);
		
  }

  isEndOfDoWhile(state){
		
    const doWhileEndStates = this.getPreviousSeenStructs( 
      (prevState, meta) => meta["doWhileEndStates"], 
      structs.WHILE_LOOP
    ).filter( (x) => x !== undefined);

    console.log("doWhileEndStates", doWhileEndStates);

		


  }
  
}


class SimpleStruct extends Struct {

  constructor(opts){
    super(opts);
  }

  simplify(){

    const { meta, transitions, result, nodes, endStates } = this.getStructData();
    let finalResult = result;
    this.history.push(this.state);

    this.traverser.currentState = transitions[0];
    if(this.isContinueLoop(transitions[0])){
      nodes.push(t.continueStatement());
      finalResult = structs.END_STATE;

    }else if(this.isBreakLoop(transitions[0])){

      nodes.push(t.breakStatement());
      finalResult = structs.END_STATE;

    }else if(endStates.includes(transitions[0])){
      //finalResult = structs.END_STATE;
      //finalResult = structs.END_STATE;
			

    }

    return { state : this.state, nodes , result : finalResult };

  }

}

class IfThenStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){
    
    let ifThenNode = [];

    const { meta, transitions, result, nodes, endStates } = this.getStructData();

    const testNode = this.getTestExpression();
    const convergedState = meta["ifThenConvergedState"];
    
    this.history.push(this.state);
    //this.traverser.currentState = convergedState;

    if(transitions.includes(convergedState)){
			if(this.state == 43){
				console.log("transitions includes converged state at 43");
			}
      const nodez = [];

      const notConvergingState = convergedState == transitions[0] ? transitions[1] : transitions[0];
      this.traverser.currentState = notConvergingState;
      nodez.push(...this.traverseUntilStates([convergedState]));

      const testExpression = convergedState == transitions[1] ? testNode : t.unaryExpression("!", testNode);

      ifThenNode.push(
				...nodes,
        t.ifStatement(testExpression, t.blockStatement(nodez))
      );

			//if(this.state == 43){
		//		console.log("state 43 is after ifthennodepush");
			//}
			if(endStates.includes(convergedState)){
				
				return { state : this.state, nodes : ifThenNode, result : structs.END_STATE}
			}
		
			if(this.state == 43){
				var recast = require("recast");
				for(let n of ifThenNode){
					console.log("Node:", recast.print(n).code);
				}
			}
      this.traverser.currentState = convergedState;

    }else{
			if(this.state == 43){
				console.log("transitions DOES NOT includes converged state at 43");
			}

      const consequentNodes = [];
      const alternateNodes = [];

      this.traverser.currentState = transitions[0];
      consequentNodes.push(...this.traverseUntilStates([convergedState]));
      this.traverser.currentState = transitions[1];
      alternateNodes.push(...this.traverseUntilStates([convergedState]));

      ifThenNode.push(
				...nodes,
        t.ifStatement(testNode, t.blockStatement(consequentNodes), t.blockStatement(alternateNodes))
      );



      this.traverser.currentState = convergedState;
    }

    return { state : this.state, nodes : ifThenNode,  result };

  }

}

class IfThenElseStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

    let ifThenElseNode = [];

    const { meta, transitions, result, nodes, endStates } = this.getStructData();
    const convergedState = meta["ifThenElseConvergedState"];
    this.history.push(this.state);

		
		this.traverser.currentState = transitions[0];
		const transitionANodes = this.traverseUntilStates([convergedState]);
		this.traverser.currentState = transitions[1];
		const transitionBNodes = this.traverseUntilStates([convergedState]);


		ifThenElseNode.push(
			...nodes,
			t.ifStatement(
				this.getTestExpression(),
				t.blockStatement(transitionANodes),
				t.blockStatement(transitionBNodes)
			)
		);


		this.traverser.currentState = convergedState;


    return { state : this.state, nodes : ifThenElseNode, result };

  }

}

class WhileStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

    let whileNode = [];
    const whileBodyNodes = [];
    const { meta, transitions, result, nodes, endStates } = this.getStructData();

    const testNode = this.getTestExpression();

    const whileStart = meta["whileStart"];
    const whileNonLoopState = meta["whileNonLoopState"];
    const whileLoopState = meta["whileLoopState"];

    this.history.push(this.state);
    this.traverser.currentState = whileLoopState;

    while(this.traverser.currentState != whileStart){
      const { nodes : nodez} = this.getNextStruct();
			whileBodyNodes.push(...nodez);
			
    }

    whileNode.push(
			...nodes,
      t.whileStatement(
        testNode, 
        t.blockStatement(whileBodyNodes)
      )
    );


    this.traverser.currentState = whileNonLoopState;


    return { state : this.state, nodes : whileNode,  result };
  }

}

class DoWhileStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){

    let doWhileNode = [];
    const { meta, transitions, result, nodes, endStates } = this.getStructData();

    return { state : this.state, nodes: doWhileNode, result };
  }


}

class EndOfDoWhileStruct extends Struct {

  constructor(opts){
    super(opts);
  }

  simplify(){

    const { meta, transitions, result, nodes, endStates } = this.getStructData();

    return { state : this.state, nodes, result };
  }
}

class DoesNotConvergeStruct extends Struct {
  constructor(opts){
    super(opts);
  }
	
  simplify(){

    const ifThenElseNode = [];

    const { meta, transitions, result, nodes, endStates } = this.getStructData();
		
    this.history.push(this.state);
    this.traverser.currentState = transitions[0];

    const bodyNodes = {
      [transitions[0]] : [],
      [transitions[1]] : [],
    };

    let convergedStates = new Set();
    for(let i=0; i < 2;i++){

      this.traverser.currentState = transitions[i];

      let keepLooping = true;
      while(keepLooping){

        const { nodes : nodez, state : currentState, result : loopResult } = this.getNextStruct();
        //convergedStates = new Set([...convergedStates, ...this.getAllPrevConvergedStates()]);

        //if(!convergedStates.has(currentState)){

        bodyNodes[transitions[i]].push(...nodez);
        //}

        if(loopResult == structs.END_STATE){
          keepLooping = false;
        }

      }

    }

    ifThenElseNode.push(
			...nodes,
      t.ifStatement(
        this.getTestExpression(), 
        t.blockStatement(bodyNodes[transitions[0]]),
        t.blockStatement(bodyNodes[transitions[1]])
      )
    );


    return { state : this.state, nodes : ifThenElseNode,  result : structs.END_STATE };
  }


  getAllPrevConvergedStates(){
    const convergedStates = new Set();

    this.getPreviousSeenStructs( 
      (prevState, meta) => meta["ifThenConvergedState"], 
      structs.IF_THEN
    ).forEach( (s) => convergedStates.add(s));
		
    this.getPreviousSeenStructs( 
      (prevState, meta) => meta["ifThenElseConvergedState"], 
      structs.IF_THEN_ELSE
    ).forEach( (s) => convergedStates.add(s));

    return convergedStates;


	
  }

}

class EndStateStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){
		
		
    const { meta, transitions, result, nodes, endStates } = this.getStructData();
    this.history.push(this.state);
    console.log("Should be ending here:", result, "state:", this.state);

    return { state : this.state, nodes, result };
  }

}


class SameTransitionStruct extends Struct {

  constructor(opts){
    super(opts);
  }
	
  simplify(){
		
    const { meta, transitions, result, nodes, endStates } = this.getStructData();

    this.history.push(this.state);


    return { nodes, result };
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
  EndOfDoWhileStruct,
  SameTransitionStruct,
  structs
};
