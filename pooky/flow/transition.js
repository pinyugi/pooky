import * as t from "@babel/types";
import * as recast from "recast";

const transitions = {
  SINGLE_PATH: 1,
  DUAL_PATH: 2,
};

export default class Transition {
  constructor(config) {
    this._states = [];
    this.setStates(config.states || this.states);
    this.setTest(config.test || null);
    this.setType(config.type);
  }

  get states() {
    return this._states.map((s) => parseInt(s, 10));
  }

  set states(newStates) {
    this._states = newStates;
  }

  isConditional() {
    return this.type === transitions.DUAL_PATH;
  }

  hash() {
    return [this._states.join(","), this.type, this.test].join("|");
  }

  setStates(states) {
    if (!(states instanceof Array) && !(states instanceof String)) states = [states];
    if (!states.length && (states.length == 1 || states.length == 2)) {
      throw Error("A transition cannot have no states. It must have at least 1 or 2 state(s) max");
    }

    for (let state of states) {
      try {
        t.assertNode(state);
        this._states.push(state.node.value);
      } catch (e) {
        if (!state || !(state instanceof String)) {
          throw Error(
            "States must contain either a Node containing " +
              "the state name in the value, or a state name as a string value"
          );
        }

        this._states.push(state);
      }
    }
  }

  setTest(test) {
    test === null || t.assertNode(test);
    this.test = test === null ? test : test.node;
  }

  setType(type) {
    if (![transitions.SINGLE_PATH, transitions.DUAL_PATH].includes(type)) {
      throw Error(`Transition type must be either ${transitions.SINGLE_PATH} or ${transitions.DUAL_PATH}`);
    }

    this.type = type;
  }
}

export function isTransition(path, stateHolderName) {
  return (
    path.get("expression").type !== undefined &&
    path.get("expression").type == "AssignmentExpression" &&
    recast.print(path.get("expression.left").node).code == stateHolderName
  );
}

export function isConditionalTransition(path, stateHolderName) {
  return isTransition(path, stateHolderName) && path.get("expression.right").type == "ConditionalExpression";
}

export function createTransition(path) {
  return new Transition({
    type: transitions.SINGLE_PATH,
    states: [path.get("expression.right")],
    test: null,
  });
}

export function createConditionalTransition(path) {
  return new Transition({
    type: transitions.DUAL_PATH,
    states: [path.get("expression.right.consequent"), path.get("expression.right.alternate")],
    test: path.get("expression.right.test"),
  });
}

