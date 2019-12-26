import * as fs from 'fs';
import { parser } from "@babel/parser"; 

export function fromFile(file) {
  const ast = parser(
    fs
      .readFileSync(file, {
        encoding: "UTF-8",
      })
      .toString()
  );
  delete ast.comments;
  return ast;
};
export function fromString(string){
  const ast = parser(string);
  delete ast.comments;
  return ast;
};

