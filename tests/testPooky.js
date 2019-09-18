const fromFile = require("../pooky/ast.js").fromFile;
const recast = require("recast");


const tree = {
    'pooky' : fromFile("fixtures/pooky.min.2d8ba5f04df1bcd5a874.js")
};



const currentTree = tree["pooky"];
console.log(recast.print(currentTree).code);


  