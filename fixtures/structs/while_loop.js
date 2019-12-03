function while_loop(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {
      case 1:
        console.log("state 1");
        state = 2;
        break;
      case 2:
          console.log("state 2");
      state = 3;
        break;

      case 3:
          console.log("state 3");
      state = !0 ? 4 : 7;
        //state = !0 ? 5 : 7;
        break;

      case 4:
          console.log("state 4");
      state = 5;
        break;

      case 5:
          console.log("state 5");        
        state = 6;
        break;

      case 6:
          console.log("state 6");        
        state = !0 ? 600 : 601;
        break;

      case 600:
          console.log("state 600");
        state = 61;
        break;

      case 601:
          console.log("state 601"); 
        state = 61;
        break;


      case 61:
        console.log("state 61");
        state = !0 ? 62 : 611;
        break;
      
      case 611:
        state = 7;
        break;

      case 62:
          console.log("state 62");
        state = 63;
        break;

      case 63:
          console.log("state 63");
        //state = 698;
        state = 64;
        break;

      case 64:
          console.log("state 64");
        state = 3;
        break;

      case 7:
          console.log("state 7");
        state = 8;
        break;

      case 8:
          console.log("state 8");
        state = 9;
        break;

      case 9:
          console.log("state 9");
        state = 10;
        break;

      case 10:
          console.log("state 10");
        return !0;
        break;
    }
  }
}
