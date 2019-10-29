
const transitions = {
	SINGLE_PATH : 1,
	DUAL_PATH : 2
};


const structs = {
	INFINITE_LOOP : 1,
	SIMPLE : 2,
	A_B_CONVERGES : 4,
	A_CONVERGES_TO_B : 8, 
	B_CONVERGES_TO_A : 16,
	A_B_CONTINUE : 32,
	A_B_BREAK : 64,
	CONTINUE_A_PROCEED_B : 128,
	CONTINUE_B_PROCEED_A : 256,
	BREAK_A_PROCEED_B : 512,
	BREAK_B_PROCEED_A : 1024,
	CONTINUE_A_BREAK_B : 2048,
	CONTINUE_B_BREAK_A : 4096,
	LATER_CONTINUE_A_PROCEED_B: 8192,
	LATER_CONTINUE_B_PROCEED_A: 16384,
	LATER_BREAK_A_PROCEED_B: 32768,
	LATER_BREAK_B_PROCEED_A: 65536,
	DO_WHILE_LOOP : 131072,
	WHILE_LOOP : 262144,
	WHILE_LOOP_INSIDE_DO_WHILE_LOOP : 524288
};

const CHECK_EVERY_THING = (
	structs.INFINITE_LOOP |
	structs.SIMPLE |
	structs.A_B_CONVERGES |
	structs.A_CONVERGES_TO_B |
	structs.B_CONVERGES_TO_A |
	structs.A_B_CONTINUE |
	structs.A_B_BREAK |
	structs.CONTINUE_A_PROCEED_B |
	structs.CONTINUE_B_PROCEED_A |
	structs.BREAK_A_PROCEED_B |
	structs.BREAK_B_PROCEED_A |
	structs.CONTINUE_A_BREAK_B |
	structs.CONTINUE_B_BREAK_A |
	structs.LATER_CONTINUE_A_PROCEED_B|
	structs.LATER_CONTINUE_B_PROCEED_A|
	structs.LATER_BREAK_A_PROCEED_B|
	structs.LATER_BREAK_B_PROCEED_A|
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
