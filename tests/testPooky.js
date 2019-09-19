
const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");

const switchFlatner = require("../pooky/switchFlatner.js");


const tree = {
  'pooky' : fromFile("fixtures/pooky.min.2d8ba5f04df1bcd5a874.js"),
  'brokenSwitch' : fromFile("fixtures/brokenswitch.js")
};



const currentTree = tree["brokenSwitch"];
switchFlatner(currentTree);
console.log(recast.print(currentTree).code);


  