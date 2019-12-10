const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");

const switchFlatner = require("../pooky/switchflatner.js");

const tree = {
  pooky: fromFile("fixtures/pooky.min.2d8ba5f04df1bcd5a874.js"),
  v0j: fromFile("flowcharts/v0j.js"),
  N0j: fromFile("flowcharts/N0j.js"),
};

const currentTree = tree["N0j"];
switchFlatner(currentTree);
console.log(recast.print(currentTree).code);
