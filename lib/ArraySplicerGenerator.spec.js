"use strict";

var expect = require("../test/expect");
var ArraySplicerGenerator = require("./ArraySplicerGenerator");
var chanceCache = require("./chanceCache");

describe("ArraySplicerGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;
  describe("when no minimum is given", function () {
    beforeEach(function () {
      generator = new ArraySplicerGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("generates arrays that is the result of splicing out parts of the given array", function () {
      expect(generator, "to yield items", [[0, 1, 2, 3, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 8, 9], [0, 5, 6, 7, 8, 9]]);
    });

    describe("shrink", function () {
      it("shrink towards the empty array", function () {
        expect(generator, "to shrink towards", []);
      });
    });

    describe("expand", function () {
      it("picks the expanded value more often", function () {
        expect(generator.expand([6, 6, 6]), "to yield items", [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [6, 6, 6], [6, 6, 6], [0, 1, 2, 3, 5, 6, 7, 8, 9]]);
      });
    });
  });

  describe("with a given minimum", function () {
    beforeEach(function () {
      generator = new ArraySplicerGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
        min: 5
      });
    });

    it("generates arrays that is the result of splicing out parts of the given array", function () {
      expect(generator, "to yield items", [[0, 1, 2, 3, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 8, 9], [0, 3, 4, 5, 6, 7, 8, 9]]);
    });

    describe("shrink", function () {
      it("shrink towards an array with the minimum allowed length", function () {
        expect(generator, "to shrink towards", [0, 1, 2, 3, 8]);
      });
    });

    describe("expand", function () {
      it("picks the expanded value more often", function () {
        expect(generator.expand([6, 6, 6, 6, 6]), "to yield items", [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [6, 6, 6, 6, 6], [6, 6, 6, 6, 6], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]);
      });
    });
  });
});