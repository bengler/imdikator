
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
});
