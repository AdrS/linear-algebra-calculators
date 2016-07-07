window.addEventListener('load', function() {
	function $(id) { return document.getElementById(id); }
	const mi = matrix_input('matrix', {'entry_type':'complex', 'dim_type':'square'});

	$('calculate').addEventListener('click', function() {
		//const m = [[number.Real(0), number.Complex(2,-5), number.Rational(17,3)], [number.Real(13), number.Real(8), number.Real(-13)], [number.Real(-1), number.Complex(0,-1), number.Real(11)]];
		const m = mi.get_matrix();
		if(!m) return;
		$('results').innerHTML = matrix.det(m).toString();
	});
});
