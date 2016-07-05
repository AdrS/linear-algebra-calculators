"use strict"

/*
 * Author: Adrian Stoll
 * Date: 5 July 2016
 *
 * Matrices are represented as multidimensional arrays of numbers.Real/Complex
 */
//TODO: should change module name (so it doesn't conflict with native float matrix.js)
var matrix = {};

function $(id) { return document.getElementById(id); }

//create rxc matrix with initial entry value of initial (defaults to 0)
matrix.matrix = function(r,c, initial) {
	//JavaScript the Good Parts, Douglas Crockford pg: 63
	if(!initial) initial = number.Real(0);
	const A = [];
	for(let i = 0; i < r; i += 1) {
		const row = [];
		for(let j = 0; j < c; j += 1) {
			row[j] = initial;
		}
		A[i] = row;
	}
	return A;
}

//returns a copy of A
matrix.copy = function(A) {
	const r = A.length;
	const c = A[0].length;
	const Ac = [];
	for(let i = 0; i < r; i += 1) {
		const row = [];
		for(let j = 0; j < c; j += 1) {
			row[j] = A[i][j];
		}
		Ac[i] = row;
	}
	return Ac;
}

matrix.str = function(A) {
	let parts = [];
	for(let i = 0; i < A.length; i += 1) {
		parts.push(A[i].toString().split(',').join(' '));
		parts.push('\n');
	}
	return parts.join('');
}

//creates nxn identity matrix
matrix.id = function(n) {
	const I = matrix.matrix(n,n);
	const one = number.Real(1);
	for(let i = 0; i < n; i += 1) I[i][i] = one;
	return I;
}

//returns transpose of A
matrix.trans = function(A) {
	const r = A.length;
	const c = A[0].length;
	const T = matrix.matrix(c,r, 1);
	for(let i = 0; i < r; i += 1) {
		for(let j = 0; j < c; j += 1) {
			T[j][i] = A[i][j];
		}
	}
	return T;
}

///////////ELEMENTARY ROW OPERATIONS///////////
//scale row r of matrix A by k
matrix.scaleRow = function(A, r, k) {
	for(let i = 0; i < A[r].length; i += 1) {
		A[r][i] = number.mult(k, A[r][i]);
	}
}

//swap rows i and j of matrix A
matrix.swapRows = function(A, i, j) {
	const t = A[i];
	A[i] = A[j];
	A[j] = t;
}

//add k*row j to row i
matrix.addToRow  = function(A, i, j, k) {
	for(let l = 0; l < A[i].length; l += 1) {
		A[i][l] = number.add(A[i][l], number.mult(k,A[j][l]));
	}
}

//TOOD: LU decomposition -> deterimant & inverse
matrix.det = function(A) {
	let s = 1;
	console.error("unimplemented");
}

//returns NaN if matrix is singular
matrix.inv = function(A) {
	console.error("unimplemented");
}

//scales elements of matrix A, by k
matrix.scale = function(k, A, saveOriginal) {
	let Ac = saveOriginal ? matrix.copy(A) : A;
	for(let i = 0; i < Ac.length; i += 1) {
		for(let j = 0; j < Ac[i].length; j += 1) {
			Ac[i][j] = number.mult(k, Ac[i][j]);
		}
	}
	return Ac;
}

//returns matrix sum
matrix.add = function(A, B, saveOriginal) {
	let Ac = saveOriginal ? matrix.copy(A) : A;
	const r = Ac.length;
	const c = Ac[0].length;
	for(let i = 0; i < r; i += 1) {
		for(let j = 0; j < c; j += 1) {
			Ac[i][j] = number.add(A[i][j],B[i][j]);
		}
	}
	return Ac;
}

matrix.sub = function(A, B, saveOriginal) {
	let Ac = saveOriginal ? matrix.copy(A) : A;
	const r = Ac.length;
	const c = Ac[0].length;
	for(let i = 0; i < r; i += 1) {
		for(let j = 0; j < c; j += 1) {
			Ac[i][j] = number.sub(A[i][j],B[i][j]);
		}
	}
	return Ac;
}

matrix.mult = function(A, B) {
	//nxm * mxp -> nxp matrix
	const n = A.length, m = B.length, p = B[0].length;
	const C = matrix.matrix(n, p);
	for(let i = 0; i < n; i += 1) {
		for(let j = 0; j < p; j += 1) {
			let s = number.Real(0);
			for(let k = 0; k < m; k += 1) {
				s = number.add(s, number.mult(A[i][k], B[k][j]));
			}
			C[i][j] = s;
		}
	}
	return C;
}

//matrix exponentiation (matrix must be square)
matrix.exp = function(A, n) {
	if(n < 0) return;
	let B = matrix.copy(A);
	let C = matrix.id(A.length);
	while(n > 0) {
		if(n % 2) {
			C = matrix.mult(B,C);
		}
		n = Math.floor(n/2);
		B = matrix.mult(B,B);
	}
	return C;
}

matrix.equal = function(A, B, epsilon) {
	for(let i = 0; i < A.length; i += 1) {
		for(let j = 0; j < A[i].length; j += 1) {
			if(!number.equal(A[i][j], B[i][j], epsilon)) return false;
		}
	}
	return true;
}

//sum of squares of matrix elements
matrix.norm2 = function(A) {
	let s = number.Real(0);
	for(let i = 0; i < A.length; i += 1) {
		for(let j = 0; j < A[i].length; j += 1) {
			//TODO: prevent use of sqrt when calculating abs^2 of complex numbers
			//		ie: |a + bi| = a^2 + b^2
			let a = A[i][j].abs();
			s = number.add(s, number.mult(a,a));
		}
	}
	return s;
}

//calculate the Frobenius Norm: http://mathworld.wolfram.com/FrobeniusNorm.html
matrix.norm = function(A) {
	//Frobenius norm is defined for matrices with complex entries
	// (take the sum of the squares of the absolute values of the entries)
	return Math.sqrt(matrix.norm2(A).toDecimal());
}
