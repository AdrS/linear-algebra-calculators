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
			const table = $(divid + '_table');
			for(let i = 0; i < table.children.length; i += 1) {
				const row = [];
				const tblrow = table.children[i];
				for(let j = 0; j < tblrow.children.length; j += 1) {
					const val = parse(tblrow.children[j].lastChild.value);
					if(isNaN(val) && typeof val !== 'object') {
						//TODO: highlight invalid entries
						return;
					}
					row[j] = val;
				}
				matrix[i] = row;
			}
			return matrix;
		},
		reset: function() {
			const oldr = r;
			const oldc = c;
			r = c = 0;
			updateEntryInput();
			r = oldr;
			c = oldc;
			updateEntryInput();
		}
	};
}
