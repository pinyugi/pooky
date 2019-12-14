function s9sk(j9sk, l9sk, a9sk){
    var p9sk = [];
    var t9sk;
    var P9sk;
    var h9sk;
    var w9sk;
    var v9sk;
    var L9sk;
    var R9sk;
    var u9sk;
    t9sk = 0;

    while(t9sk < j9sk){
    	p9sk[t9sk] = [];
    	t9sk += 1;
    } 

    P9sk = 0;

    while(P9sk < j9sk){
    	h9sk = j9sk - 1;
    	while(h9sk >= 0){
			w9sk = 0;
            v9sk = 0;
            L9sk = v9sk;
            do{
            	L9sk = v9sk;
                v9sk = a9sk[w9sk];
                R9sk = v9sk - L9sk;
                w9sk++;
            }while(h9sk >= v9sk);
			u9sk = L9sk + (h9sk - L9sk + l9sk * P9sk) % R9sk;
            p9sk[P9sk][u9sk] = p9sk[h9sk];
            h9sk -= 1;


    	}

    	P9sk += 1;


    }

    return p9sk;

}