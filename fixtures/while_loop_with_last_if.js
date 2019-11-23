/*
var x = 5;
while( x == 5){

    if(x == 3){
        d = 1;
        d();
        e();

        if(!x){
            oh.x();
            yee.a();
            return;
        }

    }else{
        okay.l = 'a';
        if(y==3){
            x= 3;
        }
        p = 3;

    }

}
x = 7;
*/

function while_loop_with_last_if(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {
      case 1:
        var x = 5;
        state = 2;
        break;
      case 2:
        state = x == 5 ? 3 : 11;
        break;

      case 3:
        state = x == 3 ? 4 : 7;
        break;

      case 4:
        d = 1;
        d();
        e();
        state = 5;
        break;

      case 5:
        state = !x ? 6 : 2;
        break;

      case 6:
        oh.x();
        yee.a();
        //state = 11;
        state = 2;
        //state = 66;
        break;
    /*
      case 66:
        return;
        break;
    */

      case 7:
        okay.l = 'a';
        state = 8;
        break;

      case 8:
        state = y == 3 ? 9 : 10;
        break;

      case 9:
        x = 3;
        state = 10;
        break;

      case 10:
        p = 3;
        state = 2;
        break;

      case 11:
        x = 7;
        state = 99;
        break;

    }
  }
}
