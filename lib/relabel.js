
const dimensions = require('../data/dimensions.json')

class Relabeler {

	constructor() {

		this.dimensionDict = {};
		dimensions.forEach((d) => {

			result = {
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

	relabel(category, variable) {
		return this.dimensionDict[category][variable];
	}

}

module.exports = new Relabeler;
