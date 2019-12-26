import Evaluator from "./evaluator.js";
import {
  SimpleStruct,
  EndStateStruct,
  IfThenElseStruct,
  WhileStruct,
  DoWhileStruct,
  SameTransitionStruct,
  structs,
} from "./structs.js";

import cytoscape from "cytoscape";

export default class StructTraverser {
  constructor(graph, initialState) {
    this.started = false;
    this.graph = graph || cytoscape();
    this.initialState = initialState;
    this.currentState = null;
    this.evaluator = new Evaluator(this.graph);
    this.structsCounter = {
      [structs.IF_THEN_ELSE]: 0,
      [structs.WHILE_LOOP]: 0,
      [structs.DO_WHILE_LOOP]: 0,
    };
  }

  getNextStruct(opts) {
    const { state, states } = opts;
    const currentState = this.getCurrentState();

    this.started = this.started ? true : true;
    states["whileStates"] = "whileStates" in states ? states["whileStates"] : [];
    states["doWhileStates"] = "doWhileStates" in states ? states["doWhileStates"] : [];
    states["isFirstNode"] = "isFirstNode" in states ? states["isFirstLoop"] : false;

    const structType = states[currentState]["result"];

    switch (structType) {
      case structs.SIMPLE:
        return new SimpleStruct({
          state: currentState,
          traverser: this,
          ...opts,
        }).simplify();

      case structs.IF_THEN_ELSE:
      case structs.IF_THEN_ELSE | structs.INFINITE_LOOP:
        return new IfThenElseStruct({
          state: currentState,
          traverser: this,
          ...opts,
        }).simplify();

      case structs.WHILE_LOOP:
        return new WhileStruct({
          state: currentState,
          traverser: this,
          ...opts,
        }).simplify();

      case structs.DO_WHILE_LOOP:
        return new DoWhileStruct({
          state: currentState,
          traverser: this,
          ...opts,
        }).simplify();

      case structs.END_STATE:
        return new EndStateStruct({
          state: currentState,
          traverser: this,
          ...opts,
        }).simplify();

      case structs.SAME_TRANSITION | structs.DO_WHILE_LOOP | structs.WHILE_LOOP | structs.IF_THEN: // 88
        return new SameTransitionStruct({
          state: currentState,
          traverser: this,
          ...opts,
        }).simplify();

      default:
        return {
          states,
          state: currentState,
          nodes: [],
          result: 0,
        };
    }
  }

  visitAll() {
    const statistics = {};
    const states = {
      endStates: [],
    };

    this.graph
      .$()
      .nodes()
      .forEach((n) => {
        const stateId = n.id();
        const { result } = (states[parseInt(stateId, 10)] = this.evaluator.interpret(stateId));
        statistics[result] = result in statistics ? statistics[result] + 1 : 1;

        if (result == structs.END_STATE) {
          states["endStates"].push(parseInt(stateId, 10));
        }
      });

    return {
      states,
      statistics,
    };
  }

  getStatistics() {
    const statistics = {};

    this.graph
      .$()
      .nodes()
      .forEach((n) => {
        const stateId = n.id();
        const evaluated = this.evaluator.interpret(stateId);
        statistics[evaluated.result] = evaluated.result in statistics ? statistics[evaluated.result] + 1 : 1;
      });

    return statistics;
  }

  getCurrentState() {
    if (this.currentState === null) {
      this.currentState = this.initialState;
    }

    return this.currentState;
  }
}
