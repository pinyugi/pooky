

const t = require("@babel/types");

const structs = {
  UNKNOWN : 0,
  INFINITE_LOOP : 1,
  DOES_NOT_CONVERGE : 2,
  SIMPLE : 4,
  IF_THEN : 8,
  IF_THEN_ELSE : 16,
  WHILE_LOOP : 32,
  DO_WHILE_LOOP : 64, 
  END_STATE : 128
};



function SimpleStruct(state, manager, meta){

  const { doWhileEndStates, whileNonLoopState, whileLoopState } = meta;;
  const { traverser, evaluator, graph } = manager;

  if(doWhileEndStates !== undefined){

    //const {
  }
 
  return "SimpleStruct";

}

function WhileStruct(state, manager, meta){
  return "WhileStruct";

}

function DoWhileStruct(state, manager, meta){
  return "DoWhileStruct";

}

function IfThenStruct(state, manager, meta){
  return "IfThenStruct";

}

function IfThenElseStruct(state, manager, meta){
  return "IfThenElseStruct";

}


module.exports = {
  SimpleStruct,
  WhileStruct,
  DoWhileStruct,
  IfThenStruct,
  IfThenElseStruct,
  structs
};
