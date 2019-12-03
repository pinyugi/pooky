function w4qC(S4qC, M4qC, O4qC) {
    var r5qC = 34;
    //var r5qC = 46;
    for (; r5qC !== 65;) {
        switch (r5qC) {

            case 38:
                d4qC ^= M4qC;
                d4qC ^= d4qC >>> 16;
                d4qC = B3qC(d4qC, 0x85ebca6b);
                r5qC = 54;
                break;
            case 49:
                d4qC ^= d4qC >>> 16;
                return d4qC;
                //console.log("fuck");
                //r5qC = 99;
                break;
            /*
            case 99:
                console.log("yes");
                return d4qC;
                break;
            */

            case 51:
                E1gg(U5qC[146]);
                r5qC = 50;
                break;
            case 32:
                a4qC |= (S4qC[U5qC[142]](h4qC + 1) & 0xff) << 8;
                r5qC = 31;
                break;
            case 52:
                r5qC = P4qC ? 51 : 49;
                break;
            case 46:
                r5qC = n5qC === 2 ? 32 : 45;
                break;
            case 31:
                a4qC |= S4qC[U5qC[143]](h4qC) & 0xff;
                a4qC = B3qC(a4qC, B4qC);
                a4qC = (a4qC & 0x1ffff) << 15 | a4qC >>> 17;
                r5qC = 28;
                break;
            case 44:
                a4qC = B3qC(a4qC, o4qC);
                r5qC = 43;
                break;

            case 28:
                r5qC = !P4qC ? 44 : 47;
                break;
            case 42:
                d4qC ^= a4qC;
                r5qC = 41;
                break;
            case 43:
                r5qC = 1 ? 42 : 41;
                break;
            case 41:
                r5qC = !L4qC ? 40 : 38;
                break;

            case 34:
                var n5qC = M4qC % 4;
                r5qC = n5qC === 3 ? 33 : 46;
                break;
            case 33:
                a4qC = (S4qC[U5qC[141]](h4qC + 2) & 0xff) << 16;
                r5qC = 32;
                break;

            case 45:
                r5qC = n5qC === 1 ? 31 : 38;
                break;
            case 50:
                d4qC ^= d4qC >>> 13;
                r5qC = 49;
                break;
            case 54:
                d4qC ^= d4qC >>> 13;
                d4qC = B3qC(d4qC, 0xc2b2ae35);
                r5qC = 52;
                break;
            case 47:
                E1gg(U5qC[144]);
                r5qC = 43;
                break;
            case 40:
                E1gg(U5qC[145]);
                r5qC = 39;
                break;
            case 39:
                a4qC = a4qC << 32;
                r5qC = 38;
                break;
        }
    }
}