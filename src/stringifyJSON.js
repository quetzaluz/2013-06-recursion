// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to have to write it from scratch:
var stringifyJSON = function (obj) {
  // your code goes here
  var stringified;
  if (typeof obj === 'number') return obj.toString();
  else if (typeof obj === 'boolean') return String(obj);
  else if (typeof obj === 'string') return '"'+obj.toString()+'"';
  else if (typeof obj === 'object' && !obj) return 'null';
  else if (Object.prototype.toString.apply(obj) === 
		  '[object Array]') {
	stringified = '['
    for (var i = 0; i < obj.length; i++) {
      //stringified += '"' + obj[i] + '"'|| 'null';
	  stringified += stringifyJSON(obj[i]);
	  if (obj[i] !== obj[obj.length-1]) stringified += ',';
    }
	stringified += ']'
	return stringified;
  }
  else if (typeof obj === 'object') {
    stringified = '{';
    //the following loop would be better done with _.each, but
    //just trying to create this function within this js file
    for (var key in obj) {
      if (typeof obj[key] === 'undefined' || typeof obj[key] === 'function') stringified +='';
      else {
        stringified += stringifyJSON(key) + ':' + stringifyJSON(obj[key]);
        if (obj[key] !== obj[length-1]) stringified += ','
        }
    }
  //Had trouble detecting last element using "key in obj", so:
  if (stringified.length > 2) stringified = stringified.slice(0, stringified.length-1)
  stringified += '}';
  return stringified;
  }
}
