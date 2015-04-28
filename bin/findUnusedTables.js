console.info("Om nom nom");

const dotty = require("dotty");
const groups = require('../data/groups.json');
const tableMetadata = require('../data/tables.json');
const data = require('../node_modules/@bengler/imdi-dataset/out/tree.json');

let tablesInUse = [];

let tableMetaDict = tableMetadata.reduce( ((p,n)=> {
	p[n.label] = n;
	return p;
}), {});

groups.forEach((g) => {
	g.items.forEach((t) => {
		tablesInUse[t.table] = t;
	})
});

const allTables = Object.keys(data);
let outstandingTables = allTables.filter((t)=> {
	return !tablesInUse[t];
});

console.info("Tables not in use");
console.info(outstandingTables);
console.info("----")

// outstandingTables = [outstandingTables[4]];

let tableDescriptions = [];

outstandingTables.forEach((tableName) => {

	let table = data[tableName];
	let tableDimensions = deletePlaceNames(byFirstKey(byFirstKey(table)));

	let variables = [];
	searchTable(tableDimensions, variables, 0);

	// innvkat_3:alle; utd_4: grunnskole, vgs, universitet_og_hogskole, uoppgitt_ingen; kjonn:0,1

	let specString = variables.map( (v) => {
		return v.label + ":" + v.include.join(",");
	}).join(";")

	let metaLookup = tableMetaDict[tableName];
	let meta = {};
	if (metaLookup) {
		meta.name = metaLookup.name;
		meta.descripton = metaLookup.descripton;
		meta.category = metaLookup.category;
	} else {
		console.info("Coult not find metadata for " + tableName);
	}

	tableDescriptions.push({
		table: tableName,
		specString: specString,
		meta: meta
	})

});

console.info(tableDescriptions);


function searchTable(tableDimensions, variables, level) {
	if (typeof tableDimensions === "string") {
		return
	}

	let spec = variables[level];
	if (spec === undefined) {
		spec = variables[level] = {
			label: "",
			include: []
		}		
	}

	spec.label = Object.keys(tableDimensions)[0]
	let categories = Object.keys(tableDimensions[spec.label])

	// spec.include = spec.include.concat(categories);
	spec.include = categories;

	variables[level] = spec;

	categories.forEach((c)=> {
		searchTable(tableDimensions[spec.label][c], variables, level + 1);
	});
}

function deletePlaceNames(obj) {
	const deleteMe = ["bydel_nr", "fylke_nr", "fylke_navn", "kommune_nr", "Kommune_navn"];
	deleteMe.forEach((d)=> delete obj[d]);
	return obj;
}

function byFirstKey(tree) {
	return tree[Object.keys(tree)[0]];
}
