
const G = {

  getEleId(node){
    return node.id();

  },

  getNodeData(state, graph){
    const stateId = G.toId(state);
    const data = graph.$(stateId).map(function(n){ return n.data()});

    return data.length ? data[0] : false
  },


  toId(state){
    return `#${state}`;
  },


  edgeId(fromState, toState){
    return `#${fromState}->${toState}`;
  },

  findNonLoopingEdges(graph){
    return graph.$().leaves();
  },


  findTargetInEges(edges, target, state){

    let index = -1
    let isLast = false;
    edges.map(function(edge, i, edges){

      const targetId = edge.target().map(G.getEleId)[0];
      const source = edge.source().map(G.getEleId)[0];

      if(targetId == target && source != state){
        index = i;
        isLast =  i == (edges.size() -1) 
        return;
      }

    })

    return { "index" : index, "isLast" : isLast};


  },

  getEndStates(graph){
    return graph.$().leaves();
  },

  getStateSuccessors(graph, transition, element="edges"){
    
    return element == "nodes"
      ? graph.$(G.toId(transition)).successors().nodes() 
      : graph.$(G.toId(transition)).successors().edges();

  },

  getStateTransitions(state, graph){

    const stateId = G.toId(state);
    const data = G.getNodeData(state, graph)

    let hasTransitions = false;
    let transitions = [];

    if(data['isConditional']){
      transitions = graph.$(stateId).outgoers().nodes().map(G.getEleId);
      hasTransitions = true;

    }

    return {
      'hasTransitions' : hasTransitions,
      'transitions' : transitions
    }

  },

  getStateInfo(state, graph){
    
    const { hasTransitions, transitions } = G.getStateTransitions(state, graph);

    let transitionsEdges = [];
    let transitionsNodes = [];

    if(hasTransitions){
      transitionsEdges.push(G.getStateSuccessors(graph, transitions[0], "edges"));
      transitionsEdges.push(G.getStateSuccessors(graph, transitions[1], "edges"));

      transitionsNodes.push(G.getStateSuccessors(graph, transitions[0], "nodes"));
      transitionsNodes.push(G.getStateSuccessors(graph, transitions[1], "nodes"));
    }

    return {
      'hasTransitions' : hasTransitions,
      'transitions': transitions,
      'transitionsEdges' : transitionsEdges,
      'transitionsNodes' : transitionsNodes
    };

  }

};

module.exports = G;


const cytoscape = require('cytoscape');
