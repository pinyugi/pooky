function J1yg(J2yg, E2yg, q2yg) {
    var U3yg = 2;
    for (; U3yg !== 17;) {
        switch (U3yg) {
            case 8:
                U3yg = a2yg >= 0 ? 7 : 18;
                break;
            case 19:
                --a2yg, ++F2yg;
                U3yg = 8;
                break;
            case 18:
                return Y2yg;
                break;
            case 11:
                t2yg[M2yg] = F1yg(t2yg[M2yg - 1], t2yg[M2yg - 1])[w2yg[152]]();
                U3yg = 10;
                break;
            case 5:
                var t2yg = [];
                t2yg[M2yg] = E2yg[w2yg[148]]();
                var i2yg = t2yg[M2yg][w2yg[149]];
                U3yg = 9;
                break;
            case 9:
                var a2yg = J2yg[w2yg[150]] - 1,
                    F2yg = 0;
                U3yg = 8;
                break;
            case 12:
                U3yg = t2yg[w2yg[151]] < q2yg ? 11 : 10;
                break;
            case 7:
                U3yg = F2yg === i2yg ? 6 : 20;
                break;
            case 13:
                M2yg = 0;
                U3yg = 12;
                break;
            case 10:
                i2yg = t2yg[M2yg][w2yg[153]];
                U3yg = 20;
                break;
            case 14:
                U3yg = ++M2yg === q2yg ? 13 : 12;
                break;
            case 2:
                var Y2yg = w2yg[147];
                var M2yg = 0;
                U3yg = 5;
                break;
            case 6:
                F2yg = 0;
                U3yg = 14;
                break;
            case 20:
                Y2yg = X1yg[w2yg[154]][w2yg[155]](J2yg[w2yg[156]](a2yg) ^ t2yg[M2yg][w2yg[157]](F2yg)) + Y2yg;
                U3yg = 19;
                break;
        }
    }
}