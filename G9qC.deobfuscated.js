stateHolderName: G9qC
*******************************************
currentState: 2 
structType: 4
*******************************************
state: 2
isContinueLoop: false
isBreakLoop: false
*******************************************
currentState: 1 
structType: 32
*******************************************
While Struct: 1  this.history: [ 2, 1 ]
*******************************************
currentState: 5 
structType: 8
*******************************************
*******************************************
currentState: 4 
structType: 4
*******************************************
state: 4
isContinueLoop: false
isBreakLoop: false
*******************************************
currentState: 3 
structType: 4
*******************************************
state: 3
isContinueLoop: true
isBreakLoop: false


inside loop: 1  currentState: 1 result: 8
whileBodyNodes: [ { type: 'IfStatement',
    test: 
     Node {
       type: 'BinaryExpression',
       start: 2243,
       end: 2253,
       loc: [Object],
       left: [Object],
       operator: '===',
       right: [Object] },
    consequent: { type: 'BlockStatement', body: [Array], directives: [] },
    alternate: null } ]
*******************************************
currentState: 9 
structType: 128
*******************************************
(function() {
    var H9qC = 2;

    for (; H9qC !== 44; ) {
        switch (H9qC) {
        case 2:
            var l8qC = 2;
            H9qC = 1;
            break;
        case 18:
            T8qC += m9qC[65];
            T8qC += m9qC[66];
            var U8qC = m9qC[67];
            H9qC = 15;
            break;
        case 30:
            l8qC = 4;
            H9qC = 1;
            break;
        case 24:
            U8qC += m9qC[72];
            U8qC += m9qC[73];
            U8qC += m9qC[74];
            U8qC += m9qC[75];
            U8qC += m9qC[76];
            U8qC += m9qC[77];
            H9qC = 33;
            break;
        case 11:
            T8qC += m9qC[61];
            T8qC += m9qC[62];
            T8qC += m9qC[63];
            T8qC += m9qC[64];
            H9qC = 18;
            break;
        case 28:
            return;
            break;
        case 8:
            H9qC = l8qC === 4 ? 7 : 6;
            break;
        case 1:
            H9qC = l8qC !== 7 ? 5 : 44;
            break;
        case 9:
            l8qC = 7;
            H9qC = 1;
            break;
        case 15:
            U8qC += m9qC[68];
            U8qC += m9qC[69];
            U8qC += m9qC[70];
            U8qC += m9qC[71];
            H9qC = 24;
            break;
        case 6:
            H9qC = l8qC === 2 ? 14 : 29;
            break;
        case 7:
            l8qC = f8qC[U8qC] ? 3 : 9;
            H9qC = 1;
            break;
        case 5:
            H9qC = l8qC === 9 ? 4 : 8;
            break;
        case 29:
            H9qC = l8qC === 3 ? 28 : 1;
            break;
        case 4:
            try {
                var b8qC = 2;

                while (b8qC !== 1) {
                    if (b8qC === 2) {
                        AtCB();
                        b8qC = 1;
                        continue;
                    }
                }
            } catch (K8qC) {}

            f8qC[U8qC] = function() {};
            H9qC = 9;
            break;
        case 33:
            U8qC += m9qC[78];
            U8qC += m9qC[79];
            var f8qC = typeof window !== T8qC ? window : typeof global !== T8qC ? global : this;
            H9qC = 30;
            break;
        case 14:
            var T8qC = m9qC[58];
            T8qC += m9qC[59];
            T8qC += m9qC[60];
            H9qC = 11;
            break;
        }
    }
})();
