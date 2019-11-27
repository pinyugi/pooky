

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

			if(result == structs.END_STATE){
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
    this.traverser.currentState = convergedState;

    if(transitions.includes(convergedState)){
      const nodez = [];

      const notConvergingState = convergedState == transitions[0] ? transitions[1] : transitions[0];
      this.traverser.currentState = notConvergingState;
      nodez.push(...this.traverseUntilStates([convergedState]));

      const testExpression = convergedState == transitions[1] ? testNode : t.unaryExpression("!", testNode);

      ifThenNode.push(
				t.ifStatement(testExpression, t.blockStatement(nodez))
			);

    }else{

      const consequentNodes = [];
      const alternateNodes = [];

      this.traverser.currentState = transitions[0];
      consequentNodes.push(...this.traverseUntilStates([convergedState]));
      this.traverser.currentState = transitions[1];
      alternateNodes.push(...this.traverseUntilStates([convergedState]));

      ifThenNode.push(
				t.ifStatement(testNode, t.blockStatement(consequentNodes), t.blockStatement(alternateNodes))
			);


    }

    this.traverser.currentState = convergedState;

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

		const dualIfStatements = endStates.includes(convergedState);

		if(dualIfStatements){

			this.traverser.currentState = transitions[0];
			const transitionANodes = this.traverseUntilStates([convergedState]);


			ifThenElseNode.push(
				t.ifStatement(
					this.getTestExpression(), 
					t.blockStatement(transitionANodes)
				)
			);

			this.traverser.currentState = transitions[1];

		}else{
			
			this.traverser.currentState = transitions[0];
			const transitionANodes = this.traverseUntilStates([convergedState]);
			this.traverser.currentState = transitions[1];
			const transitionBNodes = this.traverseUntilStates([convergedState]);


			ifThenElseNode.push(
				t.ifStatement(
					this.getTestExpression(),
					t.blockStatement(transitionANodes),
					t.blockStatement(transitionBNodes)
				)
			);


			this.traverser.currentState = convergedState;

		}

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
      const { nodes : nodez, result } = this.getNextStruct();
      whileBodyNodes.push(...nodez);
			
    }
    whileNode.push(
			t.whileStatement(
				testNode, 
				t.blockStatement(this.removeContinueIfLast(whileBodyNodes))
			)
		);

    this.traverser.currentState = whileNonLoopState;


    return { state : this.state, nodes : whileNode,  result };
  }

	removeContinueIfLast(nodes){

		const lastNode = nodes.slice(-1)[0];
		switch(lastNode.type){
			
			case "IfStatement":

				const lastNodeConsequent = lastNode.consequent.body.slice(-1)[0];
				if(lastNodeConsequent.type == "ContinueStatement"){
					lastNode.consequent.body.pop();
				}

				if(lastNode.alternate !== null){
				
					const lastNodeAlternate = lastNode.alternate.body.slice(-1)[0];

					if(lastNodeAlternate.type == "ContinueStatement"){
						lastNode.alternate.body.pop();
					}

				}

				break;
			case "ContinueStatement":
				nodes.pop();
				break;

		}

		return nodes;

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

		const convergedStates = new Set();
		for(let i=0; i < 2;i++){

			let keepLooping = true;

			while(keepLooping){

				const { nodes : nodez, state : currentState, result : loopResult } = this.getNextStruct();
				console.log(
					"currentState:", this.traverser.currentState, 
					"state:", currentState, 
					" result:", loopResult
				);
				console.log("previous converged states:", this.getAllPrevConvergedStates());

				bodyNodes[transitions[i]].push(...nodez);

				if(loopResult == structs.END_STATE){
					keepLooping = false;
				}

			}

			console.log("done looping:");
		}

		ifThenElseNode.push(
			t.ifStatement(
				this.getTestExpression(), 
				t.blockStatement(bodyNodes[transitions[0]]),
				t.blockStatement(bodyNodes[transitions[1]])
			)
		);


    //return { nodes : doesNotConvergeNode, result : structs.END_STATE };

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
