// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to have to write it from scratch:
var stringifyJSON = function (obj) {
  // your code goes here
  //
  // I know this code is bad, but I am trying to pass tests
  // in the spec one at a time. Plan to add if statements to
  // determine argument types and stringify appropriately.
  if (typeof obj === 'number') return obj.toString();
  else if (typeof obj === 'boolean') return String(obj);
  else if (typeof obj === 'string') return '"'+obj.toString()+'"';
  else if (typeof obj === 'object' && !obj) return 'null';
  else if (Object.prototype.toString.apply(obj) === 
		  '[object Array]') {
	var stringified = '['
    for (var i = 0; i < obj.length; i++) {
      stringified += '"' + obj[i] + '"'|| 'null';
    }
	stringified += ']'
	return stringified;
  }
}
