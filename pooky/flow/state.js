import * as t from "@babel/types";
import Transition from "./transition.js";

export default class State {
  constructor(name) {
    this._name = name;
    this.nodes = [];
    this.transition = null;
  }

  get name() {
    return parseInt(this._name, 10);
  }

  set name(value) {
    this._name = value;
  }

  setTransition(transition, update = 1) {
    if (transition !== null && transition instanceof Transition) {
      if (this.transition === null) {
        this.transition = transition;
      } else {
        if (this.transition.hash() == transition.hash()) {
          if (update) this.transition = transition;
        }
      }
    }
  }

  hasConditionalTransition() {
    return this.transition === null ? false : this.transition.isConditional();
  }

  addNode(node) {
    t.assertNode(node);
    this.nodes.push(node);
  }
}
