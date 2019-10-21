
const t = require("@babel/types");
const { Transition } = require("./transition.js");

class State{

  constructor(name){

    this.name = name;
    this.nodes = [];
    this.transition = null;
  }



  setTransition(transition, update=1){
    if(transition !== null && transition instanceof Transition){

      if(this.transition === null){
        this.transition = transition;
      }else{
        if(this.transition.hash() == transition.hash()){
			    if(update) this.transition = transition ;
        }
      }
    }

  }

  hasConditionalTransition(){
    return this.transition === null ? false : this.transition.isConditional();
  }

  addNode(node){
	  t.assertNode(node);
	  this.nodes.push(node);

  } 

	
};

module.exports = {
  State
};