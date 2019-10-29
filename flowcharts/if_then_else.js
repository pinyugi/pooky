function if_then_else(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {
      case 1:
        state = 2;
        break;
      case 2:
        state = !0 ? 21 : 91;
        break;

      case 21:
        state = !0 ? 199 : 198;
        break;

      case 199:
        state = 22;
        break;

      case 198:
        state = 22;
        break;

      case 22:
        state = !0 ? 221 : 4;
        break;

      case 221:
        state = 222;
        break;

      case 222:
        state = 3;
        break;

      case 3:
        state = 4;
        break;

      case 4:
        state = 5;
        break;

      case 5:
        state = 6;
        break;

      case 6:
        state = 7;
        break;

      case 7:
        state = 8;
        break;

      case 8:
        state = 9;
        break;

      case 9:
        state = 2;
        break;

      case 91:
        state = 10;
        break;

      case 10:
        return !0;
        break;

    }
  }
}
