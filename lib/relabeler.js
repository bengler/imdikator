const dimensions = require('../data/dimensions.json')

class Relabeler {

	constructor() {

		this.dimensionDict = {};
		dimensions.forEach((d) => {
			let result = {
				description: d.name,
				variables: {}
			}
			d.variables.forEach((d) => {
				result.variables[d.label] = {
					title: d.title,
					comment: d.comment
				}
			})
			this.dimensionDict[d.name] = result;
		})
	}

	lookupCategory(category) {
		let c = this.dimensionDict[category];
		if (c === undefined) {
			console.info("Failed to find category", category);
			return undefined;
		}
		return c;
	}

	lookupCategoryName(category) {
		let c = this.lookupCategory(category)
		if (c === undefined) return category;
		return c.description;
	}

	lookupVariableName(category, variable) {
		let c = this.lookupCategory(category)
		if (c === undefined) return variable;
		let v = c.variables[variable]
		if (v === undefined) {
			console.info("Label missing for variable", variable, "in category", category);
			return variable;
		}
		return v.title;
	}
}

module.exports = new Relabeler;
