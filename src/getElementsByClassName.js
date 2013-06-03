// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But in stead we're going to implement it from scratch:

var getElementsByClassName = function (className) {
  var classList = [];
  function searchForClass (node, className) {
  	//local function to search through childNode list for classname
  	for (var j = 0; j < node.classList['length']; j++) {
        if (node.classList[j] === className) {
            //console.log("Class found:" + document.body.childNodes[i].classList[j] + " IN ELEMENT:")
            //console.log(document.body.childNodes[i])
  	        classList.push(node);
        }
    }
  }
  function iterateThroughNodes (nodes) {
  	  //local function to see if childNode list has classList or
  	  //other childNode lists. Calls recursively if more nodes.
  for (var i = 0; i < nodes.length; i++) {
  	//iterate through child nodes, see if they have a class list
  	  if (nodes[i].classList){
  	  	searchForClass(nodes[i], className);
      }
      if (nodes[i].childNodes) {
      	iterateThroughNodes(nodes[i].childNodes)
      }
    }
  }
  iterateThroughNodes(document.body.childNodes)
  //console.log("ClassList:")
  //console.log(classList);
  return classList;
};
