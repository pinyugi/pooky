function z5uC(a6uC, h6uC, M6uC) {
    var J7uC = 2;
    for (; J7uC !== 65;) {
        switch (J7uC) {
            case 53:
                J7uC = d6uC ? 52 : 50;
                break;
            case 34:
                y6uC = (a6uC[m7uC[141]](g6uC + 2) & 0xff) << 16;
                J7uC = 33;
                break;
            case 22:
                E1gg(m7uC[140]);
                J7uC = 23;
                break;
            case 47:
                J7uC = I7uC === 2 ? 33 : 46;
                break;
            case 10:
                J7uC = Q6uC < g6uC ? 20 : 21;
                break;
            case 42:
                J7uC = !P6uC ? 41 : 39;
                break;
            case 15:
                y6uC = y6uC | 0x1ffff;
                J7uC = 27;
                break;
            case 23:
                Q6uC += 4;
                J7uC = 10;
                break;
            case 54:
                W6uC = S5uC(W6uC, 0xc2b2ae35);
                J7uC = 53;
                break;
            case 32:
                y6uC |= a6uC[m7uC[143]](g6uC) & 0xff;
                y6uC = S5uC(y6uC, S6uC);
                y6uC = (y6uC & 0x1ffff) << 15 | y6uC >>> 17;
                J7uC = 29;
                break;
            case 44:
                J7uC = !d6uC ? 43 : 48;
                break;
            case 9:
                J7uC = d5uC[m7uC[125]][m7uC[126]] ? 8 : 7;
                break;
            case 29:
                J7uC = 1 ? 28 : 44;
                break;
            case 41:
                E1gg(m7uC[145]);
                J7uC = 40;
                break;
            case 48:
                E1gg(m7uC[144]);
                J7uC = 42;
                break;
            case 8:
                o6uC = d5uC[m7uC[127]][m7uC[128]][m7uC[129]](m7uC[130]) !== -1;
                J7uC = 7;
                break;
            case 28:
                y6uC = S5uC(y6uC, t6uC);
                J7uC = 44;
                break;
            case 16:
                J7uC = 0 ? 15 : 27;
                break;
            case 45:
                E1gg(m7uC[135]);
                J7uC = 11;
                break;
            case 43:
                W6uC ^= y6uC;
                J7uC = 42;
                break;
            case 40:
                y6uC = y6uC << 32;
                J7uC = 39;
                break;
            case 46:
                J7uC = I7uC === 1 ? 32 : 39;
                break;
            case 51:
                W6uC ^= W6uC >>> 13;
                J7uC = 50;
                break;
            case 24:
                W6uC = W6uC * 5 + 0xe6546b64 | 0;
                J7uC = 23;
                break;
            case 12:
                g6uC = g6uC & ~0x3;
                J7uC = 11;
                break;
            case 26:
                J7uC = P6uC ? 25 : 22;
                break;
            case 27:
                W6uC ^= y6uC;
                J7uC = 26;
                break;
            case 20:
                y6uC = a6uC[m7uC[136]](Q6uC) & 0xff | (a6uC[m7uC[137]](Q6uC + 1) & 0xff) << 8 | (a6uC[m7uC[138]](Q6uC + 2) & 0xff) << 16 | (a6uC[m7uC[139]](Q6uC + 3) & 0xff) << 24;
                y6uC = S5uC(y6uC, S6uC);
                y6uC = (y6uC & 0x1ffff) << 15 | y6uC >>> 17;
                y6uC = S5uC(y6uC, t6uC);
                J7uC = 16;
                break;
            case 2:
                var d6uC = typeof d5uC !== m7uC[121] && typeof d5uC[m7uC[122]] !== m7uC[123];
                var S6uC = 0xcc9e2d51,
                    t6uC = 0x1b873593;
                var y6uC;
                var o6uC;
                J7uC = 3;
                break;
            case 3:
                J7uC = d5uC[m7uC[124]] ? 9 : 7;
                break;
            case 11:
                var Q6uC = 0;
                J7uC = 10;
                break;
            case 39:
                W6uC ^= h6uC;
                W6uC ^= W6uC >>> 16;
                W6uC = S5uC(W6uC, 0x85ebca6b);
                W6uC ^= W6uC >>> 13;
                J7uC = 54;
                break;
            case 50:
                W6uC ^= W6uC >>> 16;
                return W6uC;
                break;
            case 13:
                J7uC = !d6uC ? 12 : 45;
                break;
            case 35:
                var I7uC = h6uC % 4;
                J7uC = I7uC === 3 ? 34 : 47;
                break;
            case 7:
                var P6uC = o6uC || typeof W7wC === m7uC[131] && !new d5uC[m7uC[132]](m7uC[133])[m7uC[134]](W7wC);
                var W6uC = M6uC;
                var g6uC = h6uC;
                J7uC = 13;
                break;
            case 52:
                E1gg(m7uC[146]);
                J7uC = 51;
                break;
            case 25:
                W6uC = (W6uC & 0x7ffff) << 13 | W6uC >>> 19;
                J7uC = 24;
                break;
            case 33:
                y6uC |= (a6uC[m7uC[142]](g6uC + 1) & 0xff) << 8;
                J7uC = 32;
                break;
            case 21:
                y6uC = 0;
                J7uC = 35;
                break;
        }
    }
}