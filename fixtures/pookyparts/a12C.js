function Z12C(X12C, Q12C, W12C) {
var a12C = 2;
for (; a12C !== 32;) {
    switch (a12C) {
        case 14:
            k12C = 0;
            a12C = 13;
            break;
        case 34:
            x12C += 1;
            a12C = 20;
            break;
        case 22:
            y12C = J12C + (C12C - J12C + Q12C * x12C) % n12C;
            I12C[x12C][y12C] = I12C[C12C];
            a12C = 35;
            break;
        case 13:
            a12C = k12C < X12C ? 12 : 10;
            break;
        case 33:
            return I12C;
            break;
        case 23:
            a12C = C12C >= V12C ? 27 : 22;
            break;
        case 27:
            J12C = V12C;
            V12C = W12C[r12C];
            n12C = V12C - J12C;
            r12C++;
            a12C = 23;
            break;
        case 18:
            a12C = C12C >= 0 ? 17 : 34;
            break;
        case 17:
            r12C = 0;
            V12C = 0;
            a12C = 15;
            break;
        case 2:
            var I12C = [];
            var k12C;
            var x12C;
            var C12C;
            a12C = 3;
            break;
        case 15:
            J12C = V12C;
            a12C = 27;
            break;
        case 3:
            var r12C;
            var V12C;
            var J12C;
            var n12C;
            a12C = 6;
            break;
        case 10:
            x12C = 0;
            a12C = 20;
            break;
        case 11:
            k12C += 1;
            a12C = 13;
            break;
        case 20:
            a12C = x12C < X12C ? 19 : 33;
            break;
        case 19:
            C12C = X12C - 1;
            a12C = 18;
            break;
        case 35:
            C12C -= 1;
            a12C = 18;
            break;
        case 12:
            I12C[k12C] = [];
            a12C = 11;
            break;
        case 6:
            var y12C;
            a12C = 14;
            break;
    }
}