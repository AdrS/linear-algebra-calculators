"use strict"

/*
 * Author: Adrian Stoll
 * Date: 5 July 2016
 * Requires: number.js
 */

	function $(id) { return document.getElementById(id); }
	function create(type, id) {
		const el = document.createElement(type);
		if(id) el.id = id;
		return el;
	}
var matrix_input = function(divid, options, r, c) {
	//set default options
	options = options || {};
	const entry_type = options.entry_type || 'complex'; //native|real|complex
	const dim_type = options.dim_type || 'any'; //any|square|fixed
	r = r || 3;
	c = c || 3;
	if(dim_type === 'square') c = r;

	//validate settings
	if(r < 1 || c < 1 ||
		['native','real','complex'].indexOf(entry_type) < 0 ||
		['any','square','fixed'].indexOf(dim_type) < 0) {
		console.error("invalid options");
		return;
	}

	function dimInput(id) {
		const d = create('input',id);
		d.type = 'number';
		d.step = '1';
		d.min = '1';
		return d;
	}

	function updateEntryInput() {
		function newEntry() {
				const td = create('td');
				const input = create('input');

				if(entry_type === 'native') {
					input.type = 'number';
				} else {
					input.type = 'text';
					input.addEventListener('change', function() {
						//TODO: add validation?
					});
				}
				input.value = '0';
				td.appendChild(input);
				return td;
		}
		//////////////SET UP ENTRY INPUT
		const table = $(divid + '_table');
		const old_rows = table.children.length;

		//get rid of excess rows (if any)
		while(table.children.length > r) table.removeChild(table.lastChild);

		//add new rows
		while(table.children.length < r) {
			//add row
			const tr = create('tr');
			for(let j = 0; j < c; j += 1) tr.appendChild(newEntry());
			table.appendChild(tr);
		}

		//make the number of columns in the original rows match the new ones
		for(let i = 0; i < Math.min(old_rows,r); i += 1) {
			const row = table.children[i];
			//get rid of excess entries
			while(row.children.length > c) row.removeChild(row.lastChild);
			//add missing entries
			while(row.children.length < c) row.appendChild(newEntry());
		}
	}

	function setup() {
		//clear previous contents
		const div = $(divid);
		div.innerHTML = '';

		//////////////SET UP DIMENSION DISPLAY/INPUT
		const dc = document.createElement('div');
		dc.innerText = 'Dimensions:';

		//dimension input for square matrix
		if(dim_type === 'square') {
			const d1 = dimInput(divid + '_d1');
			d1.value = r;
			d1.addEventListener('change', function() {
				//update second dimension
				$(divid + '_d2').innerText = this.value;
				r = c = parseInt(this.value);
				updateEntryInput();
			});
			const d2 = create('span', divid + '_d2');
			d2.innerText = r.toString();
			dc.appendChild(d1);
			d1.insertAdjacentText('afterEnd', ' by ');
			dc.appendChild(d2);
		} else if(dim_type === 'fixed') {
			dc.innerText += ' ' + r + ' by ' + c;
		//dimension input for arbitrary
		} else {
			const d1 = dimInput(divid + '_d1');
			d1.value = r;
			d1.addEventListener('change', function() {
				r = parseInt(this.value);
				updateEntryInput();
			});
			const d2 = dimInput(divid + '_d2');
			d2.value = c;
			d2.addEventListener('change', function() {
				c = parseInt(this.value);
				updateEntryInput();
			});
			dc.appendChild(d1);
			d1.insertAdjacentText('afterEnd', ' by ');
			dc.appendChild(d2);
		}
		div.appendChild(dc);

		const table = create('table', divid + '_table');
		div.appendChild(table);
		updateEntryInput();
		//TODO: add reset button
	}

	setup();
	return {
		//returns the user entered matrix if valid
		get_matrix: function() {
			function parse(s) {
				//TODO: parseFloat('123abc') -> 123 is not desirable
				const n = Number.parseFloat(s);
				return isNaN(n) ? undefined : n;
			}
			if(entry_type === 'real') {
				var parse = number.parseReal;
			} else if(entry_type === 'complex') {
				var parse = number.parseComplex;
			}
			const matrix = [];
			let valid = true;
			const table = $(divid + '_table');
			for(let i = 0; i < table.children.length; i += 1) {
				const row = [];
				const tblrow = table.children[i];
				for(let j = 0; j < tblrow.children.length; j += 1) {
					const el = tblrow.children[j].lastChild;
					const val = parse(el.value);
					if(isNaN(val) && typeof val !== 'object') {
						el.style.borderColor = 'red';
						valid = false;
					} else {
						el.style.borderColor = 'initial';
					}
					row[j] = val;
				}
				matrix[i] = row;
			}
			if(valid) return matrix;
		},
		reset: function() {
			const oldr = r;
			const oldc = c;
			r = c = 0;
			updateEntryInput();
			r = oldr;
			c = oldc;
			updateEntryInput();
		},
		update: function() {
			r = parseInt($(divid + '_d1').value);
			c = parseInt($(divid + '_d2').value);
			updateEntryInput();
		}
	};
}
var matrix_display = function(matrix, divid) {
	//set up matrix
	const table = create('table');
	table.style.border = '1px solid';
	table.style['text-align'] = 'right';

	for(let i = 0; i < matrix.length; i += 1) {
		const row = create('tr');
		for(let j = 0; j < matrix[i].length; j += 1) {
			const el = create('td');
			el.style.padding = '10px';
			el.innerText = matrix[i][j].toString();
			row.appendChild(el);
		}
		table.appendChild(row);
	}
	$(divid).appendChild(table);

	return {
		remove: function() {
			table.remove();
		},
		highlightCell: function(row, col, color, border) {
			const el = table.children[row].children[col];
			if(border) el.style.border = '1px solid ' + color;
			else el.style.color = color;
		},
		highlightRow: function(row, color) {
			for(let i = 0; i < matrix[row].length; i += 1) {
				this.highlightCell(row, i, color);
			}
		},
		highlightCol: function(col, color) {
			for(let i = 0; i < matrix.length; i += 1) {
				this.highlightCell(i, col, color);
			}
		},
		clearHighlights: function() {
			//TODO: write apply to table function
			for(let i = 0; i < table.children.length; i += 1) {
				const row = table.children[i];
				for(let j = 0; j < row.children.length; j += 1) {
					row.children[j].style.color = row.children[j].style.border = 'initial';
				}
			}
		}
	};
}
//TODO: add functions for exporting/importing as latex, python array, matlab data file, ...
