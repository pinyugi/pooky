function while_loop_break_if_then(){
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
        state = !0 ? 31 : 8;
        break;

      case 31:
        state = 4

      case 4:
        state = 41;
        break;

      case 41:
        state = 5;
        break

      case 5:
        state = !0 ? 6 : 8;
        break;

      case 6:
        state = 7
        break;

      case 7:
        state = 3;
        break;

      case 8:
        state = 9
        break;

      case 9:
        return !0;
        break;
    }
  }
}
