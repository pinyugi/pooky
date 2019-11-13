function x8wC(U9wC, b9wC, H9wC) {
    var e0MC = 2;
    for (; e0MC !== 65;) {
        switch (e0MC) {
            case 11:
                var D9wC = 0;
                e0MC = 10;
                break;
            case 12:
                R9wC = R9wC & ~0x3;
                e0MC = 11;
                break;
            case 49:
                q9wC ^= q9wC >>> 16;
                return q9wC;
                break;
            case 44:
                m9wC = f8wC(m9wC, l9wC);
                e0MC = 43;
                break;
            case 17:
                m9wC = f8wC(m9wC, l9wC);
                e0MC = 16;
                break;
            case 33:
                m9wC = (U9wC[a9wC[141]](R9wC + 2) & 0xff) << 16;
                e0MC = 32;
                break;
            case 25:
                e0MC = K9wC ? 24 : 21;
                break;
            case 21:
                E1gg(a9wC[140]);
                e0MC = 22;
                break;
            case 53:
                q9wC = f8wC(q9wC, 0xc2b2ae35);
                e0MC = 52;
                break;
            case 13:
                e0MC = 1 ? 12 : 11;
                break;
            case 16:
                e0MC = T9wC ? 15 : 26;
                break;
            case 51:
                E1gg(a9wC[146]);
                e0MC = 50;
                break;
            case 28:
                e0MC = !T9wC ? 44 : 47;
                break;
            case 34:
                var c0MC = b9wC % 4;
                e0MC = c0MC === 3 ? 33 : 46;
                break;
            case 24:
                q9wC = (q9wC & 0x7ffff) << 13 | q9wC >>> 19;
                e0MC = 23;
                break;
            case 20:
                m9wC = U9wC[a9wC[135]](D9wC) & 0xff | (U9wC[a9wC[136]](D9wC + 1) & 0xff) << 8 | (U9wC[a9wC[137]](D9wC + 2) & 0xff) << 16 | (U9wC[a9wC[138]](D9wC + 3) & 0xff) << 24;
                m9wC = f8wC(m9wC, f9wC);
                m9wC = (m9wC & 0x1ffff) << 15 | m9wC >>> 17;
                e0MC = 17;
                break;
            case 32:
                m9wC |= (U9wC[a9wC[142]](R9wC + 1) & 0xff) << 8;
                e0MC = 31;
                break;
            case 42:
                q9wC ^= m9wC;
                e0MC = 41;
                break;
            case 31:
                m9wC |= U9wC[a9wC[143]](R9wC) & 0xff;
                m9wC = f8wC(m9wC, f9wC);
                m9wC = (m9wC & 0x1ffff) << 15 | m9wC >>> 17;
                e0MC = 28;
                break;
            case 8:
                j9wC = T8wC[a9wC[127]][a9wC[128]][a9wC[129]](a9wC[130]) !== -1;
                e0MC = 7;
                break;
            case 35:
                m9wC = 0;
                e0MC = 34;
                break;
            case 2:
                var T9wC = typeof T8wC !== a9wC[121] && typeof T8wC[a9wC[122]] !== a9wC[123];
                var f9wC = 0xcc9e2d51,
                    l9wC = 0x1b873593;
                var m9wC;
                var j9wC;
                e0MC = 3;
                break;
            case 39:
                m9wC = m9wC << 32;
                e0MC = 38;
                break;
            case 23:
                q9wC = q9wC * 5 + 0xe6546b64 | 0;
                e0MC = 22;
                break;
            case 26:
                q9wC ^= m9wC;
                e0MC = 25;
                break;
            case 41:
                e0MC = !K9wC ? 40 : 38;
                break;
            case 15:
                E1gg(a9wC[139]);
                e0MC = 27;
                break;
            case 10:
                e0MC = D9wC < R9wC ? 20 : 35;
                break;
            case 45:
                e0MC = c0MC === 1 ? 31 : 38;
                break;
            case 14:
                var R9wC = b9wC;
                e0MC = 13;
                break;
            case 7:
                var K9wC = j9wC || typeof W7wC === a9wC[131] && !new T8wC[a9wC[132]](a9wC[133])[a9wC[134]](W7wC);
                var q9wC = H9wC;
                e0MC = 14;
                break;
            case 52:
                e0MC = T9wC ? 51 : 49;
                break;
            case 27:
                m9wC = m9wC | 0x1ffff;
                e0MC = 26;
                break;
            case 47:
                E1gg(a9wC[144]);
                e0MC = 43;
                break;
            case 43:
                e0MC = 1 ? 42 : 41;
                break;
            case 38:
                q9wC ^= b9wC;
                q9wC ^= q9wC >>> 16;
                q9wC = f8wC(q9wC, 0x85ebca6b);
                q9wC ^= q9wC >>> 13;
                e0MC = 53;
                break;
            case 9:
                e0MC = T8wC[a9wC[125]][a9wC[126]] ? 8 : 7;
                break;
            case 50:
                q9wC ^= q9wC >>> 13;
                e0MC = 49;
                break;
            case 22:
                D9wC += 4;
                e0MC = 10;
                break;
            case 40:
                E1gg(a9wC[145]);
                e0MC = 39;
                break;
            case 46:
                e0MC = c0MC === 2 ? 32 : 45;
                break;
            case 3:
                e0MC = T8wC[a9wC[124]] ? 9 : 7;
                break;
        }
    }
}
