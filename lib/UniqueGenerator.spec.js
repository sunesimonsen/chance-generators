"use strict";

var expect = require("../test/expect");
var UniqueGenerator = require("./UniqueGenerator");
var IntegerGenerator = require("./IntegerGenerator");
var ArraySplicerGenerator = require("./ArraySplicerGenerator");
var ShapeGenerator = require("./ShapeGenerator");
var chanceCache = require("./chanceCache");

describe("UniqueGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;
  describe("when only given a generator for the items", function () {
    beforeEach(function () {
      generator = new UniqueGenerator(new IntegerGenerator({ min: 0, max: 100 }));
    });

    describe("when given no arguments", function () {
      it("fails", function () {
        expect(function () {
          new UniqueGenerator(); // eslint-disable-line no-new
        }, "to throw", "The unique generator requires an item generator as first argument");
      });
    });

    it("yields random arrays of unique items generated with the given generator", function () {
      expect(generator, "to yield items", [[80, 96, 18, 73, 78, 60, 15], [15, 10, 5, 46, 87, 33, 60, 14, 71], [2, 5, 97, 72, 84, 94, 21, 0, 18, 100, 62, 30, 61]]);
    });

    describe("shrink", function () {
      it("returns an ArraySplicerGenerator that shrinks towards the empty array", function () {
        expect(generator.shrink([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 0
          }
        }).and("to be an", ArraySplicerGenerator);
      });
    });
  });

  describe("when given a minimum", function () {
    beforeEach(function () {
      generator = new UniqueGenerator(new IntegerGenerator({ min: 0, max: 100 }), {
        min: 4
      });
    });

    it("honor the minimum length", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("shrink", function () {
      it("returns an ArraySplicerGenerator that shrinks towards the minimum size array", function () {
        expect(generator.shrink([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 4
          }
        }).and("to be an", ArraySplicerGenerator);
      });
    });
  });

  describe("when given a maximum", function () {
    beforeEach(function () {
      generator = new UniqueGenerator(new IntegerGenerator({ min: 0, max: 100 }), {
        max: 20
      });
    });

    it("honor the minimum length", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });
  });

  describe("when given a comparator", function () {
    it("uses the comparator to decide if items has been seen before", function () {
      var coordinate = new ShapeGenerator({
        x: new IntegerGenerator({ min: -10, max: 10 }),
        y: new IntegerGenerator({ min: -10, max: 10 })
      });

      var uniqueCoordinates = new UniqueGenerator(coordinate, {
        comparator: function comparator(coordinates, _ref) {
          var x = _ref.x,
              y = _ref.y;
          return coordinates.some(function (c) {
            return c.x === x || c.y === y;
          });
        }
      });

      expect(uniqueCoordinates, "to yield items", [[{ x: 6, y: 9 }, { x: -7, y: 5 }, { x: 2, y: -7 }, { x: -8, y: -9 }, { x: -1, y: 8 }, { x: -3, y: 2 }, { x: 3, y: -10 }], [{ x: 10, y: 5 }], [{ x: 9, y: -6 }, { x: -10, y: -7 }, { x: 2, y: -4 }, { x: 1, y: 2 }, { x: -2, y: -8 }, { x: 10, y: -3 }, { x: -6, y: -1 }, { x: -9, y: 6 }, { x: -1, y: -10 }, { x: -7, y: 9 }, { x: -4, y: -9 }, { x: 7, y: -2 }, { x: 5, y: -5 }, { x: 4, y: 5 }, { x: -5, y: 8 }, { x: 8, y: 3 }, { x: 6, y: 7 }], [{ x: -4, y: 0 }, { x: -7, y: 4 }, { x: -10, y: 8 }], [{ x: -4, y: 4 }, { x: -6, y: -10 }, { x: 4, y: 0 }, { x: 6, y: -6 }, { x: -3, y: 3 }, { x: -8, y: -7 }, { x: -2, y: -2 }, { x: 0, y: 9 }, { x: 7, y: -8 }, { x: 1, y: 8 }, { x: -7, y: 7 }, { x: 10, y: 1 }]]);
    });
  });
});