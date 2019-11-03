
const transitions = {
  SINGLE_PATH : 1,
  DUAL_PATH : 2
};


const structs = {
  UNKNOWN : 0,
  INFINITE_LOOP : 1,
  SAME_TRANSITION : 2,
  SIMPLE : 4,
  A_B_CONVERGES : 8,
  A_CONVERGES_TO_B : 16, 
  B_CONVERGES_TO_A : 32,
  CONTINUE_A_PROCEED_B : 64,
  CONTINUE_B_PROCEED_A : 128,
  BREAK_A_PROCEED_B : 256,
  BREAK_B_PROCEED_A : 512,
  CONTINUE_A_BREAK_B : 1024,
  CONTINUE_B_BREAK_A : 2048,
  WHILE_LOOP : 4096,
  DO_WHILE_LOOP : 8192,
  WHILE_LOOP_INSIDE_DO_WHILE_LOOP : 16384,
  END_STATE : 32768
};

const CHECK_EVERY_THING = (
  structs.INFINITE_LOOP |
	structs.SAME_TRANSITION |
	structs.SIMPLE |
	structs.A_B_CONVERGES |
	structs.A_CONVERGES_TO_B |
	structs.B_CONVERGES_TO_A |
	structs.CONTINUE_A_PROCEED_B |
	structs.CONTINUE_B_PROCEED_A |
	structs.BREAK_A_PROCEED_B |
	structs.BREAK_B_PROCEED_A |
	structs.CONTINUE_A_BREAK_B |
	structs.CONTINUE_B_BREAK_A |
	structs.DO_WHILE_LOOP |
	structs.WHILE_LOOP |
	structs.WHILE_LOOP_INSIDE_DO_WHILE_LOOP
);


const checkMode = {
  CHECK_EVERY_THING : CHECK_EVERY_THING
};



module.exports = {
  transitions,
  structs,
  checkMode
};
