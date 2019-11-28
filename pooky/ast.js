const fs = require("fs");
const parser = require('@babel/parser').parse; 

const fromFile = (file) => {
  const ast = parser(fs.readFileSync(file, {encoding: "UTF-8"}).toString().replace(/^\uFEFF/, ''));
  delete ast.comments;
  return ast;

};
const fromString = (string) => {
  const ast = parser(string);
  delete ast.comments;
  return ast;
};

module.exports ={
  fromFile : fromFile,
  fromString : fromString
};
