const fs = require("fs");
const parser = require('@babel/parser').parse; 

const fromFile = (file) => {
  return parser(fs.readFileSync(file, {encoding: "UTF-8"}).toString().replace(/^\uFEFF/, ''), {sourceType: 'script'});

};
const fromString = (string) => {
  return parser(string, {sourceType: 'script'} );
};

module.exports ={
  fromFile : fromFile,
  fromString : fromString
};
