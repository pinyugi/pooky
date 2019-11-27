function w4qC(S4qC, M4qC, O4qC) {
    var r5qC = 2;
    for (; r5qC !== 65;) {
        switch (r5qC) {
            case 25:
                r5qC = L4qC ? 24 : 21;
                break;
            case 38:
                d4qC ^= M4qC;
                d4qC ^= d4qC >>> 16;
                d4qC = B3qC(d4qC, 0x85ebca6b);
                r5qC = 54;
                break;
            case 26:
                d4qC ^= a4qC;
                r5qC = 25;
                break;
            case 16:
                r5qC = P4qC ? 15 : 26;
                break;
            case 49:
                d4qC ^= d4qC >>> 16;
                return d4qC;
                break;
            case 15:
                E1gg(U5qC[139]);
                r5qC = 27;
                break;
            case 51:
                E1gg(U5qC[146]);
                r5qC = 50;
                break;
            case 10:
                r5qC = t4qC < h4qC ? 20 : 35;
                break;
            case 32:
                a4qC |= (S4qC[U5qC[142]](h4qC + 1) & 0xff) << 8;
                r5qC = 31;
                break;
            case 3:
                r5qC = P3qC[U5qC[124]] ? 9 : 7;
                break;
            case 52:
                r5qC = P4qC ? 51 : 49;
                break;
            case 7:
                var L4qC = s4qC || typeof W7wC === U5qC[131] && !new P3qC[U5qC[132]](U5qC[133])[U5qC[134]](W7wC);
                var d4qC = O4qC;
                var h4qC = M4qC;
                r5qC = 13;
                break;
            case 35:
                a4qC = 0;
                r5qC = 34;
                break;
            case 8:
                s4qC = P3qC[U5qC[127]][U5qC[128]][U5qC[129]](U5qC[130]) !== -1;
                r5qC = 7;
                break;
            case 46:
                r5qC = n5qC === 2 ? 32 : 45;
                break;
            case 13:
                r5qC = 1 ? 12 : 11;
                break;
            case 23:
                d4qC = d4qC * 5 + 0xe6546b64 | 0;
                r5qC = 22;
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
            case 9:
                r5qC = P3qC[U5qC[125]][U5qC[126]] ? 8 : 7;
                break;
            case 28:
                r5qC = !P4qC ? 44 : 47;
                break;
            case 2:
                var P4qC = typeof P3qC !== U5qC[121] && typeof P3qC[U5qC[122]] !== U5qC[123];
                var B4qC = 0xcc9e2d51,
                    o4qC = 0x1b873593;
                var a4qC;
                r5qC = 4;
                break;
            case 12:
                h4qC = h4qC & ~0x3;
                r5qC = 11;
                break;
            case 42:
                d4qC ^= a4qC;
                r5qC = 41;
                break;
            case 21:
                E1gg(U5qC[140]);
                r5qC = 22;
                break;
            case 20:
                a4qC = S4qC[U5qC[135]](t4qC) & 0xff | (S4qC[U5qC[136]](t4qC + 1) & 0xff) << 8 | (S4qC[U5qC[137]](t4qC + 2) & 0xff) << 16 | (S4qC[U5qC[138]](t4qC + 3) & 0xff) << 24;
                a4qC = B3qC(a4qC, B4qC);
                a4qC = (a4qC & 0x1ffff) << 15 | a4qC >>> 17;
                a4qC = B3qC(a4qC, o4qC);
                r5qC = 16;
                break;
            case 22:
                t4qC += 4;
                r5qC = 10;
                break;
            case 43:
                r5qC = 1 ? 42 : 41;
                break;
            case 11:
                var t4qC = 0;
                r5qC = 10;
                break;
            case 41:
                r5qC = !L4qC ? 40 : 38;
                break;
            case 34:
                var n5qC = M4qC % 4;
                r5qC = n5qC === 3 ? 33 : 46;
                break;
            case 24:
                d4qC = (d4qC & 0x7ffff) << 13 | d4qC >>> 19;
                r5qC = 23;
                break;
            case 45:
                r5qC = n5qC === 1 ? 31 : 38;
                break;
            case 33:
                a4qC = (S4qC[U5qC[141]](h4qC + 2) & 0xff) << 16;
                r5qC = 32;
                break;
            case 27:
                a4qC = a4qC | 0x1ffff;
                r5qC = 26;
                break;
            case 50:
                d4qC ^= d4qC >>> 13;
                r5qC = 49;
                break;
            case 4:
                var s4qC;
                r5qC = 3;
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