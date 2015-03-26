
var request = require('request');
var parse = require('csv-parse');
var bluebird = require('csv-parse');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');

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

const mungeLine = function(line) {
	line = _.omit(line, (e) => e == '');

	// Do not convert time to array if only a single word!
	const splitFields = ["dimensions", "skip", "time"];
	splitFields.forEach( (e) => {
		if (e in line) { 
			line[e] = line[e].split(',');
			line[e] = line[e].map( (e) => _.trim(e));
		}
	});

	return line
}

const splitAndTrim = function(line) {

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
	fs.writeFileSync(outFile, JSON.stringify(groupDict));
}).catch( (error) => {
	console.log("Could not fetch: " + error)
});

