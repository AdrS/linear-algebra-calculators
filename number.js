var number = {};

number.Real = function(r) {
	if(typeof r !== 'number' || isNaN(r)) {
		return NaN;
	} else if(Number.isInteger(r)) {
		return number.Rational(r,1);
	}
	return {
		isReal: function() { return true; },
		isDecimal: function() { return true; },
		toDecimal: function() { return r },
		toString: function() {
			return r.toString();
		},
		abs: function() {
			return number.Real(Math.abs(r));
		},
		inv: function() {
			const i = 1/r;
			if(isNaN(i)) {
				return NaN;
			}
			return number.Real(i);
		},
		isZero: function(epsilon) {
			if(epsilon) {
				return Math.abs(r) < epsilon;
			} else {
				return r === 0;
			}
		}
	};
}

number.gcd = function(a,b) {
	//https://en.wikipedia.org/wiki/Euclidean_algorithm#Implementations
	while(b !== 0) {
		const t = b;
		b = a % b;
		a = t;
	}
	return a;
}

number.lcm = function(a,b) {
	//take advantace of the equality a*b = gcd(a,b)*lcm(a,b)
	return a*b/number.gcd(a,b);
}

number.Rational = function(n,d) {
	if(!Number.isInteger(n) || !Number.isInteger(d) || d === 0) {
		return NaN;
	}
	const gcd = number.gcd(n,d);
	n /= gcd;
	d /= gcd;
	if(d < 0) {
		d = -d;
		n = -n;
	}
	return {
		isReal: function() { return true; },
		isDecimal: function() { return false; },
		toDecimal: function() { return n/d; },
		toString: function() {
			//TODO: handle case of 0/78
			if(d === 1) {
				return n.toString();
			} else {
				return n.toString() + '/' + d.toString();
			}
		},
		abs: function() {
			return number.Rational(Math.abs(n),d);
		},
		inv: function() {
			//the Rational constructor will handle case of inv(0)
			return number.Rational(d,n);
		},
		isZero: function(epsilon) {
			if(epsilon) {
				return Math.abs(n/d) < epsilon;
			} else {
				return n === 0;
			}
		},
		numerator: function() { return n; },
		denominator: function() { return d; },
	};
}

number.Complex = function(r, i) {
	//Check that r and i are 'number.Real/Rational'
	//if r or i are native JavaScript numbers, wrap them up
	if(Number.isFinite(r)) {
		r = number.Real(r);
	} else if(!(typeof r === 'object' && r.isReal && r.isReal())) {
		return NaN;
	}
	if(Number.isFinite(i)) {
		i = number.Real(i);
	} else if(!(typeof i === 'object' && i.isReal && i.isReal())) {
		return NaN;
	}
	return {
		toString: function() {
			if(i.isZero()) {
				return r.toString();
			} else if(r.isZero()) {
				return i.toString() + 'i';
			} else {
				return r.toString() + ' + ' + i.toString() + 'i';
			}
			//TODO: handle 1 + -8i vs 1 - 8i
		},
		abs: function() {
			//if possible, try no to convert to floating point
			if(r.isZero()) {
				return i.abs();
			} else if(i.isZero()) {
				return r.abs();
			} else {
				return number.Real(Math.sqrt(Math.pow(r.abs(),2) + Math.pow(i.abs(),2)));
			}
		},
		isReal: function() {
			//TODO: allow epsilon parameter?
			return i.isZero();
		},
		Re: function() {
			return r;
		},
		Im: function() {
			return i;
		},
		arg: function() {
			return Math.atan(i.toDecimal(),r.toDecimal());
		},
		conj: function() {
			//TODO: implement
			//return number.Complex(r, number.subtract(0, i));
		},
		isZero: function(epsilon) {
			if(epsilon) {
				return this.abs() < epsilon;
			} else {
				return r.isZero() && i.isZero();
			}
		},
		inv: function() {
			//1/(a + bi) = (a - bi)/(a^2 + b^2)
			console.error("unimplemented");
		}
	};
}

number.toComplex = function(a) {
	//if native JavaScript number
	if(Number.isFinite(a)) {
		return number.Complex(a,0);
	}
	if(typeof a === 'object' && a.isReal) {
		//if number.Real/Rational
		if(a.isReal()) {
			return number.Complex(a,0);
		//else already complex
		} else {
			return a;
		}
	}
	//TODO: handle this case
	console.error("Not a number");
}

number.addReal = function(a,b) {
	//Decimal + Rational -> Decimal
	if(a.isDecimal() || b.isDecimal()) {
		return number.Real(a.toDecimal() + b.toDecimal());
	//Rational + Rational -> Rational
	} else {
		const n = a.numerator()*b.denominator() + b.numerator()*a.denominator();
		const d = a.denominator() * b.denominator();
		return number.Rational(n,d);
	}
}

number.subReal = function(a,b) {
	//Decimal - Rational -> Decimal
	if(a.isDecimal() || b.isDecimal()) {
		return number.Real(a.toDecimal() - b.toDecimal());
	//Rational - Rational -> Rational
	} else {
		const n = a.numerator()*b.denominator() - b.numerator()*a.denominator();
		const d = a.denominator() * b.denominator();
		return number.Rational(n,d);
	}
}

number.multReal = function(a,b) {
	//Decimal - Rational -> Decimal
	if(a.isDecimal() || b.isDecimal()) {
		return number.Real(a.toDecimal() * b.toDecimal());
	//Rational - Rational -> Rational
	} else {
		const n = a.numerator()*b.numerator();
		const d = a.denominator() * b.denominator();
		return number.Rational(n,d);
	}
}

number.divReal = function(a,b) {
	if(b.isZero()) return NaN;
	return number.multReal(a,b.inv());
}

//convert to complex
//apply operation
//if real, convert back to real
number.add = function(a,b) {
	a = number.toComplex(a);
	b = number.toComplex(b);
	const r1 = a.Re();
	const i1 = a.Im();

	const r1 = a.Re();
	const i1 = a.Im();
}
number.subtract = function(a,b) {
	//a,b -> a - b
	a = number.toComplex(a);
	b = number.toComplex(b);
}
number.multiply = function(a,b) {
	a = number.toComplex(a);
	b = number.toComplex(b);
}
number.divide = function(a,b) {
	//a,b -> a/b or NaN if b = 0
	a = number.toComplex(a);
	b = number.toComplex(b);
}
number.exp = function(a,n) {
	//use montgomery exponentiation
	//also look at de Moivre's identity
}
//TODO: add <,<=,=,>=,>
