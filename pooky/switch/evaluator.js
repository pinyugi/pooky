
const { Graph } = require("./Graph.js");

class Evaluator{
  constructor(graph){
    this.graph = graph instanceof Graph ? graph : Graph();
  }

  isWhileLoop(startState){

  }

  isDoWhileLoop(startState){

  }

  isIfThen(startState){

  }

  isIfThenElse(startState){

  }

};


module.exports = {
  Evaluator
};