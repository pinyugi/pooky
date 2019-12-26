import * as t from "@babel/types";

export const structs = {
  UNKNOWN: 0,
  INFINITE_LOOP: 1,
  SIMPLE: 2,
  IF_THEN_ELSE: 4,
  WHILE_LOOP: 8,
  DO_WHILE_LOOP: 16,
  END_STATE: 32,
  SAME_TRANSITION: 64,
  END_OF_IF_BODY: 128,
  END_OF_DO_WHILE: 256,
};

export class Struct {
  constructor(opts) {
    this.state = parseInt(opts.state, 10);
    this.states = opts.states;
    this.statistics = opts.statistics;
    this.history = opts.history;
    this.traverser = opts.traverser;
  }
  simplify() {
    throw Error("Need to Implement!");
  }

  previousSeenInHistory(states) {
    return states.filter((s) => this.history.indexOf(s) >= 0);
  }

  getStateTransitions() {
    const transition = this.states[this.state]["transition"];
    if (transition === null) {
      return [];
    }

    return transition.states;
  }

  getResultFromEvaluator() {
    return this.states[this.state]["result"];
  }

  getStateNodes() {
    return [...this.states[this.state]["nodes"]];
  }

  getStateMeta() {
    return this.states[this.state]["meta"];
  }

  getStates() {
    return this.states;
  }

  getTestExpression() {
    return this.states[this.state]["transition"]["test"];
  }

  getEndStates() {
    return this.states["endStates"];
  }

  getStructData() {
    return {
      states: this.getStates(),
      transitions: this.getStateTransitions(),
      result: this.getResultFromEvaluator(),
      nodes: this.getStateNodes(),
      endStates: this.getEndStates(),
    };
  }

  getNextStruct() {
    const { states, state, nodes, result } = this.traverser.getNextStruct({
      states: this.states,
      statistics: this.statistics,
      history: this.history,
    });

    return {
      states,
      state,
      nodes,
      result,
    };
  }

  traverseStates() {
    const nodez = [];
    let getNextStruct = true;

    do {
      const { nodes, result } = this.getNextStruct();

      if (nodes) {
        nodez.push(...nodes);
      }

      if (result == structs.END_OF_IF_BODY) {
        getNextStruct = false;
        this.traverser.currentState = 0;
      }

      if (result == structs.END_STATE) {
        getNextStruct = false;
      }
    } while (getNextStruct);

    return nodez;
  }

  getLoopStates(callback, loopType) {
    const results = [];
    let states = null;

    switch (loopType) {
      case structs.WHILE_LOOP:
        states = this.states["whileStates"];
        break;
      case structs.DO_WHILE_LOOP:
        states = this.states["doWhileStates"];
        break;
      default:
        throw Error("Wrong loop type:", loopType);
    }
    states.forEach((meta) => results.push(callback(meta)));

    return results;
  }

  getEndOfDoWhile(state) {
    return this.getLoopStates((meta) => meta["doWhileEndStates"][state]["nonLoopState"], structs.DO_WHILE_LOOP).filter(
      (x) => x !== undefined
    );
  }

  isContinueLoop(state) {
    return this.getLoopStates((meta) => meta["whileStart"] == state, structs.WHILE_LOOP).some((x) => x);
  }

  isBreakLoop(state) {
    return this.getLoopStates((meta) => meta["whileNonLoopState"] == state, structs.WHILE_LOOP).some((x) => x);
  }

  isEndOfDoWhile(state) {
    return this.getLoopStates((meta) => meta["doWhileEndStates"], structs.DO_WHILE_LOOP).filter((x) => x !== undefined)
      .length;
  }
}

export class SimpleStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const { states, transitions, result, nodes, endStates } = this.getStructData();
    let finalResult = result;
    this.history.push(this.state);

    //console.log("this.history:", this.history, "before state:", this.state);
    //this.traverser.currentState = transitions[0];

    if (this.isContinueLoop(transitions[0])) {
      nodes.push(t.continueStatement());
      finalResult = structs.END_OF_IF_BODY;
    } else if (this.isBreakLoop(transitions[0])) {
      nodes.push(t.breakStatement());
      finalResult = structs.END_OF_IF_BODY;
    } else if (endStates.includes(transitions[0])) {
      this.traverser.currentState = transitions[0];
    } else {
      //console.log("state:", this.state, this.history, "transitions[0]", transitions[0], "finalRestul:", finalResult);
      this.traverser.currentState = transitions[0];
    }

    return {
      states,
      state: this.state,
      nodes,
      result: finalResult,
    };
  }
}

export class IfThenElseStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const ifThenElseNode = [];

    const { states, transitions, result, nodes } = this.getStructData();
    let finalResult = result;
    this.history.push(this.state);

    const transitionNodes = {
      [0]: [],
      [1]: [],
    };

    if (this.isEndOfDoWhile(this.state)) {
      ifThenElseNode.push(...nodes, this.getTestExpression());

      this.traverser.currentState = this.getEndOfDoWhile(this.state);

      return {
        states,
        state: this.state,
        nodes: ifThenElseNode,
        result: structs.END_OF_DO_WHILE,
      };
    }

    for (let i = 0; i < 2; i++) {
      if (this.isContinueLoop(transitions[i])) {
        transitionNodes[i].push(t.continueStatement());
      } else if (this.isBreakLoop(transitions[i])) {
        transitionNodes[i].push(t.breakStatement());
      } else {
        this.traverser.currentState = transitions[i];
        const nodez = this.traverseStates();
        transitionNodes[i].push(...nodez);
      }
    }

    ifThenElseNode.push(
      ...nodes,
      t.ifStatement(
        this.getTestExpression(),
        t.blockStatement(transitionNodes[0]),
        t.blockStatement(transitionNodes[1])
      )
    );
    const lastStateVisited = this.history.slice(-1);

    if (lastStateVisited == this.traverser.currentState) {
      finalResult = structs.END_OF_IF_BODY;
      this.traverser.currentState = 0;
    }

    return {
      states,
      state: this.state,
      nodes: ifThenElseNode,
      result: finalResult,
    };
  }
}

export class WhileStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const whileNode = [];
    const whileBodyNodes = [];
    const { states, result, nodes } = this.getStructData();

    const testNode = this.getTestExpression();
    const whileStart = states[this.state]["meta"]["whileStart"];
    const whileNonLoopState = states[this.state]["meta"]["whileNonLoopState"];
    const whileLoopState = states[this.state]["meta"]["whileLoopState"];

    states["whileStates"].push(states[this.state]["meta"]);
    this.history.push(this.state);
    this.traverser.currentState = whileLoopState;

    let keepLooping = true;
    while (keepLooping) {
      const { nodes: nodez, result: loopResult } = this.getNextStruct();
      whileBodyNodes.push(...nodez);

      if (
        loopResult == structs.END_OF_IF_BODY ||
        this.traverser.currentState == 0 ||
        this.traverser.currentState == whileStart
      ) {
        //console.log("loopResult:", loopResult, "this.traverser.currentState", this.traverser.currentState);
        keepLooping = false;
      }
    }

    whileNode.push(...nodes, t.whileStatement(testNode, t.blockStatement(whileBodyNodes)));
    this.traverser.currentState = whileNonLoopState;

    states["whileStates"].pop();

    return {
      states,
      state: this.state,
      nodes: whileNode,
      result,
    };
  }
}

export class DoWhileStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const doWhileNode = [];
    const doWhileBodyNodes = [];
    let doWhileTestNode = null;
    const { states, transitions, result, nodes } = this.getStructData();

    this.history.push(this.state);
    states["doWhileStates"].push(states[this.state]["meta"]);

    this.traverser.currentState = transitions[0];
    doWhileBodyNodes.push(...nodes);

    let keepLooping = true;
    while (keepLooping) {
      const { nodes: nodez, result: loopResult } = this.getNextStruct();

      if (loopResult == structs.END_OF_DO_WHILE) {
        keepLooping = false;
        doWhileTestNode = nodez.pop();
        doWhileBodyNodes.push(...nodez);
      } else {
        doWhileBodyNodes.push(...nodez);
      }
    }

    doWhileNode.push(t.doWhileStatement(doWhileTestNode, t.blockStatement(doWhileBodyNodes)));
    states["doWhileStates"].pop();

    return {
      states,
      state: this.state,
      nodes: doWhileNode,
      result,
    };
  }
}

export class SameTransitionStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const { states, transitions, result, nodes } = this.getStructData();

    this.history.push(this.state);
    this.traverser.currentState = transitions[1] == this.state ? transitions[0] : transitions[1];

    return {
      states,
      state: this.state,
      nodes,
      result,
    };
  }
}

export class EndStateStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const { states, result, nodes } = this.getStructData();
    this.history.push(this.state);

    return {
      states,
      state: this.state,
      nodes,
      result,
    };
  }
}

