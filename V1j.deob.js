currentState: 2 result: 2
currentState: 1 result: 2
currentState: 5 result: 8
currentState: 4 result: 2
currentState: 9 result: 2
currentState: 8 result: 16
currentState: 6 result: 4
doWhileNodes: [ Node {
    type: 'ExpressionStatement',
    start: 534,
    end: 884,
    loc: SourceLocation { start: [Object], end: [Object] },
    expression: 
     Node {
       type: 'AssignmentExpression',
       start: 534,
       end: 883,
       loc: [Object],
       operator: '=',
       left: [Object],
       right: [Object] } },
  Node {
    type: 'ExpressionStatement',
    start: 901,
    end: 917,
    loc: SourceLocation { start: [Object], end: [Object] },
    expression: 
     Node {
       type: 'AssignmentExpression',
       start: 901,
       end: 916,
       loc: [Object],
       operator: '=',
       left: [Object],
       right: [Object] } } ]
currentState: [ 14 ] result: 32
var x9C = function(Q9C) {
    var U9C = [];
    var d9C = 0;

    while (d9C < Q9C.length) {
        U9C.z933(W933.g933(Q9C[d9C] + 26));
    }

    var S9C, i9C;

    do {
        S9C = U9C.q933(function() {
            var i1j = 2;

            for (; i1j !== 1; ) {
                switch (i1j) {
                case 2:
                    return 0.5 - J933.M933();
                    break;
                }
            }
        }).Y933("");

        i9C = i2nn[S9C];
    } while (!i9C);

    return i9C;
};
