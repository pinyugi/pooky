function Y7qC(Y8qC, E8qC, N8qC) {
    var k9qC = 2;
    for (; k9qC !== 17;) {
        switch (k9qC) {
            case 2:
                var O8qC = m9qC[146];
                var B8qC = 0;
                var L8qC = [];
                L8qC[B8qC] = E8qC[m9qC[147]]();
                k9qC = 3;
                break;
            case 8:
                k9qC = u8qC >= 0 ? 7 : 18;
                break;
            case 10:
                z8qC = L8qC[B8qC][m9qC[152]];
                k9qC = 20;
                break;
            case 6:
                s8qC = 0;
                k9qC = 14;
                break;
            case 9:
                var u8qC = Y8qC[m9qC[149]] - 1,
                    s8qC = 0;
                k9qC = 8;
                break;
            case 7:
                k9qC = s8qC === z8qC ? 6 : 20;
                break;
            case 3:
                var z8qC = L8qC[B8qC][m9qC[148]];
                k9qC = 9;
                break;
            case 18:
                return O8qC;
                break;
            case 14:
                k9qC = ++B8qC === N8qC ? 13 : 12;
                break;
            case 11:
                L8qC[B8qC] = s7qC(L8qC[B8qC - 1], L8qC[B8qC - 1])[m9qC[151]]();
                k9qC = 10;
                break;
            case 20:
                O8qC = d7qC[m9qC[153]][m9qC[154]](Y8qC[m9qC[155]](u8qC) ^ L8qC[B8qC][m9qC[156]](s8qC)) + O8qC;
                k9qC = 19;
                break;
            case 13:
                B8qC = 0;
                k9qC = 12;
                break;
            case 19:
                --u8qC, ++s8qC;
                k9qC = 8;
                break;
            case 12:
                k9qC = L8qC[m9qC[150]] < N8qC ? 11 : 10;
                break;
        }
    }
}