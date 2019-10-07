function M1k(v1k, u1k) {
	var z1k = 2;
	while (z1k !== 10) {
		switch (z1k) {
			case 12:
				B1k += 1;
				z1k = 8;
				break;
			case 2:
				var W1k = [];
				z1k = 1;
				break;
			case 3:
				C1k += 1;
				z1k = 5;
				break;
			case 13:
				U1k -= 1;
				z1k = 6;
				break;
			case 4:
				W1k[(C1k + u1k) % v1k] = [];
				z1k = 3;
				break;
			case 9:
				var B1k = 0;
				z1k = 8;
				break;
			case 7:
				var U1k = v1k - 1;
				z1k = 6;
				break;
			case 6:
				z1k = U1k >= 0 ? 14 : 12;
				break;
			case 8:
				z1k = B1k < v1k ? 7 : 11;
				break;
			case 14:
				W1k[B1k][(U1k + u1k * B1k) % v1k] = W1k[U1k];
				z1k = 13;
				break;
			case 5:
				z1k = C1k < v1k ? 4 : 9;
				break;
			case 1:
				var C1k = 0;
				z1k = 5;
				break;
			case 11:
				return W1k;
				break;
		}
	}
}