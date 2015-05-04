
class TreeTools {

  addIfNew(arr,val) {
    if (val.constructor !== Array) {
      val = [val];
    }

    val.forEach((k) => {
      if (arr.indexOf(k) == -1) {
        arr.push(k);
      }
    });
    return arr;
  }

  findUnits(val) {
    var result = [];
    var keys = Object.keys(val);

    keys.forEach((k)=> {
      var nextVal = val[k];
      if (this.isValidNode(nextVal)) {
        this.addIfNew(result, this.findUnits(nextVal));
      } else {
        this.addIfNew(result,k);
      };
      return result;
    });
    return result;
  }

  isValidNode(node) {
    return !Array.isArray(node) && typeof node === 'object' && typeof node !== undefined    
  }

  pruneSingularCategories(val) {

    // Are the children of the current node "protected" by containing something special?
    var nextCat = Object.keys(val)[0]
    var nextVal = val[nextCat];
    if (!this.isValidNode(nextVal)) {
      return val;
    }

    // Does this value only have one category in it?
    if (Object.keys(val).length == 1) {
      // Does that category only have one value in it?
      if (Object.keys(val[nextCat]).length == 1) {
        // Then prune!
        var nextVal = Object.keys(val[nextCat])[0];
        // Return the value one step lower down the tree (after pruning it)
        return this.pruneSingularCategories(val[nextCat][nextVal]);
      }
    }
    // This value should not be pruned, so we reconstruct it while pruning
    // all it descendant trees
    var result = {};
    Object.keys(val).forEach((subcat) => {
      result[subcat] = {};
      Object.keys(val[subcat]).forEach((subval) => {
        result[subcat][subval] = this.pruneSingularCategories(val[subcat][subval])
      });
    });
    return result;
  }
}
  
module.exports = new TreeTools

// console.info((new TreeTools).findUnits(pruneNone));

