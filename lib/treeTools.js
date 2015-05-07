
const relabeler = require("./relabeler");

// TODO: DRY up recursions

class TreeTools {

  extractChartData(val) {

    let result = [];

    // Brute force fun!
    let depths = this.probeDepths(val);

    if (depths.length == 1) {
      let depth = depths[0];

      if (depth == 2) {

        let firstCategory = this.getCategoryName(val);
        let firstValues = this.getCategoryVariableKeys(val);

        result.push({
          category: firstCategory,
          values: firstValues
        });

        let chartData = {};

        firstValues.forEach((k)=> {

          let currentNode = val[firstCategory][k];

          let secondCategory = this.getCategoryName(currentNode);
          let secondValues = this.getCategoryVariableKeys(currentNode);

          chartData.category = secondCategory;
          chartData.values = secondValues;
          if (chartData.data === undefined) chartData.data = {};

          secondValues.forEach((k2) => {
            let innermostNode = currentNode[secondCategory][k2];
            let units = Object.keys(innermostNode);

            // TODO: Totally dry up this
            units.forEach((u)=> {
              if (chartData.data[u] === undefined) chartData.data[u] = {};
              if (chartData.data[u][k2] === undefined) chartData.data[u][k2] = [];

              let value = innermostNode[u];
              if (value.length == 1) value = value[0];
              chartData.data[u][k2].push(value)
            })
          })
        })
        result.unshift(chartData);

      } else if (depth == 1) {

        let firstCategory = this.getCategoryName(val);
        let firstValues = this.getCategoryVariableKeys(val);

        let data = {};

        firstValues.forEach((k)=> {

            let innermostNode = val[firstCategory][k];
            let units = Object.keys(innermostNode);

            units.forEach((u)=> {
              if (data[u] === undefined) data[u] = {};
              if (data[u][k] === undefined) data[u][k] = [];

              let value = innermostNode[u];
              data[u][k] = value;

            })
        });

        result.push({
          category: firstCategory,
          values: firstValues,  
          data: data
        });

      } else {
        console.info("Depth not 1 or two. Is invalid!");
      }

    } else {
      console.info("We have an unbalanced tree.", val);
    }
    return result;
  }  

  getCategoryName(val) {
    return Object.keys(val)[0];
  }

  getCategory(val) {
    return val[Object.keys(val)[0]];
  }

  getCategoryVariableKeys(val) {
    return Object.keys(this.getCategory(val));
  }

  relabelTree(val, callback) {

    let nextCat = Object.keys(val)[0]
    let nextVal = val[nextCat];
    let nextValKeys = Object.keys(nextVal)

    if (!this.isValidNode(nextVal)) {
      return val;
    }

    let result = {}

    let newCategoryName = relabeler.lookupCategoryName(nextCat);
    result[newCategoryName] = {};
    nextValKeys.forEach((k)=> {
      let newValName = relabeler.lookupVariableName(nextCat, k);
      result[newCategoryName][newValName] = this.relabelTree(nextVal[k]);
    }) 

    return result;
  }

  probeDepths(val, depth) {
    var result = [];
    if (depth === undefined) depth = 0;

    var keys = Object.keys(val);
    keys.forEach((k)=> {
      var nextVal = val[k];
      if (this.isValidNode(nextVal)) {
        this.addIfNew(result, this.probeDepths(nextVal, depth + 1));
      } else {
        this.addIfNew(result,depth / 2);
      };
    });
    return result;
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
    });
    return result;
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

  isValidNode(node) {
    return !Array.isArray(node) && typeof node === 'object' && typeof node !== undefined    
  }

}
  
module.exports = new TreeTools;
