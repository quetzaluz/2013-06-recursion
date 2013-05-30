// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to have to write it from scratch:
var stringifyJSON = function (obj) {
  // your code goes here
  //
  // I know this code is bad, but I am trying to pass tests
  // in the spec one at a time. Plan to add if statements to
  // determine argument types and stringify appropriately.
  var stringified;
  if (typeof obj === 'number') {
    stringified = obj.toString();
  }
  if (typeof obj === 'boolean' || 'null') {
    stringified = String(obj);
  }
  else {
    for (var i = 0; i < obj.length; i++) {
      stringified += obj[i]
    }
  }
  return stringified;
}
