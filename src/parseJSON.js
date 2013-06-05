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
			error("Expected '" + c + "' instead of '" + currChar + "' at index " + currIndex + " in " + text);
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
		console.log("Parsing true, false, and null ...")
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

	  digitRange = function (stringnum) {
	  	//Since this was repeated, iterate to see if string digit
	  	arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	  	for (var k = 1; k < 10; k++) {
	  		if (stringnum === '0') return true;
	  		else if (stringnum === arr[k]) return k;
	  	}
	  },

	  number = function () {
		//parse number, including exponents, +, -
		console.log("Parsing number ...")
		var number,
			string = '';
			if (currChar === '-') {
				string = '-';
				next('-');
			}
			while (digitRange(currChar)) {
				string += currChar;
				next();
			}
			if (currChar === '.') {
				string += '.';
				while (next() && digitRange(currChar)) {
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
				while (digitRange(currChar)) {
					string += currChar;
					next();
				}
			}
			
			number = +string;
			if (isNaN(number)) error("Bad number");
			else {return number;}
	  },

	  string = function () {
		//parse a string. Handles hex, again based closely
		//off example from "Javascript: the Good Parts"
		//seeing if spec will pass without handling hex vals.
		console.log("Parsing String...")
		var hex,
			i,
			string = '',
			uffff;
		if (currChar ==='"') {
			while (next()) {
				if (currChar === '"') {
					next();
					return string;
				} else if (currChar === '\\') {
					next();
					if (currChar === 'u') {
						uffff = 0;
						for (i = 0; i < 4; i +=1) {
							hex = parseInt(next(), 16);
							if (!isFinite(hex)) {break;}
							uffff = uffff * 16 + hex;
						}
						string += String.fromCharCode(uffff);
					} else if (typeof escapee[currChar] === 'string') {
						string += escapee[currChar];
					} else {
						break;
					}
				} else {
					string += currChar;
				}
			}
		}
		error("Bad string");
	  },

	  array = function () {
		//parse an array value.
		console.log("Parsing Array ...")
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
	  	console.log ("Parsing object ...")
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
	  };

	  value = function () {
	  	//switch to determine which kind of value to parse
	  	console.log("Determining value type to parse ...")
	  	white();
	  	if (currIndex < json.length) {
	  		switch (currChar) {
	  			case '{': return object();
	  			case '[': return array();
	  			case 't': return bools();
	  			case 'f': return bools();
	  			case 'n': return bools();
	  			case '-': return number();
				case '"': return string();
				//below cases would be better handled by conditional
				//return statement, but basing this off Mozilla's
				//javascript based parse method.
				case '0': return number();
				case '1': return number();
				case '2': return number();
				case '3': return number();
				case '4': return number();
				case '5': return number();
				case '6': return number();
				case '7': return number();
				case '8': return number();
				case '9': return number();
				default: return number();
	    	}
		}
	  };

	var parseThis = function () {
		//trying to call all helper functions, no reviver
		var result;
		text = json;
		currIndex = 0;
		currChar = ' ';
		result = value();
		white();
		/*if (currChar) {
			error("Syntax error");
		}*/
		return result;
	}
	if (json === undefined) {
		error("Cannot parse undefined value");
	}
	return parseThis();

};
