//TODO: add highlighting
window.addEventListener('load', function() {
	function $(id) { return document.getElementById(id); }
	const mi = matrix_input('matrix', {'entry_type':'complex'});
	function appendHeading(text) {
		const header = document.createElement('h2');
		header.innerText = text;
		$('results').appendChild(header);
	}
	$('calculate').addEventListener('click', function() {
		const m = mi.get_matrix(); //[[number.Real(0), number.Complex(2,-5), number.Rational(17,3)], [number.Real(13), number.Real(8), number.Real(-13)], [number.Real(-1), number.Complex(0,-1), number.Real(11)]];
		if(!m) return;

		$('results').innerHTML = '';
		const showSteps = $('show_steps').checked;
		if(showSteps) {
			appendHeading('Original Matrix:');
			matrix_display(m, 'results');
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
			if(showSteps) {
				appendHeading('Swap rows ' + (num_pivots + 1) + ' and ' + (imax + 1));
			}
			matrix.swapRows(m, num_pivots, imax);
			if(showSteps) {
				matrix_display(m, 'results');
			}

			//scale row with pivot
			if(showSteps) {
				appendHeading('Scale row ' + (num_pivots + 1) +
					' (divide by the pivot value ' + m[num_pivots][i].toString() + ')');
			}
			matrix.scaleRow(m, num_pivots, m[num_pivots][i].inv());
			if(showSteps) {
				matrix_display(m, 'results');
			}

			//cancel out elements above and below pivot
			for(let j = 0; j < m.length; j += 1) {
				//don't want to cancel out pivot
				if(j === num_pivots) continue;
				if(showSteps) {
					appendHeading('Subtract ' + m[j][i].toString() + ' times row ' +
						(num_pivots + 1) + ' from row ' + (j + 1));
				}
				matrix.addToRow(m, j, num_pivots, m[j][i].neg());
				if(showSteps) {
					matrix_display(m, 'results');
				}
			}
			num_pivots += 1;
		}

		appendHeading('Reduced Row Echelon Form:');
		matrix_display(m, 'results');
	});
});
