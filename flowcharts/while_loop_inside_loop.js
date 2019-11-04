function while_loop_inside_loop(){
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
        state = !0 ? 5 : 11;
        break;

      //case 4:
      //  state = 5;
      //  break;

      case 5:
        state = !0 ? 6 : 9;
        break;

      case 6:
        state = 7;
        break;

      case 7:
        state = 8;
        break;

      case 8:
        state = 5;
        break;

      case 9:
        state = 10;
        break;

      case 10:
        state = 3;
        break;

      case 11:
        state = 12;
        break;

      case 12:
        state = 13;
        break;

      case 13:
        state = 98;
        break;

      case 98:
        return !0;
        break;
    }
  }
}
