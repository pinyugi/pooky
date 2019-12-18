const { removeTamperingChecks } = require("../pooky/tampering.js");

let addLocalStorage = process.argv.slice(-1)[0];
let saveLocation = process.argv.slice(-2)[0];
let currentPooky = process.argv.slice(-3)[0];
removeTamperingChecks(currentPooky, saveLocation, addLocalStorage == "yes" ? true : false);

