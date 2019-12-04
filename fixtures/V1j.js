var x9C = function(Q9C) {
    var V1j = 2;
    for (; V1j !== 13;) {
        switch (V1j) {
            case 2:
                var U9C = [];
                V1j = 1;
                break;
            case 1:
                var d9C = 0;
                V1j = 5;
                break;
            case 4:
                U9C.z933(W933.g933(Q9C[d9C] + 26));
                V1j = 3;
                break;
            case 5:
                V1j = d9C < Q9C.length ? 4 : 9;
                break;
            case 8:
                S9C = U9C.q933(function() {
                    var i1j = 2;
                    for (; i1j !== 1;) {
                        switch (i1j) {
                            case 2:
                                return 0.5 - J933.M933();
                                break;
                        }
                    }
                }).Y933('');
                i9C = i2nn[S9C];
                V1j = 6;
                break;
            case 3:
                d9C++;
                V1j = 5;
                break;
            case 9:
                var S9C, i9C;
                V1j = 8;
                break;
            case 6:
                V1j = !i9C ? 8 : 14;
                break;
            case 14:
                return i9C;
                break;
        }
    }
};