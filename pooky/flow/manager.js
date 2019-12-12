class StateManager {
  constructor(states) {
    this.states = {};
    this.graph = cytoscape();
    this.traverser = null;
    this.terminal = new Set();
    this.initial = null;

    if (states !== undefined && states.length) {
      for (let state of states) this.addState(state);
    }
  }

  addState(state, update = 1) {
    if (!this.states.hasOwnProperty(state) || (this.states.hasOwnProperty(state) && update))
      this.states[state.name] = state;
  }

  getState(state) {
    const name = this.getStateName(state);
    return this.states.hasOwnProperty(name) ? this.states[name] : 0;
  }

  getStateNodes(state) {
    const _state = this.getState(state);
    return _state ? _state.getNodes() : 0;
  }

  getStateName(state) {
    return state instanceof State ? state.name : state;
  }

  getInitialState() {
    return this.initial !== undefined ? this.getState(this.initial) : 0;
  }

  removeState(state) {
    const name = this.getStateName(state);
    if (this.states.hasOwnProperty(name)) delete this.states[name];
  }

  clearStates() {
    this.states = {};
  }

  markTerminalState(state) {
    const name = this.getStateName(state);
    this.terminal.add(name);
  }

  setInitialState(state) {
    const name = this.getStateName(state);
    if (!this.states.hasOwnProperty(name)) {
      throw Error("State " + name + " does not exist.Thus cannot be set as the initial state.");
    }
    this.initial = name;
  }

  isStateTerminal(state) {
    const name = this.getStateName(state);
    return this.terminal.has(name);
  }

  setupGraph() {
    this.graph = cytoscape();
    const elems = [];

    for (let name of Object.keys(this.states)) {
      const state = this.states[name];
      const sourceState = state.name;

      elems.push({
        group: "nodes",
        data: {
          isConditional: state.hasConditionalTransition(),
          id: sourceState,
        },
      });

      const transition = state.transition;

      if (transition !== null) {
        for (let targetState of transition.states) {
          elems.push({
            group: "edges",
            data: {
              id: `${sourceState}->${targetState}`,
              test: transition.test,
              isConditional: transition.isConditional(),
              source: sourceState,
              target: targetState,
            },
          });
        }
      }
    }

    this.graph.add(elems);
  }

  simplify(path) {
    const { states, statistics } = this.traverser.visitAll();
    const history = [];
    let nodez = [];

    Object.keys(this.states).forEach((stateName) => {
      states[stateName]["nodes"] = this.states[stateName]["nodes"];
      states[stateName]["transition"] = this.states[stateName]["transition"];
    });

    let getNextStruct = true;
    do {
      const { nodes, result } = this.traverser.getNextStruct({
        states,
        statistics,
        history,
      });

      if (nodes) {
        nodez.push(...nodes);
      }

      if (result == structs.END_STATE) {
        getNextStruct = false;
      }
    } while (getNextStruct);

    //TODO: NEED TO MAKE IT SO ONE PASS IS ENOUGH. CURRENTLY TWO DOES THE JOB.
    nodez = optimizeNodes(nodez);
    nodez = optimizeNodes(nodez);
    path.getPrevSibling().remove();
    path.replaceWithMultiple(nodez);
  }

  setupTraverser() {
    const initialState = this.getInitialState().name;
    this.traverser = new StructTraverser(this.graph, initialState);
  }

  static setupFlowNodes(_block, manager, stateName, stateHolderName, debug) {
    if (isTransition(_block, stateHolderName)) {
      const transition = isConditionalTransition(_block, stateHolderName)
        ? createConditionalTransition(_block)
        : createTransition(_block);

      manager.getState(stateName).setTransition(transition);
    } else {
      if (_block.type == "ReturnStatement") {
        manager.markTerminalState(stateName);
      }

      if (_block.type != "BreakStatement" && _block.type != "ContinueStatement" && !debug) {
        manager.getState(stateName).addNode(_block.node);
      }
    }
  }

  static fromWhile(path, debug = false) {
    const manager = new StateManager();
    const stateHolderName = utils.getStateHolderName(path);

    const recast = require("recast");
    let query = "body";
    let keepLooping = true;

    do {
      query += ".body";
      const stateNameQuery = `${query}.0.test.right.value`;
      const stateName = path.get(stateNameQuery).node;
      manager.addState(new State(stateName));

      path.get(`${query}.0.consequent.body`).forEach((_block) => {
        StateManager.setupFlowNodes(_block, manager, stateName, stateHolderName, debug);
      });

      const alternateFirstNode = path.get(`${query}.0.alternate.body.0`);
      if (alternateFirstNode.type == "ContinueStatement") {
        keepLooping = false;
      } else {
        query += ".0.alternate";
      }
    } while (keepLooping);

    return manager;
  }

  static fromSwitch(path, debug = false) {
    const manager = new StateManager();
    const stateHolderName = utils.getStateHolderName(path);

    path.get("body.body.0.cases").forEach(function(_case) {
      const stateName = _case.get("test.value").node;
      manager.addState(new State(stateName));

      _case.get("consequent").forEach((_block) => {
        StateManager.setupFlowNodes(_block, manager, stateName, stateHolderName, debug);
      });

      if (debug) {
        manager
          .getState(stateName)
          .addNode(
            t.expressionStatement(
              t.callExpression(t.memberExpression(t.identifier("console"), t.identifier("log"), false), [
                t.stringLiteral(`State ${stateName}`),
              ])
            )
          );
      }
    });

    return manager;
  }

  static fromPath(path, debug = false) {
    let manager = null;
    let explicitTerminalState = null;
    if (path.type == "ForStatement") {
      manager = StateManager.fromSwitch(path, debug);
      explicitTerminalState = path.get("test.right.value").node;
    } else if (path.type == "WhileStatement") {
      manager = StateManager.fromWhile(path, debug);
      explicitTerminalState = path.get("test.right.value").node;
    }
    manager.setInitialState(utils.getInitialState(path));

    manager.addState(new State(explicitTerminalState));
    manager.markTerminalState(explicitTerminalState);

    manager.addState(new State(0));
    manager.markTerminalState(0);

    manager.setupGraph();
    manager.setupTraverser();

    return manager;
  }
}

function createEmptyStateManager() {
  const manager = new StateManager();
  manager.addState(new State(1));
  manager.setInitialState(1);
  manager.markTerminalState(1);

  manager.setupGraph();
  manager.setupTraverser();

  return manager;
}

module.exports = {
  StateManager,
  createEmptyStateManager,
};

const {
  isTransition,
  isConditionalTransition,
  createTransition,
  createConditionalTransition,
} = require("./transition.js");

const t = require("@babel/types");
const cytoscape = require("cytoscape");
const { State } = require("./state.js");
const { StructTraverser } = require("./traverser.js");
const { optimizeNodes } = require("./optimize.js");
const { structs } = require("./structs.js");
const utils = require("./utils.js");
