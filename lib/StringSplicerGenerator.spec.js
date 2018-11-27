"use strict";

var expect = require("../test/expect");
var StringSplicerGenerator = require("./StringSplicerGenerator");
var chanceCache = require("./chanceCache");

describe("StringSplicerGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  describe("when given no arguments", function () {
    it("fails", function () {
      expect(function () {
        new StringSplicerGenerator(); // eslint-disable-line no-new
      }, "to throw", "The string splicer generator requires a string as first argument");
    });
  });

  var generator = void 0;
  describe("without a given minimum", function () {
    beforeEach(function () {
      generator = new StringSplicerGenerator("foobarbaz");
    });

    it("generates strings that is the result of splicing out parts of the given text", function () {
      expect(generator, "to yield items", ["fooz", "foobarbaz", "foobarb", "foobaaz", "frbaz", "foobarbaz", "arbaz", "foobarbaz"]);
    });

    describe("shrink", function () {
      it("shrinks towards the empty string", function () {
        expect(generator, "to shrink towards", "");
      });
    });

    describe("expand", function () {
      it("picks the expanded value more often", function () {
        expect(generator.expand("frbaz"), "to yield items", ["foobarb", "foobarb", "frbaz", "frbaz", "foobarbaz", "arbaz", "frbaz", "foobarbaz"]);
      });
    });
  });

  describe("with a given minimum", function () {
    beforeEach(function () {
      generator = new StringSplicerGenerator("foobarbaz", { min: 6 });
    });

    it("generates strings that is the result of splicing out parts of the given text", function () {
      expect(generator, "to yield items", ["foobaz", "foobarbaz", "foobarb", "foobaaz", "fobarbaz", "foobarbaz", "oobarbaz"]);
    });

    describe("shrink", function () {
      it("shrinks towards the minimum allowed length", function () {
        expect(generator, "to shrink towards", "foobaz");
      });
    });

    describe("expand", function () {
      it("picks the expanded value more often", function () {
        expect(generator.expand("foobaz"), "to yield items", ["foobarb", "foobarb", "foobaz", "foobaz", "foobarbaz", "oobarbaz", "foobaz", "foobarbaz"]);
      });
    });
  });
});