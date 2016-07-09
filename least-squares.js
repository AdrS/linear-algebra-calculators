window.addEventListener('load', function() {
	function $(id) { return document.getElementById(id); }
	const mic = matrix_input('coef_matrix', {'entry_type':'native'}, 5, 2);
	const miv = matrix_input('val_matrix', {'entry_type':'native'}, 5, 1);
	const rdiv = $('results');

	//keep number of rows in sync
	$('coef_matrix_d1').addEventListener('change', function() {
		miv.setRows(parseInt($('coef_matrix_d1').value));
	});
	$('val_matrix_d1').addEventListener('change', function() {
		mic.setRows(parseInt($('val_matrix_d1').value));
	});
	$('calculate').addEventListener('click', function() {
		const mc = mic.get_matrix();
		const mv = miv.get_matrix();
		const M = matrix;
		if(!mc || !mv) return;
		rdiv.innerHTML = '<h2>Least Squares Solution: X =</h2>';

		//Ax = b => AtAx = Atb => x ~ (AtA)'Atb
		const mct = M.trans(mc);
		const atai = M.inv(M.mult(mct, mc));
		if(atai === undefined) {
			rdiv.style.color = 'red';
			rdiv.style.fontWeight = 'bold';
			rdiv.innerText = 'Error: Redundant data entered';
			return;
		} else {
			rdiv.style.color = 'initial';
			rdiv.style.fontWeight = 'initial';
		}
		const atb = M.mult(mct, mv);

		matrix_display(M.mult(atai,atb), 'results');
	});
});
