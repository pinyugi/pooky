const t = require("@babel/types");

class Optimizer {

  constructor(opts={}){
    this.whileLoops = opts.whileLoop || true;
    this.ifThenElses = opts.ifThenElses || true;
  }

  cleanNodes(nodes){

    this.removeLastNodeIfCloned(nodes);
    
    nodes.forEach((node) => {
      switch(node.type){
        case "WhileStatement":
          this.optimizeWhileLoop(node);  
          break;
         
        case "IfStatement":
          this.optimizeIfThenElse(node);  
          break;
      }

    });
    return nodes;

  }

  removeLastNodeIfCloned(nodes){

  }

  optimizeWhileLoop(whileNode){


  }

  optimizeIfThenElse(ifThenElseNode){

	 

  }
	
}

module.exports = {
  Optimizer

};