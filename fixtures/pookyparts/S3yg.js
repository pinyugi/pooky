function i1yg(f2yg, C2yg, R2yg) {
    var S3yg = 2;
    for (; S3yg !== 65;) {
        switch (S3yg) {
            case 32:
                d2yg |= (f2yg[w2yg[142]](x2yg + 1) & 0xff) << 8;
                S3yg = 31;
                break;
            case 23:
                H2yg = H2yg * 5 + 0xe6546b64 | 0;
                S3yg = 22;
                break;
            case 4:
                var l2yg;
                S3yg = 3;
                break;
            case 12:
                x2yg = x2yg & ~0x3;
                S3yg = 11;
                break;
            case 46:
                S3yg = v3yg === 2 ? 32 : 45;
                break;
            case 44:
                d2yg = N1yg(d2yg, z2yg);
                S3yg = 43;
                break;
            case 20:
                d2yg = f2yg[w2yg[135]](m2yg) & 0xff | (f2yg[w2yg[136]](m2yg + 1) & 0xff) << 8 | (f2yg[w2yg[137]](m2yg + 2) & 0xff) << 16 | (f2yg[w2yg[138]](m2yg + 3) & 0xff) << 24;
                d2yg = N1yg(d2yg, N2yg);
                d2yg = (d2yg & 0x1ffff) << 15 | d2yg >>> 17;
                d2yg = N1yg(d2yg, z2yg);
                S3yg = 16;
                break;
            case 43:
                S3yg = !X2yg ? 42 : 47;
                break;
            case 34:
                var v3yg = C2yg % 4;
                S3yg = v3yg === 3 ? 33 : 46;
                break;
            case 27:
                d2yg = d2yg | 0x1ffff;
                S3yg = 26;
                break;
            case 24:
                H2yg = (H2yg & 0x7ffff) << 13 | H2yg >>> 19;
                S3yg = 23;
                break;
            case 33:
                d2yg = (f2yg[w2yg[141]](x2yg + 2) & 0xff) << 16;
                S3yg = 32;
                break;
            case 51:
                O5AA(w2yg[146]);
                S3yg = 50;
                break;
            case 13:
                S3yg = 1 ? 12 : 11;
                break;
            case 41:
                S3yg = !Q2yg ? 40 : 38;
                break;
            case 11:
                var m2yg = 0;
                S3yg = 10;
                break;
            case 39:
                d2yg = d2yg << 32;
                S3yg = 38;
                break;
            case 49:
                H2yg ^= H2yg >>> 16;
                return H2yg;
                break;
            case 22:
                m2yg += 4;
                S3yg = 10;
                break;
            case 2:
                var X2yg = typeof X1yg !== w2yg[121] && typeof X1yg[w2yg[122]] !== w2yg[123];
                var N2yg = 0xcc9e2d51,
                    z2yg = 0x1b873593;
                var d2yg;
                S3yg = 4;
                break;
            case 21:
                O5AA(w2yg[140]);
                S3yg = 22;
                break;
            case 25:
                S3yg = Q2yg ? 24 : 21;
                break;
            case 9:
                S3yg = X1yg[w2yg[125]][w2yg[126]] ? 8 : 7;
                break;
            case 15:
                O5AA(w2yg[139]);
                S3yg = 27;
                break;
            case 45:
                S3yg = v3yg === 1 ? 31 : 38;
                break;
            case 28:
                S3yg = 1 ? 44 : 43;
                break;
            case 16:
                S3yg = X2yg ? 15 : 26;
                break;
            case 10:
                S3yg = m2yg < x2yg ? 20 : 35;
                break;
            case 35:
                d2yg = 0;
                S3yg = 34;
                break;
            case 7:
                var Q2yg = l2yg || typeof H1og === w2yg[131] && !new X1yg[w2yg[132]](w2yg[133])[w2yg[134]](H1og);
                S3yg = 6;
                break;
            case 38:
                H2yg ^= C2yg;
                H2yg ^= H2yg >>> 16;
                H2yg = N1yg(H2yg, 0x85ebca6b);
                H2yg ^= H2yg >>> 13;
                H2yg = N1yg(H2yg, 0xc2b2ae35);
                S3yg = 52;
                break;
            case 3:
                S3yg = X1yg[w2yg[124]] ? 9 : 7;
                break;
            case 26:
                H2yg ^= d2yg;
                S3yg = 25;
                break;
            case 40:
                O5AA(w2yg[145]);
                S3yg = 39;
                break;
            case 31:
                d2yg |= f2yg[w2yg[143]](x2yg) & 0xff;
                d2yg = N1yg(d2yg, N2yg);
                d2yg = (d2yg & 0x1ffff) << 15 | d2yg >>> 17;
                S3yg = 28;
                break;
            case 8:
                l2yg = X1yg[w2yg[127]][w2yg[128]][w2yg[129]](w2yg[130]) !== -1;
                S3yg = 7;
                break;
            case 6:
                var H2yg = R2yg;
                var x2yg = C2yg;
                S3yg = 13;
                break;
            case 50:
                H2yg ^= H2yg >>> 13;
                S3yg = 49;
                break;
            case 47:
                O5AA(w2yg[144]);
                S3yg = 41;
                break;
            case 52:
                S3yg = X2yg ? 51 : 49;
                break;
            case 42:
                H2yg ^= d2yg;
                S3yg = 41;
                break;
        }
    }
}