window.addEventListener('load', function() {
	function $(id) { return document.getElementById(id); }
	const mi = matrix_input('matrix', {'entry_type':'complex'});
	$('calculate').addEventListener('click', function() {
		const m = mi.get_matrix();//[[number.Real(0), number.Complex(2,-5), number.Rational(17,3)], [number.Real(13), number.Real(8), number.Real(-13)], [number.Real(-1), number.Complex(0,-1), number.Real(11)]];
		if(!m) return;
		
		function swapRows(i,j) {
			console.log('swaping rows ', i + 1, ' and ', j + 1);
			let tmp = m[i];
			m[num_pivots] = m[j];
			m[j] = tmp;
			console.log(matrix.str(m));
		}

		let num_pivots = 0;
		//for each columns
		for(let i = 0; i < m[0].length; i += 1) {
			//find column's pivot (if there is one)
			let imax = num_pivots;
			let max = m[imax][i].abs().toDecimal();
			for(let j = num_pivots + 1; j < m.length; j += 1) {
				const cur = m[j][i].abs().toDecimal();
				if(cur > max) {
					imax = j;
					max = cur;
				}
			}

			//if no pivot, then nothing to do
			if(m[imax][i].abs().toDecimal() === 0) continue;
			console.log('Found pivot: ' + m[num_pivots][i].toString());

			//make make upper row be one with the pivot
			matrix.swapRows(m, num_pivots, imax);
			console.log('swaping rows ', num_pivots, ' and ', imax);
			console.log(matrix.str(m));

			//scale row with pivot
			matrix.scaleRow(m, num_pivots, m[num_pivots][i].inv());
			console.log('scaling row');
			console.log(matrix.str(m));

			//cancel out elements above and below pivot
			for(let j = 0; j < m.length; j += 1) {
				//don't want to cancel out pivot
				if(j === num_pivots) continue;
				matrix.addToRow(m, j, num_pivots, m[j][i].neg());
				console.log(matrix.str(m));
			}
			num_pivots += 1;
		}
	});
});
