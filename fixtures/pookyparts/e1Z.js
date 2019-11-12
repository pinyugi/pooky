var k1f = function(P1f) {
    var e1Z = 2;
    for (; e1Z !== 13;) {
        switch (e1Z) {
            case 5:
                e1Z = n1f < P1f.length ? 4 : 9;
                break;
            case 2:
                var T1f = [];
                e1Z = 1;
                break;
            case 1:
                var n1f = 0;
                e1Z = 5;
                break;
            case 4:
                T1f.g1BB(W1BB.R1BB(P1f[n1f] + 80));
                e1Z = 3;
                break;
            case 3:
                n1f++;
                e1Z = 5;
                break;
            case 9:
                var e1f, E1f;
                e1Z = 8;
                break;
            case 6:
                e1Z = !E1f ? 8 : 14;
                break;
            case 8:
                e1f = T1f.Z1BB(function() {
                    var L2Z = 2;
                    for (; L2Z !== 1;) {
                        switch (L2Z) {
                            case 2:
                                return 0.5 - F1BB.Y1BB();
                                break;
                        }
                    }
                }).Q1BB('');
                E1f = J1gg[e1f];
                e1Z = 6;
                break;
            case 14:
                return E1f;
                break;
        }
    }
};