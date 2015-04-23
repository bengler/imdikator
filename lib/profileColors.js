
module.exports = {
	all: ["#f74f3b", "#45aed2", "#9fc04b", "#7551a4"],
	gender: ["#e23939", "#1986e0"],

  colorsToDict(variables, colors) {
	  let result = {};
	  variables.forEach((key, i)=> {
	    result[key] = colors[i];
	  });
	  return result;
	},
}

