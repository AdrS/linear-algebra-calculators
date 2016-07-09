window.addEventListener('load', function() {
	function $(id) { return document.getElementById(id); }
	const mi1 = matrix_input('matrix1', {'entry_type':'complex'});
	const mi2 = matrix_input('matrix2', {'entry_type':'complex'});

	//keep dimensions synced
	$('matrix1_d2').addEventListener('change', function() {
			mi2.setRows(parseInt($('matrix1_d2').value));
	});
	$('matrix2_d1').addEventListener('change', function() {
			mi1.setCols(parseInt($('matrix2_d1').value));
	});
	$('calculate').addEventListener('click', function() {
		const m1 = mi1.get_matrix();
		const m2 = mi2.get_matrix();
		if(!m1 || !m2) return;
		$('results').innerHTML = '<h2>Matrix AB</h2>';
		matrix_display(matrix.mult(m1, m2), 'results');
	});
});
