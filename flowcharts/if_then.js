function if_then(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {
      case 1:
        state = 2;
        break;
      case 2:
        state = !0 ? 3 : 8;
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
        state = 7;
        break;

      case 7:
        state = 71;
        break;

      case 71:
        state = 2;
        break;

      case 8:
        state = 81;
        break; 

      case 81:
        state = 9;
        break; 
      case 9:
        return !0
        break;
    }
  }
}
