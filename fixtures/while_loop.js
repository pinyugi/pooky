/*
var x = 5;
while( x == 5){
  x = 2;
  console.log("okay");


}
x = 7;
*/

function while_loop(){
  var state = 1;
  for (; state !== 99; ) {
    switch (state) {

      case 1:
        var x = 5;
        state = 2;
        break;

      case 2:
        state = x == 5 ? 3 : 5;
        break;

      case 3:
        x = 2;
        state = 4;
        break;

      case 4:
        console.log("okay");
        state = 2;
        break;

      case 5:
        x = 7;
        state = 99;
        break;

    }
  }
}
