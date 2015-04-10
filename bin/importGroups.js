
const request = require('request');
const parse = require('csv-parse');
const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');
const parseQueryDimension = require('@bengler/imdi-dataset').parseQueryDimension;

const groupsUrl = "https://docs.google.com/a/bengler.no/spreadsheets/d/1Wm0yF_Rs6VLW9dS_nZgbJrt2ymXEiaFVKBvhUae6lRs"
const outFile = "./data/groups.json"

const csvSuffix = "/export?format=csv"

const importGroups = function(url) {
	url += csvSuffix;
	return new Promise( (resolve, reject) => {
		request(url, (error, response, body) => {
		  if (!error && response.statusCode == 200) {
				parse(body, {comment: '#', columns: true}, (err, output) => {
					resolve(output);
				});
		  } else {
		  	reject(error);
		  }
		})
	});
}

function trim(s) {
	return s ? s.trim() : s;
}

const mungeLine = function(line) {
	line = _.omit(line, (e) => e == '');

	if ('dimensions' in line) {
		line.dimensions = line.dimensions.split(';').map(trim).filter(Boolean).map(parseQueryDimension);
	}

	if ('time' in line) {
		const parsedTime = line.time.split(',').map(trim).filter(Boolean);
		if (parsedTime.length === 1 && !(/^\d+$/.test(parsedTime))) {
			line.time = parsedTime[0];
		}
		else {
			line.time = parsedTime;
		}
	}
	return line
}

const parseGroups = function(lines) {
	let currentGroup = {};
	let groups = []
	lines.forEach( (line) => {
		line = mungeLine(line);
		if (line.groupKind !== undefined && currentGroup.kind != line.groupKind) {
			if (currentGroup.groupKind !== undefined) {
				groups.push(currentGroup);
			}
			currentGroup = {
				groupKind: line.groupKind, 
				title: line.title, 
				items: []
			};
		} else if (Object.keys(line).length > 0 && line.groupKind != "#") { // # in groupKind is skip notation
			currentGroup.items.push(line);
		}
	})
	return groups;
}

console.log("Reading components");
importGroups(groupsUrl).then( (result) => {
	const groupDict = parseGroups(result);
	fs.writeFileSync(outFile, JSON.stringify(groupDict, null, 2));
}).catch( (error) => {
	console.log("Could not fetch: " + error)
});

