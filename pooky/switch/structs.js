const t = require("@babel/types");

const structs = {
  UNKNOWN: 0,
  INFINITE_LOOP: 1,
  SIMPLE: 2,
  IF_THEN_ELSE: 4,
  WHILE_LOOP: 8,
  DO_WHILE_LOOP: 16,
  END_STATE: 32,
  SAME_TRANSITION: 64,
  END_OF_IF_BODY: 128,
};

class Struct {
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
      const { states, state, nodes, result } = this.getNextStruct();

      if (nodes) {
        nodez.push(...nodes);
      }

      if (result == structs.END_OF_IF_BODY) {
        //console.log("loopResult CONTINUE THE LOOP:", state, "this.traverser.currentState:", this.traverser.currentState);
        getNextStruct = false;
        this.traverser.currentState = 0;
      }

      if (result == structs.END_STATE) {
        getNextStruct = false;
      }
    } while (getNextStruct);

    return nodez;
  }

  getPreviousSeenStructs(callback, structType) {
    const results = [];
    for (let prevState of this.history) {
      const result = this.states[prevState]["result"];
      const meta = this.states[prevState]["meta"];

      if (result & structType) {
        results.push(callback(prevState, meta));
      }
    }

    return results;
  }

  isContinueLoop(state) {
    return this.getPreviousSeenStructs((prevState, meta) => prevState == state, structs.WHILE_LOOP).some((x) => x);
  }

  isBreakLoop(state) {
    return this.getPreviousSeenStructs(
      (prevState, meta) => meta["whileNonLoopState"] == state,
      structs.WHILE_LOOP
    ).some((x) => x);
  }

  isEndOfDoWhile(state) {
    const doWhileEndStates = this.getPreviousSeenStructs(
      (prevState, meta) => meta["doWhileEndStates"],
      structs.WHILE_LOOP
    ).filter((x) => x !== undefined);
  }
}

class SimpleStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const { states, transitions, result, nodes, endStates } = this.getStructData();
    let finalResult = result;
    this.history.push(this.state);

    //this.traverser.currentState = transitions[0];

    if (this.isContinueLoop(transitions[0])) {
      //console.log("Continue the loop:", this.state);

      nodes.push(t.expressionStatement(t.stringLiteral("simple continueLoop")));
      nodes.push(t.continueStatement());
      finalResult = structs.END_OF_IF_BODY;
    } else if (this.isBreakLoop(transitions[0])) {
      //console.log("Breaking out of the loop:", this.state);
      nodes.push(t.expressionStatement(t.stringLiteral("simple breakLoop")));
      nodes.push(t.breakStatement());
      finalResult = structs.END_OF_IF_BODY;
    } else if (endStates.includes(transitions[0])) {
      //finalResult = structs.END_STATE;

      this.traverser.currentState = transitions[0];
    } else {
      this.traverser.currentState = transitions[0];
    }

    return {
      states,
      state: this.state,
      nodes,
      result: finalResult,
    };
    //return { states, state: this.state, nodes, result: result};
  }
}

class IfThenElseStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    let ifThenElseNode = [];

    const { states, transitions, result, nodes, endStates } = this.getStructData();
    this.history.push(this.state);

    const transitionNodes = {
      [0]: [],
      [1]: [],
    };

    //console.log("IfThen :", this.state);
    for (let i = 0; i < 2; i++) {
      if (this.isContinueLoop(transitions[i])) {
        transitionNodes[i].push(t.expressionStatement(t.stringLiteral("if then else continueLoop")));
        transitionNodes[i].push(t.continueStatement());
      } else if (this.isBreakLoop(transitions[i])) {
        transitionNodes[i].push(t.expressionStatement(t.stringLiteral(`history:${this.history}`)));
        transitionNodes[i].push(
          t.expressionStatement(
            t.stringLiteral(`if then else breakLoop transition ${transitions[i]} current state: ${this.state}`)
          )
        );
        transitionNodes[i].push(t.breakStatement());
      } else {
        this.traverser.currentState = transitions[i];
        const nodez = this.traverseStates();
        //console.log("DONE TRAVERSING:", transitions[i]); q
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

    return {
      states,
      state: this.state,
      nodes: ifThenElseNode,
      result,
    };
  }
}

class WhileStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    let whileNode = [];
    const whileBodyNodes = [];
    const { states, transitions, result, nodes, endStates } = this.getStructData();

    const testNode = this.getTestExpression();
    const whileStart = states[this.state]["meta"]["whileStart"];
    const whileNonLoopState = states[this.state]["meta"]["whileNonLoopState"];
    const whileLoopState = states[this.state]["meta"]["whileLoopState"];

    //console.log("While:", this.state, "history:", this.history);
    this.history.push(this.state);
    this.traverser.currentState = whileLoopState;

    let keepLooping = true;
    while (keepLooping) {
      const { nodes: nodez, result: loopResult } = this.getNextStruct();
      whileBodyNodes.push(...nodez);

      if (loopResult == structs.END_OF_IF_BODY) {
        keepLooping = false;
      }

      if (this.traverser.currentState == 0) {
        keepLooping = false;
      }

      if (this.traverser.currentState != whileStart) {
        keepLooping = false;
      }
    }

    whileNode.push(...nodes, t.whileStatement(testNode, t.blockStatement(whileBodyNodes)));

    this.traverser.currentState = whileNonLoopState;

    return {
      states,
      state: this.state,
      nodes: whileNode,
      result,
    };
  }
}

class DoWhileStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    let doWhileNode = [];
    const { states, transitions, result, nodes, endStates } = this.getStructData();

    return {
      states,
      state: this.state,
      nodes: doWhileNode,
      result,
    };
  }
}

class SameTransitionStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const { states, transitions, result, nodes, endStates } = this.getStructData();

    this.history.push(this.state);

    return {
      states,
      state: this.state,
      nodes,
      result,
    };
  }
}

class EndStateStruct extends Struct {
  constructor(opts) {
    super(opts);
  }

  simplify() {
    const { states, transitions, result, nodes, endStates } = this.getStructData();
    this.history.push(this.state);
    //console.log("Should be ending here:", result, "state:", this.state);

    return {
      states,
      state: this.state,
      nodes,
      result,
    };
  }
}

module.exports = {
  SimpleStruct,
  EndStateStruct,
  IfThenElseStruct,
  WhileStruct,
  DoWhileStruct,
  SameTransitionStruct,
  structs,
};
