window.addEventListener('load', function() {
	function $(id) { return document.getElementById(id); }
	const mi = matrix_input('matrix', {'entry_type':'complex'});
	//creates header with text
	//if text is null, then creates header using the elements of parts
	//that are of the form {'text':_, 'color':_}
	function appendHeading(text, parts) {
		const header = document.createElement('h2');
		if(text) {
			header.innerText = text;
		} else {
			for(let i = 0; i < parts.length; i += 1) {
				const p = document.createElement('span');
				p.innerText = parts[i].text;
				if(parts[i].color) {
					p.style.color = parts[i].color;
				}
				header.appendChild(p);
			}
		}
		$('results').appendChild(header);
	}
	$('calculate').addEventListener('click', function() {
		//const m = [[number.Real(0), number.Complex(2,-5), number.Rational(17,3)], [number.Real(13), number.Real(8), number.Real(-13)], [number.Real(-1), number.Complex(0,-1), number.Real(11)]];
		const m = mi.get_matrix();
		if(!m) return;
		$('results').innerHTML = '';

		//Don't show steps
		if(!$('show_steps').checked) {
			appendHeading('Reduced Row Echelon Form:');
			matrix.rref(m);
			matrix_display(m, 'results');
			return;
		}

		/////Otherwise, show steps
		function swapRows(i,j) {
			appendHeading(null, [
				{'text':'Swap '},
				{'text': 'row ' + (i + 1), 'color':'red'},
				{'text': ' with '},
				{'text': 'row ' + (j + 1), 'color': 'blue'}]);
			let mat = matrix_display(m, 'results');
			mat.highlightRow(i, 'red');
			mat.highlightRow(j, 'blue');

			matrix.swapRows(m, i, j);
		}

		function scaleRow(row, pivcol) {
			appendHeading(null, [
				{'text': 'Scale '},
				{'text': 'row ' + (row + 1), 'color':'blue'},
				{'text': ' (divide by pivot value '},
				{'text': m[row][pivcol].toString(), 'color':'green'},
				{'text': ')'}]);
			let mat = matrix_display(m, 'results');
			mat.highlightRow(row, 'blue');
			mat.highlightCell(row, pivcol, 'green', true);

			matrix.scaleRow(m, row, m[row][pivcol].inv());
		}
		
		function subtractFromRow(pRow, pCol, row) {
			appendHeading(null, [
				{'text':'Subtract ' + m[row][pCol].toString() + ' times '},
				{'text': 'row ' + (pRow + 1).toString(), 'color': 'blue'},
				{'text': ' from '},
				{'text': 'row ' + (row + 1).toString(), 'color': 'red'}]);
			let mat = matrix_display(m, 'results');
			mat.highlightRow(row, 'red');
			mat.highlightRow(pRow, 'blue');
			matrix.addToRow(m, row, pRow, m[row][pCol].neg());
		}


		let num_pivots = 0;

		const max_pivots = Math.min(m.length, m[0].length);
		for(let i = 0; i < max_pivots; i += 1) {
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

			//make make upper row be one with the pivot
			if(imax !== num_pivots) swapRows(num_pivots, imax);

			//scale row with pivot
			scaleRow(num_pivots, i);

			//cancel out elements above and below pivot
			for(let j = 0; j < m.length; j += 1) {
				//don't want to cancel out pivot row or already cancelled out rows
				if(j === num_pivots || m[j][i].isZero()) continue;
				subtractFromRow(num_pivots, i , j);
			}
			num_pivots += 1;
		}

		appendHeading('Reduced Row Echelon Form:');
		matrix_display(m, 'results');
	});
});
