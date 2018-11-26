"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var expect = require("../test/expect").clone();
var TreeGenerator = require("./TreeGenerator");
var IntegerGenerator = require("./IntegerGenerator");
var chanceCache = require("./chanceCache");

var countItems = function countItems(tree) {
  return Array.isArray(tree) ? tree.map(countItems).reduce(function (sum, count) {
    return sum + count;
  }, 0) : 1;
};

expect.addAssertion("<array|string> to have size satisfying <assertion>", function (expect, subject) {
  expect.shift(countItems(subject));
});

describe("TreeGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  describe("when given no arguments", function () {
    it("fails", function () {
      expect(function () {
        new TreeGenerator(); // eslint-disable-line no-new
      }, "to throw", "The tree generator requires an item generator as first argument");
    });
  });

  var generator = void 0,
      itemGenerator = void 0;
  describe("when only given a generator for the items", function () {
    beforeEach(function () {
      itemGenerator = new IntegerGenerator({ min: 0, max: 100 });
      generator = new TreeGenerator(itemGenerator);
    });

    it("yields random trees of items generated with the given generator", function () {
      expect(generator, "to yield items", [[80, [96, [18, 73], 78, 60], [[60, 15], 45], 15, 10], [[[84, 94], [21, 0, 18, 100], 18, 62], [[[30, 61], 53, 0, 43], 2, 29, 53], 61, 40, 14, 4, 29, 98], [[[38, 30, [1, 9], [23, 69, 24], 44], 69, [[12, 61], 50], 84, 3], [17, 91], [39, [26, 18, 66], 76], [31, 42], 52, 21], [[[83, 59, 36, 97, 28], [61, 54], [[27, 14], 29], [81, 16], 7], 1, 99, 42]]);
    });

    describe("shrink", function () {
      it("shrinks towards the empty tree", function () {
        expect(generator, "to shrink towards", []);
      });
    });

    describe("expand", function () {
      it("produces a generator that will generate trees similar to the given value", function () {
        var _generator$take = generator.take(1),
            _generator$take2 = _slicedToArray(_generator$take, 1),
            value = _generator$take2[0];

        expect(value, "to equal", [80, [96, [18, 73], 78, 60], [[60, 15], 45], 15, 10]);

        expect(generator.expand(value).take(3), "to equal", [[45, [[15, 96], 43], [80, 60, 60, 18, 78], 73, 10, 15], [60, 96, [18, 73], [10, [15, 15], 45], 45, 80, 78, 60], [15, [[96, [73, 60], 26], 45], 15]]);
      });
    });
  });

  describe("when given a minimum", function () {
    beforeEach(function () {
      generator = new TreeGenerator(new IntegerGenerator({ min: 0, max: 100 }), {
        min: 4
      });
    });

    it("honor the minimum length", function () {
      expect(generator, "to yield items satisfying", "to have size satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("shrink", function () {
      it("shrinks towards the minimum tree", function () {
        expect(generator, "to shrink towards", [[0, 0, 0], 0]);
      });
    });

    describe("expand", function () {
      it("honor the constaints", function () {
        var _generator$take3 = generator.take(1),
            _generator$take4 = _slicedToArray(_generator$take3, 1),
            value = _generator$take4[0];

        expect(generator.expand(value), "to yield items satisfying", "to have size satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });
  });

  describe("when given both a minimum and a maximum", function () {
    beforeEach(function () {
      generator = new TreeGenerator(new IntegerGenerator({ min: 0, max: 100 }), {
        min: 4,
        max: 8
      });
    });

    it("honor the constraints length", function () {
      expect(generator, "to yield items satisfying", "to have size satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("expand", function () {
      it("honor the constaints", function () {
        var _generator$take5 = generator.take(1),
            _generator$take6 = _slicedToArray(_generator$take5, 1),
            value = _generator$take6[0];

        expect(generator.expand(value), "to yield items satisfying", "to have size satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });
  });
});