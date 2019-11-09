function do_and_while_loop(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {

      case 1:
        state = 2;
        break;

      case 2:
        state = !0 ? 201 : 204;
        break;

      case 201:
        state = 202;
        break;

      case 202:
        state = 203;
        break;

      case 203:
        state = 3;
        break;

      case 204:
        state = 205;
        break;

      case 205:
        state = 3;
        break;

      case 3:
        state = !0 ? 4 : 11;
        break;

      case 4:
        state = 5;
        break;

      case 5:
        state = 6;
        break;

      case 6:
        state = !0 ? 11 : 7;
        //state =  7;
        break;

      case 7:
        state = 8;
        break;

      case 8:
        state = !0 ? 11 : 9;
        //state = 9;
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
        state = !0 ? 14 : 17;
        break;

      case 14:
        state = 15;
        break;

      case 15:
        state = 16;
        break;

      case 16:
        state = 17;
        break;

      case 17:
        state = 18;
        break;

      case 18:
        state = 19;
        break;

      case 19:
        state = !0 ? 3 : 20;
        //state = 20;
        break;


      case 20:
        state = 21;
        break;

      case 21:
        state = 98;
        break;

      case 98:
        return !0;
        break;
    }
  }
}
