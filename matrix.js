"use strict"

/*
 * Author: Adrian Stoll
 * Date: 3 July 2016
 *
 * Matrices are represented as multidimensional arrays JavaScript numbers
 */
//TODO: write version for number.Real/Complex entries
var matrix = {};

function $(id) { return document.getElementById(id); }

//create rxc matrix with initial entry value of initial (defaults to 0)
matrix.matrix = function(r,c, initial) {
	//JavaScript the Good Parts, Douglas Crockford pg: 63
	if(!initial) initial = 0;
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
	for(let i = 0; i < n; i += 1) I[i][i] = 1;
	return I;
}

//returns transpose of A
matrix.trans = function(A) {
	const r = A.length;
	const c = A[0].length;
	const T = matrix.matrix(c,r);
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
		A[r][i] *= k;
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
		A[i][l] += k*A[j][l];
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
			Ac[i][j] *= k;
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
			Ac[i][j] += B[i][j];
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
			Ac[i][j] -= B[i][j];
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
			let s = 0;
			for(let k = 0; k < m; k += 1) {
				s += A[i][k] * B[k][j];
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
	if(epsilon) {
		for(let i = 0; i < A.length; i += 1) {
			for(let j = 0; j < A[i].length; j += 1) {
				if(Math.abs(A[i][j] - B[i][j]) >= epsilon) return false;
			}
		}
	} else {
		for(let i = 0; i < A.length; i += 1) {
			for(let j = 0; j < A[i].length; j += 1) {
				if(A[i][j] !== B[i][j]) return false;
			}
		}
	}
	return true;
}

//sum of squares of matrix elements
matrix.norm2 = function(A) {
	let s = 0;
	for(let i = 0; i < A.length; i += 1) {
		for(let j = 0; j < A[i].length; j += 1) {
			s += A[i][j] * A[i][j];
		}
	}
	return s;
}

//calculate the Frobenius Norm: http://mathworld.wolfram.com/FrobeniusNorm.html
matrix.norm = function(A) {
	//Frobenius norm is defined for matrices with complex entries
	// (take the sum of the squares of the absolute values of the entries)
	return Math.sqrt(matrix.norm2(A));
}

matrix.trace = function(A) {
	if(A.length !== A[0].length) return;
	let tr = 0;
	for(let i = 0; i < A.length; i += 1) tr += A[i][i];
	return tr;
}
