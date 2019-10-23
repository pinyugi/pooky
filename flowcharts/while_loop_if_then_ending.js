function while_loop_if_then_ending(){
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
        state = !0 ? 4 : 8;
        break;

      case 4:
        state = 41;
        break;

      case 41:
        state = 5;
        break

      case 5:
        state = 6
        break;

      case 6:
        state = 7
        break;

      case 7:
        state = !0 ? 8 : 3;
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
