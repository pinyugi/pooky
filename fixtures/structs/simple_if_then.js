function w4qC(S4qC, M4qC, O4qC) {
    var state = 2;
    for (; state !== 65;) {
        switch (state) {
            case 1:
                console.log("state 1");
                state = 2;
                break;
            case 2:
                console.log("state 2");
                state = !0 ? 3 : 5;
                break;
            case 3:
                console.log("state 3");
                state = 4;
                break;
            case 4:
                console.log("state 4");
                state = 65;
                break;
            case 5:
                console.log("state 5");
                state = 6;
                break;
            case 6:
                console.log("state 6");
                state = 65;
                break;

        }
    }
}