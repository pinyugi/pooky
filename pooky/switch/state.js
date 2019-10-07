
const t = require("@babel/types");
const Transition = require("./transition.js").Transition;

function State(name){
  this.name = name;
  this.nodes = [];
  this.transition = null;
}

Object.assign(State.prototype, {

  getName : function(){
    return this.name;
  },

  getTransition : function(){
    return this.transition;
  },

  setTransition : function(transition, update=1){
    if(transition !== null && transition instanceof Transition){

      if(this.transition === null){
        this.transition = transition;
      }else{
        if(this.transition.hash() == transition.hash()){
			    if(update) this.transition = transition ;
        }
      }
    }

  },

  hasConditionalTransition : function(){
    return this.transition ==! null ? this.transition.isConditional() : false;
  },

  addNode : function(node){
	  t.assertNode(node);
	  this.nodes.push(node);

  }, 

  getNodes : function(){
	  return this.nodes;
  }
	
});

module.exports = {
  State
};