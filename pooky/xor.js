function XorString(uri, xorSource, xorLength) {
	var d5Tk = "";
	var n5Tk = 0;
	var S5Tk = [];
	S5Tk[n5Tk] = xorSource.toString();
	var N5Tk = S5Tk[n5Tk].length;
	var q5Tk = uri.length - 1,
			H5Tk = 0;
	while (q5Tk >= 0) {
			if (H5Tk === N5Tk) {
					H5Tk = 0;
					if (++n5Tk === xorLength) {
							n5Tk = 0;
					}
					if (S5Tk.length < xorLength) {
							S5Tk[n5Tk] = cleanString(S5Tk[n5Tk - 1], S5Tk[n5Tk - 1]).toString();
					}
					N5Tk = S5Tk[n5Tk].length;
			}
			d5Tk = String.fromCharCode(uri.charCodeAt(q5Tk) ^ S5Tk[n5Tk].charCodeAt(H5Tk)) + d5Tk;
			--q5Tk, ++H5Tk;
	}
	return d5Tk;
}

function removeParenthesis(string) {
	return string.replace(new RegExp("\\(|\\)", "g"), "");
}

function cleanString(string, shouldDeepClean) {
		if (!shouldDeepClean) {
				var regexString = new RegExp("^(function [0-9a-zA-Z_$]+\\([0-9a-zA-Z_$]+,\\s*[0-9a-zA-Z_$]+\\)\\s*\\{)\\s*(\"use strict\";)([\\s\\S]*)$");
				string = string.replace(regexString, "$1$3");
		}
		string = string.replace(new RegExp("[\\s]+", "g"), "");
		return N2Tk(string, string.length, string.length);
}

function decodeFunction(funcSource, xorUri){

	function N2Tk(g5Tk, J5Tk, m5Tk) {

			var A5Tk = 0xcc9e2d51,
					I5Tk = 0x1b873593;
			var K5Tk;

			var k5Tk = true;
			var f5Tk = m5Tk;
			var F5Tk = J5Tk;
			F5Tk = F5Tk & ~0x3;
			var z5Tk = 0;
			while (z5Tk < F5Tk) {
					K5Tk = g5Tk.charCodeAt(z5Tk) & 0xff | (g5Tk.charCodeAt(z5Tk + 1) & 0xff) << 8 | (g5Tk.charCodeAt(z5Tk + 2) & 0xff) << 16 | (g5Tk.charCodeAt(z5Tk + 3) & 0xff) << 24;
					K5Tk = A2Tk(K5Tk, A5Tk);
					K5Tk = (K5Tk & 0x1ffff) << 15 | K5Tk >>> 17;
					K5Tk = A2Tk(K5Tk, I5Tk);

					f5Tk ^= K5Tk;
					if (k5Tk) {
							f5Tk = (f5Tk & 0x7ffff) << 13 | f5Tk >>> 19;
							f5Tk = f5Tk * 5 + 0xe6546b64 | 0;
					}
					z5Tk += 4;
			}
			K5Tk = 0;
			var f8Tk = J5Tk % 4;
			if (f8Tk === 3) {
					K5Tk = (g5Tk.charCodeAt(F5Tk + 2) & 0xff) << 16;
					K5Tk |= (g5Tk.charCodeAt(F5Tk + 1) & 0xff) << 8;
					K5Tk |= g5Tk.charCodeAt(F5Tk) & 0xff;
					K5Tk = A2Tk(K5Tk, A5Tk);
					K5Tk = (K5Tk & 0x1ffff) << 15 | K5Tk >>> 17;
					K5Tk = A2Tk(K5Tk, I5Tk);
					f5Tk ^= K5Tk;

					f5Tk ^= J5Tk;
					f5Tk ^= f5Tk >>> 16;
					f5Tk = A2Tk(f5Tk, 0x85ebca6b);
					f5Tk ^= f5Tk >>> 13;
					f5Tk = A2Tk(f5Tk, 0xc2b2ae35);

					f5Tk ^= f5Tk >>> 16;
					return f5Tk;
			}
			if (f8Tk === 2) {
					K5Tk |= (g5Tk.charCodeAt(F5Tk + 1) & 0xff) << 8;
					K5Tk |= g5Tk.charCodeAt(F5Tk) & 0xff;
					K5Tk = A2Tk(K5Tk, A5Tk);
					K5Tk = (K5Tk & 0x1ffff) << 15 | K5Tk >>> 17;
					K5Tk = A2Tk(K5Tk, I5Tk);
					f5Tk ^= K5Tk;

					f5Tk ^= J5Tk;
					f5Tk ^= f5Tk >>> 16;
					f5Tk = A2Tk(f5Tk, 0x85ebca6b);
					f5Tk ^= f5Tk >>> 13;
					f5Tk = A2Tk(f5Tk, 0xc2b2ae35);

					f5Tk ^= f5Tk >>> 16;
					return f5Tk;
			}
			if (f8Tk === 1) {
					K5Tk |= g5Tk.charCodeAt(F5Tk) & 0xff;
					K5Tk = A2Tk(K5Tk, A5Tk);
					K5Tk = (K5Tk & 0x1ffff) << 15 | K5Tk >>> 17;
					K5Tk = A2Tk(K5Tk, I5Tk);
					f5Tk ^= K5Tk;

			}
			f5Tk ^= J5Tk;
			f5Tk ^= f5Tk >>> 16;
			f5Tk = A2Tk(f5Tk, 0x85ebca6b);
			f5Tk ^= f5Tk >>> 13;
			f5Tk = A2Tk(f5Tk, 0xc2b2ae35);

			f5Tk ^= f5Tk >>> 16;
			return f5Tk;
	}

	function A2Tk(l5Tk, M5Tk) {
			var a5Tk = M5Tk & 0xffff;
			var Z5Tk = M5Tk - a5Tk;
			console.log("l5Tk:", l5Tk, "0xffff", (0xffff).toString(2).length);
			return (Z5Tk * l5Tk) + (a5Tk * l5Tk);
	}

	var S2Tk = XorString(decodeURIComponent(xorUri), cleanString(removeParenthesis(funcSource)), 5);

	return S2Tk;
}

module.exports = {
	decodeFunction
};
