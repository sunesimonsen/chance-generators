"use strict";

var expect = require("../test/expect");
var NumberGenerator = require("./NumberGenerator");
var chanceCache = require("./chanceCache");

describe("NumberGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;

  it("fails if you disable all number categories", function () {
    expect(function () {
      // eslint-disable-next-line no-new
      new NumberGenerator({
        integer: false,
        floating: false,
        infinity: false,
        nan: false
      });
    }, "to throw", "You must include at least one of the options for the number generator: integer, floating, infinity, nan");
  });

  describe("with no options", function () {
    beforeEach(function () {
      generator = new NumberGenerator();
    });

    it("generates floats and integers", function () {
      expect(generator, "to yield items", [5930.8597, -6332, 56, 19, -10.8335, -80.0051, -8.1502, -3326, -72, 30, -88.7177, 3999174336970753, 8771, -99.8443, 98.4424, 23.4963, 2233.0633, -99, -9538.7515, 495.4932]);
    });

    it("only generates finite values", function () {
      expect(generator.take(1000), "to have items satisfying", "to be finite");
    });
  });

  describe("when infinity is true", function () {
    beforeEach(function () {
      generator = new NumberGenerator({ infinity: true });
    });

    it("includes infinite values", function () {
      expect(generator.take(1000), "to contain", Infinity);
    });
  });

  describe("when nan is true", function () {
    beforeEach(function () {
      generator = new NumberGenerator({ nan: true });
    });

    it("includes NaN values", function () {
      expect(generator.take(1000), "to contain", NaN);
    });
  });

  describe("when only integer is enabled", function () {
    beforeEach(function () {
      generator = new NumberGenerator({ floating: false });
    });

    it("only generates integers", function () {
      expect(generator.take(100), "to have items satisfying", "to be an integer");
    });
  });

  describe("when only floating is enabled", function () {
    beforeEach(function () {
      generator = new NumberGenerator({ integer: false });
    });

    it("only generates floats", function () {
      expect(generator.take(100), "to have items satisfying", "not to be an integer");
    });
  });
});