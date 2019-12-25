const fs = require("fs");
const fromFile = require("../pooky/ast.js").fromFile;
const traverse = require("@babel/traverse").default;

const { ControlFlow, utils } = require("../pooky/flow");

let currentPooky = process.argv.slice(-1)[0];

const allStates = {};
const zeroes = [];
const statelines = [];
let count = 0;
const uniqueStates = new Set();

CONTROL_FLOW_VISITOR = {
  "ForStatement"(path) {
    const states = {};
    if (utils.isForAControlFlow(path)) {
      const stateHolderName = utils.getStateHolderName(path);

      const flow = ControlFlow.fromPath(path);
      for (let st of Object.keys(flow.states)) {
        const evaluated = flow.traverser.evaluator.interpret(st);

        states[evaluated.result] = evaluated.result in states ? states[evaluated.result] + 1 : 1;

        allStates[evaluated.result] = evaluated.result in allStates ? allStates[evaluated.result] + 1 : 1;
      }

      if (states.hasOwnProperty(0)) {
        zeroes.push(stateHolderName);
      }

      console.log(stateHolderName, ":", states);
      statelines.push(`${stateHolderName}:${JSON.stringify(states)}`);
      uniqueStates.add(JSON.stringify(states));
      count += 1;
    }
  },
};

let currentTree;
currentTree = fromFile(`${currentPooky}`);
traverse(currentTree, CONTROL_FLOW_VISITOR);

const totalStatesLog = `Total States : ${JSON.stringify(allStates)}`;
const totalSwitchesLog = `Total Switches:${count}`;
const totalZeroesLog = `Total Zeroes : ${zeroes.length}`;
statelines.push(totalStatesLog);
statelines.push(totalSwitchesLog);
statelines.push(totalZeroesLog);
console.log(totalStatesLog);
console.log(totalSwitchesLog);
console.log(totalZeroesLog);

fs.writeFile(`reports/${currentPooky}-uniqueStates.txt`, Array.from(uniqueStates).join("\n"), (err) => {
  console.log("uniqueStates saved!");
});

fs.writeFile(`reports/${currentPooky}-zeroes.txt`, zeroes.join("\n"), (err) => {
  console.log("Zeroes saved!");
});

fs.writeFile(`reports/${currentPooky}-statesreport.txt`, statelines.join("\n"), (err) => {
  console.log("states saved!");
});
