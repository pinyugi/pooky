

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

  toId(state){
    return `#${state}`;
  }


  edgeId(fromState, toState){
    return `#${fromState}->${toState}`;

  }

  getTransitionSuccessors(transition){

    const successors = this.G.graph.$(toId(transition)).successors().edges();
    return successors;

  }

  getStateTransitions(state){

    const stateId = toId(state);
    const data = getNodeData(this.G.graph, state)

    let hasTransitions = false;
    let transitions = [];

    if(data['isConditional']){
      transitions = this.G.graph.$(stateId).outgoers().nodes().map(getEleId);

      //transitionA = this.G.graph.$(toId(transitions[0])).outgoers().nodes().map(getEleId)[0];
      //transitionB = this.G.graph.$(toId(transitions[1])).outgoers().nodes().map(getEleId)[0];

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
    const isStruct = false;

    if(!hasTransitions){
      return false;
    }

    const successorsA = this.getTransitionSuccessors(transitions[0]);
    const successorsB = this.getTransitionSuccessors(transitions[1]);

    const firstSuccessorA = successorsA.map(getEleId)[0];
    const firstSuccessorB = successorsB.map(getEleId)[0];

    const transitionAinB = null;
    const transitionBinA = null;

    const allSuccessors = [
      {
        'type' : 'A',
        'successors' : successorsA
      },
      {
        'type' : 'B',
        'successors' : successorsB

      }
    ];

    for(let successor of allSuccessors){
      
    }
    for(var i = 0; i < successorsA.size(); i++){

      const sourceId = edge.source().map(getEleId)[0];
      const targetId = edge.target().map(getEleId)[0];

    }


    successorsA.map(function(edge){
      const sourceId = edge.source().map(getEleId)[0];
      const targetId = edge.target().map(getEleId)[0];

      if(targetId === transitions[1]){
        transitionBinA = edge.source

      }

      console.log(sourceId, ":", targetId);

      //console.log(edge.source());
    })


    //console.log('successors:', true, successorsA, successorsB);



 
  }

  isIfThenElse(state){

    const { data, id } = this.stateInfo(state);

    if(!data['isConditional']){
      return false;

    }

  }


};

module.exports = {
  Evaluator
};

const { Graph } = require("./graph.js");
