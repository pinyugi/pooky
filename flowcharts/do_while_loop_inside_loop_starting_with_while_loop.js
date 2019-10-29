function do_while_loop_inside_loop_starting_with_while_loop(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {
      case 1:
        state = 11;
        break;

      case 11:
        state = 12;
        break;
      case 12:
        state = !0 ? 2 : 71;
        break;

      case 2:
        state = 3;
        break;

      case 3:
        state = !0 ? 52 : 4;
        break;

      case 4:
        state = 5;
        break;

      case 5:
        state = 51;
        break;

      case 51:
        state = 511;
        break;

      case 511:
        state = !0 ? 5111 : 5112
        break;

      case 5111:
        state = 3;
        break;

      case 51:
        state = 3;
        break;

      case 51:
        state = 3;
        break;



      case 52:
        state = 53;
        break;

      case 53:
        state = 6;
        break;

      case 6:
        state = !0 ? 3 : 7;
        break;

      case 7:
        state = 12;
        break;

      case 71:
        state = 8;
        break;

      case 8:
        return !0;
        break;
    }
  }
}
