function do_while_loop_inside_loop(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {
      case 1:
        state = 11;
        break;

      case 11:
        state = 12;
        break;

      case 111:
        state = !0 ? 112 : 73;
        break;  

      case 112:
        state = 12;
        break;

      case 12:
        state = !0 ? 2 : 71;
        break;

      case 2:
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
        state = !0 ? 3 : 7;
        break;

      case 7:
        state = 12;
        break;

      case 71:
        state = 72;
        break;

      case 72:
        state = 111;
        break;

      case 73:
        state = 8;
        break;

      case 8:
        return !0;
        break;
    }
  }
}
