
const treeTools = require("../lib/treeTools");
const mockTrees = require("./mock/mockTrees");

const assert = require("chai").assert;

describe('TreeTools', ()=> {
	describe('#findUnits', ()=> {
		it("locates the right units across tree leaves", ()=> {
			return assert.sameMembers(
				treeTools.findUnits(mockTrees.pruneNone),
				['value', 'value2']);
		});
	});

	describe('#probeDepth', ()=> {
		it("measures the correct trivial depth", ()=> {
			return assert.equal(
				treeTools.probeDepths(mockTrees.pruneNone),
				2);
		});

		it("measures correctly at varying depths", ()=> {
			return assert.deepEqual(
				treeTools.probeDepths(mockTrees.depthMeasure),
				[3,2]);
		});

	});

	describe('#pruneSingularCategories', ()=> {

		it("does not prune when pruning is not warranted. does not mangle data.", ()=> {
			return assert.deepEqual(
				treeTools.pruneSingularCategories(mockTrees.pruneNone),
				mockTrees.pruneNone);
		});

		it("prune at root", ()=> {
			return assert.deepEqual(
				treeTools.pruneSingularCategories(mockTrees.pruneA1),
				mockTrees.pruneA1Result);
		});

		it("prune one deep", ()=> {
			return assert.deepEqual(
				treeTools.pruneSingularCategories(mockTrees.pruneA2),
				mockTrees.pruneA2result);
		});

	});

	describe('#extractChartData', ()=> {

		it("extracts the multidimensional data like it should", ()=> {
			return assert.deepEqual(
				treeTools.extractChartData(mockTrees.pruneNone),
				mockTrees.pruneNoneForChart);
		});

		it("extracts the one dimensional data like it should", ()=> {
			return assert.deepEqual(
				treeTools.extractChartData(mockTrees.pruneA2result),
				mockTrees.pruneA2resultForChart);
		});

		it("extracts time series data like it should", ()=> {
			return assert.deepEqual(
				treeTools.extractChartData(mockTrees.timeSeriesSource),
				mockTrees.timeSeriesChartData);
		});


	});

});
