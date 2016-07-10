window.addEventListener('load', function() {
	function $(id) { return document.getElementById(id); }
	const mi = matrix_input('matrix', {'entry_type':'native'});

	//make sure #rows >= #cols
	$('matrix_d1').addEventListener('change', function() {
		let rows = parseInt($('matrix_d1').value);
		let cols = parseInt($('matrix_d2').value);
		if(cols > rows) mi.setCols(rows);
	});
	$('matrix_d2').addEventListener('change', function() {
		let rows = parseInt($('matrix_d1').value);
		let cols = parseInt($('matrix_d2').value);
		if(cols > rows) mi.setRows(cols);
	});
	let rdiv = $('results');
	$('calculate').addEventListener('click', function() {
		const m = mi.get_matrix();
		if(!m) return;
		let factorization = matrix.QR_factorization(m);
		rdiv.innerHTML = '';
		if(factorization === undefined) {
			rdiv.style.color = 'red';
			rdiv.style.fontWeight = 'bold';
			rdiv.innerText = 'Error: columns not linearly independent';
			return;
		} else {
			rdiv.style.fontWeight = rdiv.style.color = 'initial';
		}
		function makeHeader(text) {
			let h = document.createElement('h2');
			h.innerText = text;
			return h;
		}
		rdiv.appendChild(makeHeader('Q:'));
		matrix_display(factorization.Q, 'results');
		rdiv.appendChild(makeHeader('R:'));
		matrix_display(factorization.R, 'results');
	});
});
