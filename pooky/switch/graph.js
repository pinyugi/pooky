
const G = {
	
  isMaybeNeeded(edges, state, graph){

    let isNeeded = false;
    const removedStates = [];

    const endStates = G.getEndStates(graph);

    for(edgeId of edges){
      removedStates.push(graph.$(`[id = "${edgeId}"]`).remove());
    }


    const maybeNeeded = graph.$(G.toId(state)).successors().edges();
    const getTarget = (n) => `${n.target().map(G.getEleId)[0]}`;

    isNeeded = !maybeNeeded.some((n) => endStates.map(G.getEleId).includes(getTarget(n)));


    for(removedState of removedStates){
      removedState.restore();
    }
		
    return isNeeded;


  },
	
  getEleId(node){
    return node.id();
	
  },
	
  getNodeData(state, graph){
    const stateId = G.toId(state);
    const data = graph.$(stateId).map((n) => { return n.data();});

    return data.length ? data[0] : false;
  },
	
  toId(state){
    return `#${state}`;
  },

  toEdgeId(state, transition){
    return `${state}->${transition}`;
  },

  getSourceFromEdgeId(edgeId){
    return edgeId.split("->")[0];
  },

  getTargetFromEdgeId(edgeId){
    return edgeId.split("->")[1];
  },

  getEndStates(graph){
    return graph.$().leaves();
  },

  getStateSuccessors(state, graph, element="edges"){
			
    return element == "nodes"
      ? graph.$(G.toId(state)).successors().nodes() 
      : graph.$(G.toId(state)).successors().edges();

  },

  getStateTransitions(state, graph){

    const stateId = G.toId(state);
    const data = G.getNodeData(state, graph);

    let hasTransitions = false;
    let transitions = [];

    transitions = graph.$(stateId).outgoers().nodes().map(G.getEleId);
    hasTransitions = transitions.length != 0 ? true : false;


    return {
      'hasTransitions' : hasTransitions,
      'transitions' : transitions
    };

  },

  getSourcesToState(state, graph){
    const query = `[target = "${state}"]`;
    return graph.$(`[target = "${state}"]`).sources().map(G.getEleId);
  },

  getShortestPath(fromState, toState, graph){

    const dijkstra = graph.elements().dijkstra({ root : G.toId(fromState), directed : true});
    return dijkstra.pathTo(graph.$(G.toId(toState))).edges();
  },

  getDiffOnSuccessorsAndPredecessors(state, graph, mode="edges"){
			
    const predecessors = graph.$(G.toId(state)).predecessors();
    const successors = graph.$(G.toId(state)).successors();
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
  },

  findConvergence(state, graph){

    const { hasTransitions, transitions } = G.getStateTransitions(state, graph);

    if(!hasTransitions || transitions.length != 2){
      return false;
    }

    const targetsToA = graph.$(`[target = "${transitions[0]}"]`).map((n) => n.source().map(G.getEleId)[0]);
    const targetsToB = graph.$(`[target = "${transitions[1]}"]`).map((n) => n.source().map(G.getEleId)[0]);


    if(targetsToA.length > 1 || targetsToB.length > 1){
      return targetsToA.length == 2 ? transitions[0] : transitions[1];
    }

    return false;

  },

  isInsideLoop(state, graph){

    const sourcesToState =  G.getSourcesToState(state, graph);
    let insideLoop = false;

    for(let i = 0; i<sourcesToState.length; i++){

      const { both } = G.getDiffOnSuccessorsAndPredecessors(sourcesToState[i], graph,mode="edges");

      if(both.size() != 0){
        insideLoop = true;
        break;
      }
			
    }
    return insideLoop;

  }

};

module.exports = G;


