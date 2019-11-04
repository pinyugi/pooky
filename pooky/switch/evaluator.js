
const structs = {
  UNKNOWN : 0,
  INFINITE_LOOP : 1,
  SAME_TRANSITION : 2,
  SIMPLE : 4,
  A_B_DOES_NOT_CONVERGE : 8,
  A_B_CONVERGES : 16,
  A_CONVERGES_TO_B : 32, 
  B_CONVERGES_TO_A : 64,
  CONTINUE_A_PROCEED_B : 128,
  CONTINUE_B_PROCEED_A : 256,
  BREAK_A_PROCEED_B : 512,
  BREAK_B_PROCEED_A : 1024,
  CONTINUE_A_BREAK_B : 2048,
  CONTINUE_B_BREAK_A : 4096,
  WHILE_LOOP : 8192,
  DO_WHILE_LOOP : 16384,
  WHILE_LOOP_INSIDE_DO_WHILE_LOOP : 32768,
  END_STATE : 65536
};

function getEleId(node){
  return node.id();

}

function getNodeData(state, graph){
  const stateId = toId(state);
  const data = graph.$(stateId).map(function(n){ return n.data()});

  return data.length ? data[0] : false;
}

function toId(state){
  return `#${state}`;
}

function getEndStates(graph){
  return graph.$().leaves();
}

function getStateSuccessors(graph, transition, element="edges"){
    
  return element == "nodes"
    ? graph.$(toId(transition)).successors().nodes() 
    : graph.$(toId(transition)).successors().edges();

}

function getStateTransitions(state, graph){

  const stateId = toId(state);
  const data = getNodeData(state, graph)

  let hasTransitions = false;
  let transitions = [];

  transitions = graph.$(stateId).outgoers().nodes().map(getEleId);
  hasTransitions = transitions.length != 0 ? true : false;


  return {
    'hasTransitions' : hasTransitions,
    'transitions' : transitions
  }

}

function getSourcesToState(state, graph){
  const query = `[target = "${state}"]`;
  return graph.$(`[target = "${state}"]`).sources().map(getEleId);
}

function getShortestPath(fromState, toState, graph){

  const dijkstra = graph.elements().dijkstra({ root : toId(fromState), directed : true});
  return dijkstra.pathTo(graph.$(toId(toState))).edges();
}

function getAllShortestsPaths(fromStates, toStates, graph){
  const paths = {};

  toStates.forEach((ts) => {
    paths[ts] = {};
		
    fromStates.forEach((fs) => {
      paths[ts][fs] = getShortestPath(fs, ts, graph);
    });
  });

  return paths;

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

function getSymDiffOnAllDirectPaths(state, graph){

  const { transitions } = getStateTransitions(state, graph);
  const sourcesToState = getSourcesToState(state, graph);
  const shortestPaths = getAllShortestsPaths(transitions, sourcesToState, graph);
  const directPaths = {};
  directPaths[transitions[0]] = [];
  directPaths[transitions[1]] = [];

  const noDirectPath = (n) => n.target().map(getEleId)[0] == state;
  for(let st in shortestPaths){
    for(let tr in shortestPaths[st]){
      !shortestPaths[st][tr].some(noDirectPath) ? directPaths[tr].push(st) : "";
    }
  }

  const t1 = directPaths[transitions[0]];
  const t2 = directPaths[transitions[1]];

  return t1.filter(x => !t2.includes(x)).concat(t2.filter(x => !t1.includes(x)));


}

function doTransitionsHaveMultipleTargets(transitions, graph){
	let hasMoreTargets = false;

	hasMoreTargets = graph.$(`[target = "${transitions[1]}"]`).size() > 1 ? true : hasMoreTargets;
	hasMoreTargets = graph.$(`[target = "${transitions[1]}"]`).size() > 1 ? true : hasMoreTargets;
	return hasMoreTargets;

}

function findConvergence(state, graph){

	const { hasTransitions, transitions } = getStateTransitions(state, graph);

	if(!hasTransitions || transitions.length != 2){
		return false;
	}

	const targetsToA = graph.$(`[target = "${transitions[0]}"]`).map((n) => n.source().map(getEleId)[0]);
	const targetsToB = graph.$(`[target = "${transitions[1]}"]`).map((n) => n.source().map(getEleId)[0]);

	if(targetsToA.length == 2 || targetsToB.length == 2){
		return targetsToA.length == 2 ? transitions[0] : transitions[1];
	}

	return false;

}

function isInsideLoop(state, graph){

  const sourcesToState =  getSourcesToState(state, graph);
  let insideLoop = false;

  for(let i = 0; i<sourcesToState.length; i++){

    const { both } = getDiffOnSuccessorsAndPredecessors(sourcesToState[i], graph,mode="edges");

    if(both.size() != 0){
      insideLoop = true;
      break;
    }
		
  }
  return insideLoop;

}

function isInfiniteLoop(state, graph){

  const { hasTransitions, transitions } = getStateTransitions(state, graph);

  if(!hasTransitions) return false;
  
  const endStates = getEndStates(graph);
  const successorsA = getStateSuccessors(graph, transitions[0], "nodes");
  const successorsB = getStateSuccessors(graph, transitions[1], "nodes");

  return successorsA.same(successorsB) && !successorsA.contains(endStates);

}

function isSimpleIfThen(state, graph){

  const defaultResult = { 
		hasSimpleIfThen : false, 
		ifThenType : null,
		convergedState : null 
	};

  const hasLoop = isInsideLoop(state, graph);

	if(hasLoop){
		return defaultResult;
	}

	const { hasIfThen, ifThenType, convergedState } = isIfThen(state, graph);

	if(hasIfThen){
		defaultResult['hasSimpleIfThen'] = true;
		defaultResult['ifThenType'] = ifThenType;
		defaultResult['convergedState'] = convergedState;
	}

	return defaultResult;
}

function isSimpleIfThenElse(state, graph){

  const defaultResult = { 
		hasSimpleIfThenElse : false, 
		convergedState : null 
	};

	const { hasSimpleIfThen } = isSimpleIfThen(state, graph);

	if(!hasSimpleIfThen){
		const defaultResult = { 
			hasIfThenElse : false, 
			convergedState: null 
		};



		
	}

	return defaultResult;
}

function isIfThen(state, graph){

  const defaultResult = { 
		hasIfThen : false, 
		ifThenType : null, 
		convergedState: null 
	};
	
	const { hasTransitions, transitions } = getStateTransitions(state, graph);

	if(!hasTransitions || transitions.length != 2){
		return defaultResult;
	}

	const convergedState = findConvergence(state, graph);

	if(convergedState){
		defaultResult['hasIfThen'] = true;
		defaultResult['ifThenType'] = convergedState == transitions[0] ? structs.B_CONVERGES_TO_A : structs.A_CONVERGES_TO_B;
		defaultResult['convergedState'] = convergedState == transitions[0] ? transitions[0] : transitions[1];
	}

	return defaultResult;


}

function isIfThenElse(state, graph){

  const defaultResult = { 
    hasIfThenElse : false, 
    convergedState: null 
  };
	
	const { hasTransitions, transitions } = getStateTransitions(state, graph);

	if(!hasTransitions || transitions.length != 2){
		return defaultResult;
	}

	const { transitions } = getStateTransitions(state, graph);
	const successorsA = graph.$(toId(transitions[0])).successors().edges();
	const successorsB = graph.$(toId(transitions[1])).successors().edges();

	const diff = successorsA.diff(successorsB);
	const lastEdgeA = diff.left.slice(-1).map((n) => n.target().map(getEleId)[0]);
	const lastEdgeB = diff.right.slice(-1).map((n) => n.target().map(getEleId)[0]);

	if(lastEdgeA[0] == lastEdgeB[0]){
		defaultResult['hasSimpleIfThenElse'] = true;
		defaultResult['convergedState'] = lastEdgeA[0];
	}
	
  return defaultResult;

}

function isBreakOrContinue(state, graph){

	let defaultResult = {
    hasBreakOrContinue : false, 
    breakOrContinueType : null
  };
	

  const hasLoop = isInsideLoop(state, graph);
	if(!hasLoop){
		return defaultResult;
	}

  const sourcesToState =  getSourcesToState(state, graph);
  const { transitions } = getStateTransitions(state, graph);

  const transitionAtoB = getShortestPath(transitions[0], transitions[1], graph);
  const transitionBtoA = getShortestPath(transitions[1], transitions[0], graph);
  const shortestPaths = getAllShortestsPaths(transitions, [sourcesToState[0]], graph);

  const beforePath = shortestPaths[Object.keys(shortestPaths)[0]];
  const diff = beforePath[transitions[0]].diff(beforePath[transitions[1]]);

	const getFirstSource = (n) => n.source().map(getEleId)[0];
	const firstStateFromBoth = (diff) => diff.both.map(getFirstSource)[0];
	const firstStateFromLeft = (diff) => diff.left.map(getFirstSource)[0];
	const firstStateFromRight = (diff) => diff.right.map(getFirstSource)[0];
		


  if(!diff.both.length && !diff.right.length && !diff.left.length){
		/*
		 We have an if then or if then else that eventually leads to a break, and then it 
		 never loops back to reach our state, because we don't have another loop to 
		 allows to go backwards.
		 */
    return defaultResult;

	}else if(!diff.both.length){
		/*
		 We might have the instance where one states breaks away from a WhileLoop or a DoWhileLoop
		 but it never loops back to our source state because there isn't a loop to loop back.
		 */
		console.log("both:", diff.both.map(getEleId));
		console.log("left:", diff.left.map(getEleId));
		console.log("right:", diff.right.map(getEleId));
		console.log("We don't know why we are here");
	
		const nonEmptySide = diff.left.length ? transitions[0] : transitions[1];
		const nonEmpty = diff.left.length ? firstStateFromLeft(diff) : firstStateFromRight(diff);
		console.log("nonEmpty:", nonEmpty);
		console.log("nonEmptySide:", nonEmptySide);

		var { hasWhileLoop, loopState, nonLoopState } = isWhileLoop(nonEmpty, graph);


		if(hasWhileLoop){
			if(nonEmpty == nonLoopState){ 
				defaultResult['hasBreakOrContinue'] = true;
				defaultResult['breakOrContinue'] = nonEmpty == transitions[0] ? structs.CONTINUE_A_PROCEED_B : structs.CONTINUE_B_PROCEED_A;
				return defaultResult;
			}
		}
		
		var { hasDoWhileLoop, loopState, nonLoopState } = isWhileLoop(nonEmpty, graph);

		if(hasDoWhileLoop){
			defaultResult['hasBreakOrContinue'] = true;
			defaultResult['breakOrContinue'] = nonEmpty == transitions[0] ? structs.CONTINUE_A_BREAK_B : structs.CONTINUE_B_BREAK_A;
			return defaultResult;
		}




			/*
			 Okay now let's check for either of the transitions to be a break from a Loop.
			 To do this we need to check if either of these transitions have more than source.
			 If they do then it must be the nonLoopingState from a loop.
			 */
			const empty = nonEmpty == transitions[1] ? transitions[0] : transitions[1];
			const hasMoreSources = graph.$(`[target = "${empty}"]`).sources().map(getEleId);
			console.log("hasMoreSources:", hasMoreSources);

		const empty = nonEmpty == transitions[1] ? transitions[0] : transitions[1];
		console.log("empty:", empty);
		return defaultResult;

	}else if(diff.left.length && diff.right.length){
		/*
		 Here we basically have a continue but not right away, some where in the next states.
		 Because we have one or more extra state appear on the right or left, plus the other
		 (right or left) has their own unique states.


		 Or we might have an instance where there is a break rigth away of a WhileLoop but
		 we won't be able to identify it unless we check the first edge from the both map
		 to see if one of it's targets is the first edge from one of our sides(left or right)

		 */
		
		
		const { hasWhileLoop, loopState, nonLoopState } = isWhileLoop(firstStateFromBoth(diff), graph);

		//Basically if the first source from the first edge from left or right match 
		//the non looping state from our matched WhileLoop then we have a break
		//

		if(hasWhileLoop){

			const isLeftBreak = firstStateFromLeft(diff) == nonLoopState;
			const isRightBreak = firstStateFromRight(diff) == nonLoopState;
			
			if(firstStateFromLeft(diff) == nonLoopState){ 
				defaultResult['hasBreakOrContinue'] = true;
				defaultResult['breakOrContinue'] = structs.BREAK_A_PROCEED_B;

			}
			if(firstStateFromRight(diff) == nonLoopState){
				defaultResult['hasBreakOrContinue'] = true;
				defaultResult['breakOrContinue'] = structs.BREAK_B_PROCEED_A;

			}
		}

		return defaultResult;



  }else if(diff.right.length || diff.left.length){
		/*
		 We have either the end of a DoWhileLoop(break & continue) or we have a continue from
		 a normal WhileLoop. One of the states loops right back to the beginning of our loop
		 so when the other states loops back to the beginning of the loop, one of the states
		 either left or right is empty, meaning they don't have any other unique states that the
		 other state has due to the looping to the beginning of the loop right away.
		 */
		

		const { hasDoWhileLoop } = isDoWhileLoop(firstStateFromBoth(diff), graph);
		const { hasWhileLoop } = isWhileLoop(firstStateFromBoth(diff), graph);

		if(hasDoWhileLoop){

			defaultResult['hasBreakOrContinue'] = true;
			defaultResult['breakOrContinueType'] = diff.right.length ? structs.CONTINUE_A_BREAK_B : structs.CONTINUE_B_BREAK_A;
		}else if(hasWhileLoop){
			defaultResult['hasBreakOrContinue'] = true;
			defaultResult['breakOrContinueType'] = diff.right.length ? structs.CONTINUE_A_PROCEED_B : structs.CONTINUE_B_PROCEED_A;
		}

	}

  return defaultResult;
}

function isDoWhileLoop(state, graph){

  let defaultResult = {
    hasDoWhileLoop : false, 
    doWhileType : null, 
    endLoopState : null, 
    loopState: null, 
    nonLoopState: null
  };

  const { hasTransitions, transitions } = getStateTransitions(state, graph);
	const hasLoop = isInsideLoop(state, graph);

  if(!hasTransitions || !hasLoop){
    return defaultResult;
  }

  const endStates = getEndStates(graph);
  const sourcesToState =  getSourcesToState(state, graph);

  for(let st in sourcesToState){
    const hasParent = graph.$(`[target = "${sourcesToState[st]}"]`).edges();

    if(hasParent.size() > 0){

      const edgeId =  hasParent.map((n) => n.id());
      const removedState = graph.$(`[id = "${edgeId}"]`).remove();
      const maybeNeeded = graph.$(toId(state)).successors().nodes();
      const isNeeded = maybeNeeded.some((n) => endStates.map(getEleId).includes(n.id())) ? false : true;
      removedState.restore();

      if(isNeeded){

        const endLoopState = hasParent.map((n) => n.target().map(getEleId)[0]);

        defaultResult['hasDoWhileLoop'] = true;
        defaultResult['endLoopState'] = endLoopState[0];

        if(transitions.length == 2){

          defaultResult['doWhileType'] = structs.WHILE_LOOP_INSIDE_DO_WHILE_LOOP;
          const transitionAtoNeeded = getShortestPath(transitions[0],endLoopState[0], graph);
          const transitionBtoNeeded = getShortestPath(transitions[1],endLoopState[0], graph);

          const transitionACrossesB = transitionAtoNeeded.some((n) => n.target().map(getEleId)[0] == transitions[1]);
          const transitionBCrossesA = transitionBtoNeeded.some((n) => n.target().map(getEleId)[0] == transitions[0]);

          if(transitionACrossesB){
            defaultResult['loopState'] = transitions[1];
            defaultResult['nonLoopState'] = transitions[0];
          }
					
          if(transitionACrossesB){
            defaultResult['loopState'] = transitions[0];
            defaultResult['nonLoopState'] = transitions[1];
          }

        }else{
          defaultResult['doWhileType'] = structs.DO_WHILE_LOOP;
        }
      }
    }
  }

  return defaultResult;

}

function isWhileLoop(state, graph){
	
  const defaultResult = {
    hasWhileLoop : false, 
    loopState: null, 
    nonLoopState: null
  };

  const { hasTransitions, transitions } = getStateTransitions(state, graph);
  const hasLoop = isInsideLoop(state, graph);

  const { hasDoWhileLoop } = isDoWhileLoop(state, graph);
  if(!hasTransitions || !hasLoop || hasDoWhileLoop){
    return defaultResult;
  }

  const successorsA = graph.$(toId(transitions[0])).successors().edges();
  const successorsB = graph.$(toId(transitions[1])).successors().edges();
  const diff = successorsA.diff(successorsB);
	
  if(diff.right.size() == 0 && diff.left.size() == 0){
    /*
		 We are inside another loop, so now let's find the shortest path
		 for each transition to all of the source states.And if any of
		 the transitions has to go through our state to get to any source state
		 but the other transition didn't on that same source state, then we have a WhileLoop.
		 */
		
    const symDiff = getSymDiffOnAllDirectPaths(state, graph);
    if(symDiff.length == 0){
      /*
			 This is not a WhileLoop is most likely an if then or if then else inside a loop
			 */
      return defaultResult;
    }

    const endStates = getEndStates(graph);
    const removedState = graph.$(`[id = "${state}->${transitions[0]}"]`).remove();
    const maybeNeeded = graph.$(toId(state)).successors().nodes();
    const isNeeded = maybeNeeded.some((n) => endStates.map(getEleId).includes(n.id())) ? false : true;
    removedState.restore();
		
    const loopState = isNeeded ? transitions[1] : transitions[0];
    const nonLoopState = isNeeded ? transitions[0] : transitions[1];
		
    defaultResult['hasWhileLoop'] = true;
    defaultResult['loopState'] = loopState;
    defaultResult['nonLoopState'] = nonLoopState;

  }else if(diff.right.size() == 0 || diff.left.size() == 0){

		const hasMoreTargets = doTransitionsHaveMultipleTargets(transitions, graph);

		if(hasMoreTargets){
			return defaultResult;
		}

		const getFirstSource = (n) => n.source().map(getEleId)[0];
		const nonEmpty = diff.right.size() == 0 ? diff.left.map(getFirstSource)[0] : diff.right.map(getFirstSource)[0];

		const { hasDoWhileLoop } = isDoWhileLoop(nonEmpty, graph);
		if(hasDoWhileLoop){
			return defaultResult;
		}

    const loopState = diff.right.size() == 0 ? transitions[0] : transitions[1];
    const nonLoopState = diff.right.size() == 0 ? transitions[1] : transitions[0];

    defaultResult['hasWhileLoop'] = true;
    defaultResult['loopState'] = loopState;
    defaultResult['nonLoopState'] = nonLoopState;


  }

  return defaultResult;
	

}


class Evaluator{


  constructor(graph){
    this.graph = graph || cytoscape();
  }
	
  interpret(state){

    if(isInfiniteLoop(state, this.graph)){
      return { struct : structs.INFINITE_LOOP, meta : {} };
    }

    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);

    if(!hasTransitions) {
			console.log("wtf:", state, "hasTransitions", hasTransitions);
      return { struct : structs.END_STATE, meta : {} };
    }

		if(transitions[0] == transitions[1]){
			return { struct : structs.SAME_TRANSITION, meta : {}};
		}

    const hasLoop = isInsideLoop(state, this.graph);

    if(transitions.length == 2 && !hasLoop){


			var { 
				hasSimpleIfThen, 
				ifThenType, 
				convergedState 
			} = isSimpleIfThen(state, this.graph);

			if(hasSimpleIfThen){
				return { struct : ifThenType, meta : { convergedState } };
			}


			var { 
				hasSimpleIfThenElse, 
				convergedState 
			} = isSimpleIfThenElse(state, this.graph);

			if(hasSimpleIfThenElse){
				return { struct : structs.A_B_CONVERGES, meta : { convergedState } };
			}


    }else if(hasTransitions && hasLoop){

			var { 
				hasDoWhileLoop, 
				doWhileType, 
				endLoopState, 
				loopState, 
				nonLoopState
			} = isDoWhileLoop(state, this.graph); 

			if(hasDoWhileLoop){
				return { struct : doWhileType, meta : { endLoopState, loopState, nonLoopState } };
			}

			var { 
				hasWhileLoop, 
				loopState, 
				nonLoopState
			} = isWhileLoop(state, this.graph); 

			if(hasWhileLoop){
				return { struct : structs.WHILE_LOOP, meta : { loopState, nonLoopState } };
			}
			
			var { 
				hasBreakOrContinue,
				breakOrContinueType
			} = isBreakOrContinue(state, this.graph); 

			if(hasBreakOrContinue){
				return { struct : breakOrContinueType, meta : { } };
			}



			var { 
				hasIfThen,
				ifThenType,
				convergedState
			} = isIfThen(state, this.graph); 

			if(hasIfThen){
				return { struct : ifThenType, meta : { convergedState } };
			}

			var { 
				hasIfThenElse,
				ifThenElseType,
				convergedState
			} = isIfThenElse(state, this.graph); 

			if(hasIfThenElse){
				return { struct : ifThenElseType, meta : { convergedState } };
			}


    }	
		
    return { struct : structs.UNKNOWN, meta : {} };
  }

};


module.exports = {
  Evaluator,
  structs
};


