const { 
  structs, 
  checkMode
} = require("./constants.js");

const loopFound = {
  NONE : 0,
  WHILE_LOOP : 1,
  WHILE_LOOP_DO_WHILE_LOOP : 2
};


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


function getSymDiffOnAllDirectPaths(state, graph){

  const { transitions } = getStateTransitions(state, graph);
  const sourcesToState = getSourcesToState(state, graph);
  const shortestPaths = getAllShortestsPaths(transitions, sourcesToState, graph);
  const directPaths = {};
  directPaths[transitions[0]] = [];
  directPaths[transitions[1]] = [];

  const noDirectPath = (n) => n.target().map(getEleId)[0] == state;
  console.log("state:", state);
  for(let st in shortestPaths){
    for(let tr in shortestPaths[st]){
      !shortestPaths[st][tr].some(noDirectPath) ? directPaths[tr].push(st) : "";
    }
  }

  const t1 = directPaths[transitions[0]];
  const t2 = directPaths[transitions[1]];

  console.log("directPaths:", directPaths);
  return t1.filter(x => !t2.includes(x)).concat(t2.filter(x => !t1.includes(x)));


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

  const { hasTransitions, transitions } = getStateInfo(state, graph);

  if(hasTransitions) return false;
  return !isDoWhileLoop(state, graph);


}

function isSimpleIfThen(state, graph){
  return { hasSimpleIfThen : false, convergedState : null };
}

function isSimpleIfThenElse(state, graph){
  return { hasSimpleIfThenElse : false, convergedState : null };
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

  if(!hasTransitions){
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
          defaultResult['doWhileType'] = structs.DO_WHILE_TYPE;
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
    const loopState = diff.right.size() == 0 ? transitions[0] : transitions[1];
    const nonLoopState = diff.right.size() == 0 ? transitions[1] : transitions[0];

    defaultResult['hasWhileLoop'] = true;
    defaultResult['loopState'] = loopState;
    defaultResult['nonLoopState'] = nonLoopState;


  }

  return defaultResult;
	

}

function isIfThen(state, graph){
  return { hasIfThen : false, convergedState: null };

}

function isIfThenElse(state, graph){

  const defaultResult = { 
    hasIfThenElse : false, 
    convergedState: null 
  };

  const sourcesToState =  getSourcesToState(state, graph);
  const { transitions } = getStateTransitions(state, graph);

  const transitionAtoB = getShortestPath(transitions[0], transitions[1], graph);
  const transitionBtoA = getShortestPath(transitions[1], transitions[0], graph);
  const shortestPaths = getAllShortestsPaths(transitions, [sourcesToState[0]], graph);

  const beforePath = shortestPaths[Object.keys(shortestPaths)[0]];

  console.log("transitionAtoB:", transitionAtoB.map(getEleId));
  console.log("transitionBtoA:", transitionBtoA.map(getEleId));

  const diff = beforePath[transitions[0]].diff(beforePath[transitions[1]]);

  if(!diff.both.length && !diff.right.length && !diff.left.length){
    return defaultResult;
  }

  if(!diff.both.length){
    //const nonEmpty = !diff.right.length ? diff.left : diff.right;

    //console.log("noneeeempty:", nonEmpty[0]);
    //console.log("nonEmpty:", nonEmpty[0].map(getEleId));
		


  }
  console.log("both:", diff.both.map(getEleId));
  console.log("left:", diff.left.map(getEleId));
  console.log("right:", diff.right.map(getEleId));



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
      return { struct : structs.END_STATE, meta : {} };
    }

    const hasLoop = isInsideLoop(state, this.graph);

    if(hasTransitions.length == 2 && !hasLoop){

      a : {

        const { hasSimpleIfThen, convergedState } = isSimpleIfThen(state, this.graph);

        if(hasSimpleIfThen){
          return { struct : structs.IF_THEN, meta : { convergedState } };
        }
      }

      a : {

        const { hasSimpleIfThenElse, convergedState } = isSimpleIfThenElse(state, this.graph);

        if(hasSimpleIfThenElse){
          return { struct : structs.IF_THEN_ELSE, meta : { convergedState } };
        }
      }


    }else if(hasTransitions && hasLoop){

      a : {
        const { 
          hasDoWhileLoop, 
          doWhileType, 
          endLoopState, 
          loopState, 
          nonLoopState
        } = isDoWhileLoop(state, this.graph); 

        if(hasDoWhileLoop){
          return { struct : doWhileType, meta : { endLoopState, loopState, nonLoopState } };
        }
      }

      a : {
        const { 
          hasWhileLoop, 
          loopState, 
          nonLoopState
        } = isWhileLoop(state, this.graph); 

        if(hasWhileLoop){
          return { struct : structs.WHILE_LOOP, meta : { loopState, nonLoopState } };
        }
      }

      a : {
        const { 
          hasIfThen,
          convergedState
        } = isIfThen(state, this.graph); 

        if(hasIfThen){
          return { struct : structs.IF_THEN, meta : { convergedState } };
        }
      }

      a : {
        const { 
          hasIfThenElse,
          hasIfThenElseType,
          convergedState
        } = isIfThenElse(state, this.graph); 

        if(hasIfThenElse){
          return { struct : hasIfThenElseType, meta : { convergedState } };
        }

      }

    }	
		
    return { struct : structs.UNKNOWN, meta : {} };
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

