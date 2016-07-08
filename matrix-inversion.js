window.addEventListener('load', function() {
	function $(id) { return document.getElementById(id); }
	const mi = matrix_input('matrix', {'entry_type':'complex', 'dim_type':'square'});
	$('calculate').addEventListener('click', function() {
		const m = mi.get_matrix();
		if(!m) return;
		$('results').innerHTML = '';

		const m_inv = matrix.inv(m);
		if(!m_inv) $('results').innerHTML = 'Matrix is singular';
		else matrix_display(m_inv, 'results');
	});
});
