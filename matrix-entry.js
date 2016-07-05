"use strict"

/*
 * Author: Adrian Stoll
 * Date: 5 July 2016
 *
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

	function entrySetup() {
		//////////////SET UP ENTRY INPUT
		const table = $(divid + '_table');
		table.innerHTML = '';
		//TODO: do not overwrite existing elements unless table is being shrunk

		for(let i = 0; i < r; i += 1) {
			const tr = create('tr');
			for(let j = 0; j < c; j += 1) {
				const td = create('td');
				const input = create('input');

				if(entry_type === 'native') {
					input.type = 'number';
				} else {
					input.type = 'text';
					input.addEventListener('change', function() {
						//onleave (if it exists, might be more appropriate)
						//add validation
					});
				}
				input.value = '0';

				td.appendChild(input);
				tr.appendChild(td);
			}
			table.appendChild(tr);
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
				entrySetup();
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
				entrySetup();
			});
			const d2 = dimInput(divid + '_d2');
			d2.value = c;
			d2.addEventListener('change', function() {
				c = parseInt(this.value);
				entrySetup();
			});
			dc.appendChild(d1);
			d1.insertAdjacentText('afterEnd', ' by ');
			dc.appendChild(d2);
		}
		div.appendChild(dc);

		const table = create('table', divid + '_table');
		div.appendChild(table);
		entrySetup();
	}

	setup();
	return {
		//returns the user entered matrix if valid
		get_matrix: function() {
		},
		reset: function() {
		}
	};
}
