const { 
	structs, 
	checkMode
} = require("./constants.js");

const STRUCT_CHECKS = {};

STRUCT_CHECKS[structs.INFINITE_LOOP] = function(state, graph){
	return isInfiniteLoop(state, graph);
},

STRUCT_CHECKS[structs.SIMPLE] = function(state, graph){
	return isSimple(state, graph);
},

STRUCT_CHECKS[structs.A_B_CONVERGES] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.A_CONVERGES_TO_B] = function(state, graph){
	const { doesConverge, whoConverges } =  doTransitionsConverge(state, graph)
	return doesConverge && whoConverges == "A";
},

STRUCT_CHECKS[structs.B_CONVERGES_TO_A] = function(state, graph){
	const { doesConverge, whoConverges } =  doTransitionsConverge(state, graph)
	return doesConverge && whoConverges == "B";
},

STRUCT_CHECKS[structs.A_B_CONTINUE] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.A_B_BREAK] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.CONTINUE_A_PROCEED_B] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.CONTINUE_B_PROCEED_A] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.BREAK_A_PROCEED_B] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.BREAK_B_PROCEED_A] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.CONTINUE_A_BREAK_B] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.CONTINUE_B_BREAK_A] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.LATER_CONTINUE_A_PROCEED_B] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.LATER_CONTINUE_B_PROCEED_A] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.LATER_BREAK_A_PROCEED_B] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.LATER_BREAK_B_PROCEED_A] = function(state, graph){
	return false;
},

STRUCT_CHECKS[structs.DO_WHILE_LOOP] = function(state, graph){
	return isDoWhileLoop(state, graph);
},

STRUCT_CHECKS[structs.WHILE_LOOP] = function(state, graph){
	return isWhileLoop(state, graph);
}


STRUCT_CHECKS[structs.WHILE_LOOP_INSIDE_DO_WHILE_LOOP] = function(state, graph){
	return isWhileLoopInsideDoWhileLoop(state, graph);
}



function getSourcesToState(state, graph){
	return graph.$(`[target = "${state}"]`).sources().map(getEleId);
}



function displayShit(state, graph){
	const { both, left, right, successors, predecessors } = getDiffOnSuccessorsAndPredecessors(state, graph);

	console.log("both:", both.map(getEleId));
	console.log("left:", left.map(getEleId));
	console.log("right:", right.map(getEleId));
	console.log("successors:", successors.edges().map(getEleId));
	console.log("predecessors:", predecessors.edges().map(getEleId));
		


}

function isInsideLoop(state, graph){

	const sourcesToState =  getSourcesToState(state, graph);
	let insideLoop = false;

	for(let i = 0; i<sourcesToState.length; i++){

		const { both, right, left } = getDiffOnSuccessorsAndPredecessors(sourcesToState[i], graph,mode="edges");

		if(both.size() != 0){
			insideLoop = true;
			break;
		}
		
	}

	return insideLoop;

}

function getDiffOnSuccessorsAndPredecessors(state, graph, mode="edges"){
		
	const predecessors = graph.$(toId(state)).predecessors();
	const successors = graph.$(toId(state)).successors();
	let diff = {
		both  : [],
		left  : [],
		right : []
	};

	if(mode == "edges"){
		diff = predecessors.edges().diff(successors.edges());
	}else if(mode == "nodes"){
		diff = predecessors.nodes().diff(successors.nodes());
	}else if(mode == "all"){
		diff = predecessors.diff(successors);
	}

	return {
		predecessors : predecessors,
		successors : successors,
		both : diff.both,
		left : diff.left,
		right : diff.right
	};
}

function isInfiniteLoop(state, graph){

	const { hasTransitions, transitions } = getStateInfo(state, graph);

	if(!hasTransitions) return false;
  
	const endStates = getEndStates(graph);
	const successorsA = getStateSuccessors(graph, transitions[0], "nodes");
	const successorsB = getStateSuccessors(graph, transitions[1], "nodes");

	return successorsA.same(successorsB) && !successorsA.contains(endStates);

}


function isSimple(state, graph){

	/*
	 
	 A simple node should have no transitions and not be a DoWhileLoop.So no looping back. 


	*/

	const { hasTransitions } = getStateInfo(state, graph);

	if(hasTransitions) return false;
	return !isDoWhileLoop(state, graph);


}

function isWhileLoop(state, graph){

	const { hasTransitions, transitions } = getStateInfo(state, graph);
	if(!hasTransitions) return false;

	const sourcesToState = getSourcesToState(state, graph);

	//If we have less than 1 source leading to our state then we definitely do not have a WhileLoop	
	//Because we need at least one state coming back from a loop, and one state leading to our state normally
	if(sourcesToState.length < 2){
		return false;
	}

	let foundTransitions = {};
	const dijkstraA = graph.elements().dijkstra({ root : toId(transitions[0]), directed : true});
	const dijkstraB = graph.elements().dijkstra({ root : toId(transitions[1]), directed : true});
	const shortestPathBtoA = dijkstraB.pathTo(graph.$(toId(transitions[0]))).edges();
	const shortestPathAtoB = dijkstraA.pathTo(graph.$(toId(transitions[1]))).edges();

	//If both path's are empty then it is defintely not a WhileLoop since we need a loop back.
	if(shortestPathAtoB.size() == 0 && shortestPathBtoA.size() == 0){
		return false;
	}

	/*
	 
	 Let's check if one of the shortestPath(AtoB or BtoA) is empty and the one that is not empty has a our state as a target. 
	 In other words, it had to loop back to get to the second transition.
	 
	*/


	const hasStateAsTarget = (n) => n.target().map(getEleId)[0] == state; 

	if( shortestPathAtoB.size() == 0 || shortestPathBtoA.size() == 0){
		const nonEmptyPath = shortestPathAtoB.size() == 0 ? shortestPathBtoA : shortestPathAtoB;
		
		//If the nonEmptyPath contains at least 1 edge with the target as our state, then it is a loop back.
		if(nonEmptyPath.some(hasStateAsTarget)){
			return true;
		}


	}else{

		/*
			Now let's check for a special case where both transitions end up converging before looping back(if inside a loop). We
			need to do a diff on both of the shortestpaths. From the left and right map grab the last edge. If they both have the same
			target, then it is not a WhileLoop and both transitions converged before there was a loop back to the original state.

		*/

		const { left, right } = shortestPathAtoB.diff(shortestPathBtoA);
		const getTarget = (n) => n.target().map(getEleId)[0];

		if(right.slice(-1).map(getTarget) == left.slice(-1).map(getTarget)){
			return false;
		}

		/*

			Last but not least we need to differentiate a WhileLoop from an IfThen that is inside a loop. The former has a state looping back
			while the other one doesn't. 

			To do this we are going to basically find the shortest path for both transitions to each source state. If it's a WhileLoop, then 
			to get to one of the source state it must PASS through another source state to get to the source state that it is inside a loop.

			If none of the transitions pass through another source state to get to a different source state, then it is not a WhileLoop.

		*/


		const sourcesToState = getSourcesToState(state, graph);
		for(let i=0; i<transitions.length ; i++){

			const dijkstraTransition = graph.elements().dijkstra({ root : toId(transitions[i]), directed : true});

			for(let j=0; j < sourcesToState.length; j++){

				const shortestPath = dijkstraTransition.pathTo(graph.$(toId(sourcesToState[j]))).edges();
				const targets = shortestPath.map( (n) => n.target().map(getEleId)[0]);
				
				const foundTargets = targets.filter( (x) => sourcesToState.includes(x));
				if(foundTargets.length > 1){
					return true;
				}

			}
		}

	}


	return false;



}

function isDoWhileLoop(state, graph){

	/*
	 

	 Note:A DoWhileLoop can only be a normal state. Sometimes the normal state can be inside a loop and it is hard
	 to distinguish the incoming states that are part of a loop or not. In that case we need to use dijkstra algorithm to 
	 basically find the shortest path for all the states with a target to our state.
	 
	 This needs to be done without going backwards(directed = true) which will get us a common set of paths one must follow to get 
	 to our state. Iterate through all the states that connect to our states, and find the shortest path for each one without looping(directed = true). 

	 With the collection of each state's path, we will need to do a diff on the current path collection to the previous path collection.

	 If there is an empty right map or empty left map then it means that we have found a state that loops back, which will mean it is a DoWhileLoop.
	 However, in the case that we never found an empty right or empty left, then it means that we have found a simple node that simply converged two nodes
	 and does not have any states that loop back.

	
	*/


	const { hasTransitions, transitions, transitionsEdges, transitionsNodes } = getStateInfo(state, graph);
	let hasDoWhileLoop = false;

	if(hasTransitions) return hasDoWhileLoop;	

	const { both, right, left } = getDiffOnSuccessorsAndPredecessors(state, graph,mode="all");
	const dijkstra = both.dijkstra({root : toId(state), directed : true});
	const sourcesToState =  getSourcesToState(state, graph);

	let previousNode = dijkstra.pathTo(graph.$(toId(sourcesToState[0]))).edges();

	for(let i=1; i<sourcesToState.length; i++){

		const currentState = graph.$(toId(sourcesToState[i]));
		const currentNode = dijkstra.pathTo(currentState).edges();
		const diff = previousNode.diff(currentNode);
		/*
		
			Basically if once we do a diff, then if we have an empty left or right map then it means that
			currentNode or previousNode contains all the other nodes of the other. 

		*/
		if(diff.left.size() == 0 || diff.right.size() == 0){
			hasDoWhileLoop = true;
			break;

		}else{
			previousNode = currentNode;
		}

	}
	
	return hasDoWhileLoop;
	

}

function isWhileLoopInsideDoWhileLoop(state, graph){
}
function doTransitionsConverge(state, graph){

	/*
	 
		There are two ways two transitions are going to converge. 
		If it is a WhileLoop 
	
	*/

	return false;
	displayShit(state, graph);
	const { hasTransitions, transitions } = getStateInfo(state, graph);

	const { both, left, right, successors, predecessors } = getDiffOnSuccessorsAndPredecessors(state, graph);
	//const {both, right, left } = getDiffOnSuccessorsAndPredecessors(state, graph);
	

	const incomingStates = graph.$(`[target = "${state}"]`).sources().map(getEleId);
	console.log("incoming states:", incomingStates);

	let whoConverges = null; 
	let doesConverge = false; 


	if(!hasTransitions){
		return {
			whoConverges : whoConverges,
			doesConverge : doesConverge
		};
	}

	if(isWhileLoop(state, graph)){
		
		return {
			whoConverges : whoConverges,
			doesConverge : doesConverge
		};

	}

	const transitionADegrees = graph.$(`#${transitions[0]}`).indegree();
	const transitionBDegrees = graph.$(`#${transitions[1]}`).indegree();

	doesConverge = ( 
		transitionADegrees == 2 ||
		transitionBDegrees == 2  
	);
	
	if(doesConverge){
		whoConverges = transitionBDegrees > transitionADegrees ? "A" : "B";
	}

	return {
		whoConverges : whoConverges,
		doesConverge : doesConverge
	};


}
class Evaluator{


  constructor(graph){
    this.graph = graph || cytoscape();
  }


	
	
  interpret(state, mode=checkMode.CHECK_EVERY_THING){

		let structType = 0;
		for(let check of Object.keys(STRUCT_CHECKS)){
			if((mode & check) == check){
				structType |= STRUCT_CHECKS[check](state, this.graph)  ? check : structType;
			}
		}
			

		return structType;

  }

	someShit(state){
		
		const { hasTransitions, transitions, transitionsEdges, transitionsNodes } = getStateInfo(state, this.graph);

		console.log("edges A:", transitionsEdges[0].map(getEleId));
		console.log("edges B:", transitionsEdges[1].map(getEleId));
		console.log("nodes A:", transitionsNodes[0].map(getEleId));
		console.log("nodes B:", transitionsNodes[1].map(getEleId));
		const statePredecessors = this.graph.$(toId(state)).predecessors().edges();
		const stateSuccessors = this.graph.$(toId(state)).successors().edges();

		const left = statePredecessors.diff(stateSuccessors).left;
		const right = statePredecessors.diff(stateSuccessors).right;
		const both = statePredecessors.diff(stateSuccessors).both;
		const connectedEdges = this.graph.$(toId(state)).connectedEdges();
		const hasStateAsTarget = this.graph.$('edge[target="3"]');
		console.log("State :", state, " predecessors :", statePredecessors.map(getEleId));
		console.log("State :", state, " successors  :", stateSuccessors.map(getEleId));
		console.log("State :", state, " complement :", statePredecessors.complement(transitionsEdges[0]).edges().map(getEleId));
		console.log("State :", state, " connected edges :", connectedEdges.map(getEleId));
		console.log("State :", state, " successors diff of  predecessors left :", left.map(getEleId))
		console.log("State :", state, " successors diff of  predecessors right :", right.map(getEleId))
		console.log("State :", state, " successors diff of  predecessors both :", both.map(getEleId))
		console.log("State :", state, " whats left after removing ", connectedEdges.not(left).not(right).edges().map(getEleId))
		console.log("State :", state, " first loop back ", connectedEdges.not(hasStateAsTarget).map(getEleId));
		console.log("predecessors state 4 :",  this.graph.$(toId(4)).predecessors().edges().map(getEleId));

		const stopNodes = [3, 4];
		const edges = [];

		this.graph.elements().dfs({
			roots : "#3",
			visit : function(v, e, u, i){
				
				console.log("v:", v.map(getEleId), " e:", e !== undefined ? e.map(getEleId) : "" , "u:", u !== undefined ? u.map(getEleId) : "");
			},
			directed : true
		})




    
  }



};

module.exports = {
  Evaluator
};

const { 
	toId,
	getEleId,
  getStateInfo,
  getStateTransitions,
  getEndStates,
  getStateSuccessors
} = require("./graph.js");

