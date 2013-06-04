// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {
  // your code goes here
  // basing this code closely on the curriculum link:
  // oreilly.com/javascript/excerpts/javascript-good-parts/json.html
  // modifying variable names and rewriting in effort
  // to have a better sense of how to build a parser.
  var currIndex,
	  currChar,
	  text,
	  value, //place holder for value function
	  escapee = {
		'"': '"',
		'\\': '\\',
		b: 'b',
		f: '\f',
		n: '\n',
		r: '\r',
		t: '\t'
	  },

	  error = function (m) {
		//function for throwing errors
		throw {
			name: 'SyntaxError',
			message: m,
			currIndex: currIndex,
			text: text
		};
	  },

	  next = function (c) {
		//Get next character in the json string.
		if (c && c !== currChar) {
			error("Expected '" + c + "' instead of '" + currChar + "'");
		}
		currChar = text.charAt(currIndex);
		currIndex += 1;
		return currChar;
	  },
      
	  white = function () {
		//Skip whitespace, one or more spaces
		while (currChar && currChar <= ' ') {
			next();
		}
	  },

	  bools = function () {
		//parse true, false, and null
		switch(currChar) {
			case 't':
				next('t');
				next('r');
				next('u');
				next('e');
				return true;
			case 'f':
				next('f');
				next('a');
				next('l');
				next('s');
				next('e');
				return false;
			case 'n':
				next('n');
				next('u');
				next('l');
				next('l');
				return null;
			}
			error("Unexpected '" + currChar + "'");
		},

	  number = function () {
		//parse number, including exponents, +, -
		var number,
			string = '';
			if (currChar === '-') {
				string += currChar;
				next();
			}
			while (currChar >= '0' && currChar <= '9') {
				string += currChar;
				next();
			}
			if (currChar === '.') {
				string += '.';
				while (next() && currChar >= '0' && currChar <= '9') {
					string += currChar;
				}
			}
			if (currChar ==='e' || currChar === 'E') {
				string += currChar;
				next();
				if (currChar === '-' || currChar === '+') {
					string += currChar;
					next();
				}
				while (currChar >= '0' && currChar <= '9') {
					string += currChar;
					next();
				}
			}
			number = +string;
			if (isNaN(number)) error("Bad number");
			else return number;
	  },

	  string = function () {
		//parse a string. Handles hex, again based closely
		//off example from "Javascript: the Good Parts"
		//seeing if spec will pass without handling hex vals.
		var //hex,
			i,
			string = '',
			uffff;
		if (currChar ==='"') {
			while (next()) {
				if (currChar === '"') {
					next();
					//if (currChar === 'u') {
					//	uffff = 0;
					//	for (i = 0; i < 4; i +=1) {
					//		hex = partInt(next(), 16);
					//		if (!isFinite(hex)) break;
					//		uffff = uffff * 16 + hex;
					//	}
					//	string += String.fromCharCode(uffff);
					} else if (typeof escapee[currChar] === 'string') {
						string += escapee[currChar];
					} else string += currChar;
				}
			}
		}
		error("Bad string");
	  },

	  array = function () {
		//parse an array value.
		var array = [];
		if (currChar === '[') {
			next('[');
			white();
			if (currChar === ']') {
				next(']');
				return array;
			}
			while (currChar) {
				array.push(value()); // defined below
				white();
				if (currChar === ']') {
					next(']');
					return array;
				}
				next(',');
				white();
			}
		}
		error("Bad array");
	  },

	  object = function () {
		var key,
		object = {};
		if (currChar === '{') {
			next('{');
			white();
			if (currChar === '}') {
				next('}');
				return object;
			}
			while (currChar) {
				key = string();
				white();
				next(':');
				object[key] = value();
				white();
				if (currChar === '}') {
					next('}');
					return object;
				}
				next(',');
				white();
			}
		}
		error("Bad object");
	  },

	  value = function () {
	  	//switch to determine which kind of value to parse
	  	white();
	  	switch (currChar) {
	  		case '{':
	  			return object();
	  		case '[':
	  			return array();
	  		case '"':
	  			return string();
	  		case '-':
	  			return number();
	  		default:
	  			return currChar >= '0' && currChar <= '9' ? number () : bools();
	  	}
	  };
	return function (json) {
		//trying to call all helper functions, no reviver
		var result;
		text = json;
		charAt = 0;
		currChar = ' ';
		result = value();
		white();
		if (currChar) {
			error("Syntax error");
		}
		return result;
	}

};
