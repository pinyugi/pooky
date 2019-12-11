function c22g(M32g, F32g, q32g) {
    var m42g = 2;
    for (; m42g !== 45;) {
        switch (m42g) {
            case 25:
                Q32g = (Q32g & 0x7ffff) << 13 | Q32g >>> 19;
                m42g = 24;
                break;
            case 24:
                Q32g = Q32g * 5 + 0xe6546b64 | 0;
                m42g = 23;
                break;
            case 18:
                N32g = (N32g & 0x1ffff) << 15 | N32g >>> 17;
                N32g = a22g(N32g, Y32g);
                m42g = 16;
                break;
            case 3:
                m42g = t22g[A42g[124]] ? 9 : 7;
                break;
            case 23:
                l32g += 4;
                m42g = 10;
                break;
            case 21:
                N32g = 0;
                m42g = 35;
                break;
            case 32:
                N32g |= M32g[A42g[143]](R32g) & 0xff;
                m42g = 31;
                break;
            case 39:
                Q32g ^= F32g;
                Q32g ^= Q32g >>> 16;
                m42g = 37;
                break;
            case 16:
                m42g = 0 ? 15 : 27;
                break;
            case 27:
                Q32g ^= N32g;
                m42g = 26;
                break;
            case 33:
                N32g |= (M32g[A42g[142]](R32g + 1) & 0xff) << 8;
                m42g = 32;
                break;
            case 14:
                var R32g = F32g;
                m42g = 13;
                break;
            case 43:
                Q32g ^= N32g;
                m42g = 42;
                break;
            case 2:
                var a32g = typeof t22g !== A42g[121] && typeof t22g[A42g[122]] !== A42g[123];
                var t32g = 0xcc9e2d51,
                    Y32g = 0x1b873593;
                var N32g;
                var J32g;
                m42g = 3;
                break;
            case 10:
                m42g = l32g < R32g ? 20 : 21;
                break;
            case 29:
                m42g = !a32g ? 28 : 49;
                break;
            case 51:
                Q32g ^= Q32g >>> 16;
                return Q32g;
                break;
            case 12:
                R32g = R32g & ~0x3;
                m42g = 11;
                break;
            case 22:
                O5AA(A42g[140]);
                m42g = 23;
                break;
            case 34:
                N32g = (M32g[A42g[141]](R32g + 2) & 0xff) << 16;
                m42g = 33;
                break;
            case 8:
                J32g = t22g[A42g[127]][A42g[128]][A42g[129]](A42g[130]) !== -1;
                m42g = 7;
                break;
            case 7:
                var i32g = J32g || typeof H1og === A42g[131] && !new t22g[A42g[132]](A42g[133])[A42g[134]](H1og);
                var Q32g = q32g;
                m42g = 14;
                break;
            case 49:
                O5AA(A42g[144]);
                m42g = 44;
                break;
            case 47:
                m42g = x42g === 1 ? 32 : 39;
                break;
            case 41:
                O5AA(A42g[145]);
                m42g = 40;
                break;
            case 53:
                m42g = 0 ? 52 : 51;
                break;
            case 42:
                m42g = !i32g ? 41 : 39;
                break;
            case 46:
                O5AA(A42g[135]);
                m42g = 11;
                break;
            case 40:
                N32g = N32g << 32;
                m42g = 39;
                break;
            case 9:
                m42g = t22g[A42g[125]][A42g[126]] ? 8 : 7;
                break;
            case 20:
                N32g = M32g[A42g[136]](l32g) & 0xff | (M32g[A42g[137]](l32g + 1) & 0xff) << 8 | (M32g[A42g[138]](l32g + 2) & 0xff) << 16 | (M32g[A42g[139]](l32g + 3) & 0xff) << 24;
                N32g = a22g(N32g, t32g);
                m42g = 18;
                break;
            case 15:
                N32g = N32g | 0x1ffff;
                m42g = 27;
                break;
            case 28:
                N32g = a22g(N32g, Y32g);
                m42g = 44;
                break;
            case 37:
                Q32g = a22g(Q32g, 0x85ebca6b);
                Q32g ^= Q32g >>> 13;
                Q32g = a22g(Q32g, 0xc2b2ae35);
                m42g = 53;
                break;
            case 52:
                Q32g ^= Q32g >>> 13;
                m42g = 51;
                break;
            case 31:
                N32g = a22g(N32g, t32g);
                N32g = (N32g & 0x1ffff) << 15 | N32g >>> 17;
                m42g = 29;
                break;
            case 44:
                m42g = 1 ? 43 : 42;
                break;
            case 48:
                m42g = x42g === 2 ? 33 : 47;
                break;
            case 11:
                var l32g = 0;
                m42g = 10;
                break;
            case 26:
                m42g = i32g ? 25 : 22;
                break;
            case 13:
                m42g = !a32g ? 12 : 46;
                break;
            case 35:
                var x42g = F32g % 4;
                m42g = x42g === 3 ? 34 : 48;
                break;
        }
    }
}