
const transitions = {
	SINGLE_PATH : 'single',
	DUAL_PATH : 'conditional'
};

const structs = {
	SIMPLE : 'simple',
	WHILE : 'while', 
	DO_WHILE : 'dowhile', 
	IF_THEN : 'ifthen', 
	IF_THEN_ELSE : 'ifthenelse',
	INFINITE_LOOP : 'infinite'
};


module.exports = {
	transitions,
	structs
};
