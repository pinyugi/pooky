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
        }else{
  
          console.log("66");
          console.log("done");
        }

    }
    console.log("okay")

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
        state = x == 3 ? 4 :100;
        break;

      case 4:
        d = 1;
        d();
        e();
        state = 5;
        break;

      case 5:
        //state = !x ? 6 : 100;
        state = !x ? 6 : 66;
        break;

      case 6:
        oh.x();
        yee.a();
        //state = 99;
        //state = 2;
        state = 11;
        //state = 100;
        //state = 66;
        break;

      case 66:
        console.log("66");
        state = 666;
        break;

      case 666:
        console.log("done");
        state = 100;
        break;

      case 100:
        console.log("okay");
        state = 2;
        break;

      case 11:
        x = 7;
        state = 99;
        break;

    }
  }
}
