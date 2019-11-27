
class Evaluator{


  constructor(graph){
    this.graph = graph || cytoscape();
  }

  getModes(filter){
    const modez = {
      [structs.INFINITE_LOOP] : this.isInfiniteLoop.bind(this),
      [structs.DOES_NOT_CONVERGE] : this.isNotConverging.bind(this),
      [structs.SIMPLE] : this.isSimple.bind(this),
      [structs.IF_THEN] : this.isIfThen.bind(this),
      [structs.IF_THEN_ELSE] : this.isIfThenElse.bind(this),
      [structs.DO_WHILE_LOOP] : this.isDoWhileLoop.bind(this),
      [structs.WHILE_LOOP] : this.isWhileLoop.bind(this),
      [structs.END_STATE] : this.isEndState.bind(this),
      [structs.SAME_TRANSITION] : this.isSameTransition.bind(this)
    };

    return modez;
  }

	cleanMeta(meta){
		Object.keys(meta).forEach((key) => {
			if(_.isString(meta[key])){
				meta[key] = parseInt(meta[key], 10);
			}
    });

		return meta


	}

	
  interpret(state, mode=DEFAULT_MODE){

    let result = 0;
    const meta = {
      "doesNotConverge" : false
    };


    const useModez = this.getModes();

    for(let modez in useModez){
      if(modez & mode){
        const { found, meta : newMeta } = useModez[modez](state);

        if(found){
          result += parseInt(modez);
          Object.assign(meta, this.cleanMeta(newMeta));
        }
      }
    }

    return { result, meta };

  }

  isInfiniteLoop(state){

    const defaultResult = {
      found : false,
      meta : {}
    };

    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);

    if(!hasTransitions || transitions.length == 1){
      return defaultResult;
    }
  
    const endStates = getEndStates(this.graph);
    const successorsA = getStateSuccessors(transitions[0], this.graph, "nodes");
    const successorsB = getStateSuccessors(transitions[1], this.graph, "nodes");

    if(!endStates.anySame(successorsA) && !endStates.anySame(successorsB)){
      defaultResult["found"] = true;
    }

    return defaultResult;

  }

  isNotConverging(state){

    const defaultResult = {
      found : false,
      meta : {}
    };

    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);

    if(!hasTransitions && transitions.length == 1){
      return defaultResult;
    }
    const transitionASources = Array.from(getSourcesToState(transitions[0], this.graph), s => toEdgeId(s, transitions[0]));
    const transitionBSources = Array.from(getSourcesToState(transitions[1], this.graph), s => toEdgeId(s, transitions[1]));

    const isTransitionANeeded = isMaybeNeeded(transitionASources, state, this.graph);
    const isTransitionBNeeded = isMaybeNeeded(transitionBSources, state, this.graph);
    const areBothNotNeeded = (!isTransitionANeeded && !isTransitionBNeeded);

    if(areBothNotNeeded){

			const { found : isIfThenElse } = this.isIfThenElse(state);

			if(!isIfThenElse){
				defaultResult["found"] = true;
				defaultResult["meta"]["doesNotConverge"] = true;
			}

    }

    return defaultResult;


  }

  isSimple(state){
    
    const defaultResult = {
      found : false,
      meta : {}
    };

    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);
    const { found : hasDoWhileLoop } = this.isDoWhileLoop(state);

    if(hasTransitions && !hasDoWhileLoop && transitions.length == 1){
      defaultResult["found"] = true;
    }

    return defaultResult;

  }

  isIfThen(state){

    const defaultResult = { 
      found : false, 
      meta : {
        ifThenConvergedState: null 
      }
    };
    
    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);

    if(!hasTransitions || transitions.length != 2){
      return defaultResult;
    }
		
    const convergedState = findConvergence(state, this.graph);

    if(convergedState){
      defaultResult["found"] = true;
      defaultResult["meta"]["ifThenConvergedState"] = convergedState == transitions[0] ? transitions[0] : transitions[1];
    }

    return defaultResult;

  }

  isIfThenElse(state){

    const defaultResult = { 
      found : false, 
      meta : {
        ifThenElseConvergedState: null 
      }
    };
  
    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);

    if(!hasTransitions || transitions.length != 2){
      return defaultResult;
    }

    const edgeId = (st, t) => `[id = "${st}->${t}"]`;
    const cutTransitionA = this.graph.$(edgeId(state, transitions[0])).remove();
    const cutTransitionB = this.graph.$(edgeId(state, transitions[1])).remove();
    const successorsA = this.graph.$(toId(transitions[0])).successors().edges();
    const successorsB = this.graph.$(toId(transitions[1])).successors().edges();

    const diff = successorsA.diff(successorsB);
		
    if(diff.left.size() && diff.right.size()){
      const lastEdgeA = diff.left.slice(-1).map((n) => n.target().map(getEleId)[0]);
      const lastEdgeB = diff.right.slice(-1).map((n) => n.target().map(getEleId)[0]);

      //Make sure our converged state is not our own state because that will mean it is actually a while loop
      if(lastEdgeA[0] == lastEdgeB[0] && lastEdgeA[0] !== state){
        defaultResult["found"] = true;
        defaultResult["meta"]["ifThenElseConvergedState"] = lastEdgeA[0];
			}
		}

    cutTransitionA.restore();
    cutTransitionB.restore();
  
    return defaultResult;

  }

  isWhileLoop(state){

    const defaultResult = {
      found : false, 
      meta: {
        whileNonLoopState : null,
        whileLoopState : null,
        whileStart : null,
      }
    };

    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);
    const hasLoop = isInsideLoop(state, this.graph);


    if(!hasTransitions || !hasLoop || transitions.length == 1){
      return defaultResult;
    }

    const sourcesToState =  getSourcesToState(state, this.graph);

		if(sourcesToState.length < 2){
			return defaultResult;
		}

    const transitionASources = Array.from(getSourcesToState(transitions[0], this.graph), s => toEdgeId(s, transitions[0]));
    const transitionBSources = Array.from(getSourcesToState(transitions[1], this.graph), s => toEdgeId(s, transitions[1]));
    const isTransitionANeeded = isMaybeNeeded(transitionASources, state, this.graph);
    const isTransitionBNeeded = isMaybeNeeded(transitionBSources, state, this.graph);
    const areBothNotNeeded = (!isTransitionANeeded && !isTransitionBNeeded);

    if(!areBothNotNeeded){
      const neededTransition = isTransitionANeeded ? transitions[0] : transitions[1];
      const notNeededTransition = isTransitionANeeded ? transitions[1] : transitions[0];

      const hasOwnState = (n) => n.target().map(getEleId)[0] == state;
      const hasNeededTransition = (n) => n.target().map(getEleId)[0] == neededTransition;
      const filterDirectOnly = (n) => hasOwnState(n) || hasNeededTransition(n);

      for(let st of sourcesToState){
        const shortestPath = getShortestPath(notNeededTransition, st, this.graph);

        const isDirectPath = !shortestPath.some(filterDirectOnly);

        if(isDirectPath){

          defaultResult["found"] = true;
          defaultResult["meta"]["whileNonLoopState"] = neededTransition;
          defaultResult["meta"]["whileLoopState"] = notNeededTransition;
          defaultResult["meta"]["whileStart"] = state;
          break;
        }
      }
    }else{
      for(let st of sourcesToState){
        for(let tr of transitions){
          if(tr == st){
            defaultResult["found"] = true;
            defaultResult["meta"]["whileNonLoopState"] = tr == transitions[0] ? transitions[1] : transitions[0];
            defaultResult["meta"]["whileLoopState"] = tr;
            defaultResult["meta"]["whileStart"] = state;

            return defaultResult;
          }
          const hasOwnState = (n) => n.target().map(getEleId)[0] == state;
          const hasNeededTransition = (n) => n.target().map(getEleId)[0] == ( tr == transitions[0] ? transitions[1] : transitions[0]);
          const filterDirectOnly = (n) => hasOwnState(n) || hasNeededTransition(n);
          const shortestPath = getShortestPath(tr, st, this.graph);

          const isDirectPath = !shortestPath.some(filterDirectOnly);

          if(isDirectPath && shortestPath.size()){

            defaultResult["found"] = true;
            defaultResult["meta"]["whileNonLoopState"] = tr == transitions[0] ? transitions[1] : transitions[0];
            defaultResult["meta"]["whileLoopState"] = tr;
            defaultResult["meta"]["whileStart"] = state;
            return defaultResult;
          }
        }
      }

    }
    return defaultResult;

  }

  isDoWhileLoop(state){

    let defaultResult = {
      found : false, 
      meta : {
        doWhileEndStates : {},
        doWhileStart : null
      }
    };

    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);
    const hasLoop = isInsideLoop(state, this.graph);

    if(!hasTransitions || !hasLoop){
      return defaultResult;
    }

    const sourcesToState =  getSourcesToState(state, this.graph);

    if(sourcesToState.length == 1){
      return defaultResult;
    }
    for(let st of sourcesToState){
      const sources = this.graph.$(`[source = "${st}"]`).edges();

      if(sources.size() > 1){
        const edgesId =  sources.map((n) => n.id());
        const isNeeded = isMaybeNeeded(edgesId, state, this.graph);

        if(isNeeded){

          defaultResult["found"] = true;

          const sourceTransitionA = getTargetFromEdgeId(edgesId[0]);
          const sourceTransitionB = getTargetFromEdgeId(edgesId[1]);

          const loopState = sourceTransitionA == state ? sourceTransitionA : sourceTransitionB;
          const nonLoopState = loopState == state ? sourceTransitionA : sourceTransitionB;

          defaultResult["meta"]["doWhileEndStates"][st] = { loopState, nonLoopState };
          defaultResult["meta"]["doWhileStart"] = state;

        }
      }
    }

    return defaultResult;

  }

  isEndState(state){

    const defaultResult = {
      found : false,
      meta : {}
    };

    const { hasTransitions } = getStateTransitions(state, this.graph);

    if(!hasTransitions) {
      defaultResult["found"] = true;
    }

    return defaultResult;
  }

  isSameTransition(state){
		
    const defaultResult = {
      found : false,
      meta : {}
    };

    const { hasTransitions, transitions } = getStateTransitions(state, this.graph);
		
    if(!hasTransitions) {
      defaultResult["found"] = false;
    }

    if(transitions.includes(state)){
      defaultResult["found"] = true;
    }

    return defaultResult;

  }


}


const _ = require("lodash");
const { structs } = require("./structs.js");

const {
  isMaybeNeeded,
  getEleId,
  toId,
  toEdgeId,
  getTargetFromEdgeId,
  getEndStates,
  getStateSuccessors,
  getStateTransitions,
  getSourcesToState,
  getShortestPath,
  findConvergence,
  isInsideLoop
} = require("./graph.js");

const DEFAULT_MODE = Object.values(structs).reduce((sum, m) => sum+m);

module.exports = {
  Evaluator,
};



