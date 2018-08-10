"use strict";

var expect = require("../test/expect");
var ShuffleGenerator = require("./ShuffleGenerator");
var chanceCache = require("./chanceCache");

var _require = require("./index"),
    dollar = _require.dollar,
    integer = _require.integer,
    letter = _require.letter;

describe("ShuffleGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;

  beforeEach(function () {
    generator = new ShuffleGenerator(["a", "b", "c"]);
  });

  describe("when given no arguments", function () {
    it("fails", function () {
      expect(function () {
        new ShuffleGenerator(); // eslint-disable-line no-new
      }, "to throw", "Shuffle require a non-empty array of items");
    });
  });

  it("create arrays by picking subsets of the given items", function () {
    expect(generator, "to yield items", []);
  });

  describe("expand", function () {
    it("pick the given data more often", function () {
      expect(generator.expand(["b", "a", "c"]), "to yield items", [["c", "b", "a"], ["b", "a", "c"], ["b", "a", "c"], ["b", "a", "c"], ["b", "a", "c"]]);
    });
  });

  describe("shrink", function () {
    it("to the given data", function () {
      expect(generator, "to shrink towards", ["b", "c", "a"]);
    });
  });

  describe("when the items contains generators", function () {
    beforeEach(function () {
      generator = new ShuffleGenerator([letter, integer, dollar, 666]);
    });

    it("uses the generators to generator values for the resulting arrays", function () {
      expect(generator, "to yield items", [[4179231256870913, "$7796.91", 666, "p"], ["$999.75", "b", 666, -734106774142975], [666, 3748302344421377, "$6508.89", "a"]]);
    });

    describe("shrink", function () {
      it("shrinks the item generators", function () {
        expect(generator, "to shrink towards", ["$7796.91", 666, "p", 0]);
      });
    });
  });
});