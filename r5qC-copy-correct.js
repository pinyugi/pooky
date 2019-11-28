function w4qC(S4qC, M4qC, O4qC) {
	var n5qC = M4qC % 4;	
	if(n5qC === 3){
		a4qC = (S4qC[U5qC[141]](h4qC + 2) & 0xff) << 16;
		a4qC |= (S4qC[U5qC[142]](h4qC + 1) & 0xff) << 8;
		a4qC |= S4qC[U5qC[143]](h4qC) & 0xff;
        a4qC = B3qC(a4qC, B4qC);
        a4qC = (a4qC & 0x1ffff) << 15 | a4qC >>> 17;


        if (!P4qC) {
            a4qC = B3qC(a4qC, o4qC);
        } else {
            E1gg(U5qC[144]);
        }

        
	}else{

	}
}