const { removeTamperingChecks } = require("../pooky/tampering.js");

let addLocalStorage = process.argv.slice(-2)[0];
let currentPooky = process.argv.slice(-1)[0];
const source = removeTamperingChecks(currentPooky, addLocalStorage == "yes" ? true : false);
console.log(source);
