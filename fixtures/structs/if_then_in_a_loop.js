function if_then_in_a_loop(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {
      case 1:
        state = 2;
        break;
      case 2:
        state = 3;
        break;

      case 3:
        state = !0 ? 4 : 7;
        break;

      case 4:
        state = 5;
        break;

      case 5:
        state = 6;
        break;

      case 6:
        state = 61;
        break;

      case 61:
        state = !0 ? 62 : 65;
        break;

      case 62:
        state = 63;
        break;

      case 63:
        state = 64;
        break;

      case 64:
        state = 65;
        break;

      case 65:
        state = 66;
        break;

      case 66:
        state = 3;
        break;

      case 7:
        state = 8;
        break;

      case 8:
        state = 9;
        break;

      case 9:
        state = 10;
        break;

      case 10:
        return !0;
        break;
    }
  }
}
