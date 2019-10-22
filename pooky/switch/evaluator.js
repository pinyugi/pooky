

function getEleId(node){
  return node.id();

}

function getNodeData(graph, state){
  const stateId = toId(state);
  const data = graph.$(stateId).map(function(n){ return n.data()});

  return data.length ? data[0] : false
}


function toId(state){
  return `#${state}`;
}


function edgeId(fromState, toState){
  return `#${fromState}->${toState}`;
}



class Evaluator{
  constructor(graph){
    this.G = graph instanceof Graph ? graph : new Graph();
  }


  isSuccessorAndPredecessor(state){
    const { id } = this.stateInfo(state);

    const successors = this.G.graph.$(id).successors().nodes();
    const predecessors = this.G.graph.$(id).predecessors().nodes();
    const hasOwnState = function(n){ return n.id() == state};

    return successors.some(hasOwnState) && predecessors.some(hasOwnState);

  }


  edgeId(fromState, toState){
    return `#${fromState}->${toState}`;

  }

  findTargetInEges(edges, target, state){

    let index = -1
    let isLast = false;
    edges.map(function(edge, i, edges){

      const targetId = edge.target().map(getEleId)[0];
      const source = edge.source().map(getEleId)[0];

      if(targetId == target && source != state){
        index = i;
        isLast =  i == (edges.size() -1) 
        return;
      }

    })

    return { "index" : index, "isLast" : isLast};


  }

  getTransitionSuccessors(transition){

    return this.G.graph.$(toId(transition)).successors().edges();

  }

  getStateTransitions(state){

    const stateId = toId(state);
    const data = getNodeData(this.G.graph, state)

    let hasTransitions = false;
    let transitions = [];

    if(data['isConditional']){
      transitions = this.G.graph.$(stateId).outgoers().nodes().map(getEleId);
      hasTransitions = true;

    }

    return {
      'hasTransitions' : hasTransitions,
      'transitions' : transitions
    }

  }

  isWhileLoop(state){
    /*

    !this.isIfThen(state) && !this.isIfThenElse(state) && data['isConditional'] 

    */
    /*
    const { data } = this.stateInfo(state);
    return this.isSuccessorAndPredecessor(state) && data['isConditional'];
    */

  }

  isDoWhileLoop(state){
    /*

    !this.isIfThen(state) && !this.isIfThenElse(state) && !data['isConditional']  && has one or more edges that loops back to the state

    */

  }

  isIfThen(state){

    const { hasTransitions, transitions } = this.getStateTransitions(state);

    if(!hasTransitions){
      return false;
    }

    const successorsA = this.getTransitionSuccessors(transitions[0]);
    const successorsB = this.getTransitionSuccessors(transitions[1]);

    const findTransitionBinA = this.findTargetInEges(successorsA, transitions[1], state);
    const findTransitionAinB = this.findTargetInEges(successorsB, transitions[0], state);

    if(findTransitionBinA['index'] == -1 && findTransitionAinB['index'] == -1){
      return false;
    }

    if(findTransitionBinA['index'] != -1 && findTransitionBinA['isLast']){
      return true;
    }else{
      const nextEdge = successorsA[findTransitionBinA['index']+1].map(getEleId)[0];
      const firstEdge = successorsB[0].map(getEleId)[0];
      return nextEdge == firstEdge; 

    }


    if(findTransitionAinB['index'] != -1 && findTransitionAinB['isLast']){
      return true;
    }else{
      const nextEdge = successorsB[findTransitionAinB['index']+1].map(getEleId)[0];
      const firstEdge = successorsA[0].map(getEleId)[0];
      return nextEdge == firstEdge; 
    }


  }

  isIfThenElse(state){

    const { hasTransitions, transitions } = this.getStateTransitions(state);

    if(!hasTransitions){
      return false;
    }

    const successorsA = this.getTransitionSuccessors(transitions[0]);
    const successorsB = this.getTransitionSuccessors(transitions[1]);


  }


};

module.exports = {
  Evaluator
};

const { Graph } = require("./graph.js");
