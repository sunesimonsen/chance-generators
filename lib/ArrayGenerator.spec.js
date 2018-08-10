"use strict";

var expect = require("../test/expect");
var ArrayGenerator = require("./ArrayGenerator");
var IntegerGenerator = require("./IntegerGenerator");
var ArraySplicerGenerator = require("./ArraySplicerGenerator");
var PicksetGenerator = require("./PicksetGenerator");
var chanceCache = require("./chanceCache");

describe("ArrayGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  describe("when given no arguments", function () {
    it("fails", function () {
      expect(function () {
        new ArrayGenerator(); // eslint-disable-line no-new
      }, "to throw", "The array generator requires an item generator as first argument");
    });
  });

  var generator = void 0,
      itemGenerator = void 0;
  describe("when only given a generator for the items", function () {
    beforeEach(function () {
      itemGenerator = new IntegerGenerator({ min: 0, max: 100 });
      generator = new ArrayGenerator(itemGenerator);
    });

    it("yields random arrays of items generated with the given generator", function () {
      expect(generator, "to yield items", [[80, 96, 18, 73, 78, 60, 60, 15, 45, 15, 10], [46], [33, 60, 14, 71, 65, 2, 5, 97, 72, 84, 94, 21, 0, 18, 100, 18, 62, 30, 61, 53, 0, 43, 2, 29, 53, 61]]);
    });

    describe("shrink", function () {
      it("returns an ArraySplicerGenerator that shrinks towards the empty array", function () {
        expect(generator, "to shrink towards", []);
      });
    });

    describe("expand", function () {
      it("returns a PicksetGenerator using the given data in addition to the item generator", function () {
        expect(generator.expand([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            items: [itemGenerator, 80, 96, 18, 73, 78, 60],
            min: 0,
            max: 30
          }
        }).and("to be an", PicksetGenerator);
      });

      it("produces a generator that will generate arrays similar to the given value", function () {
        expect(generator.expand([80, 96, 18, 73, 78, 60]).take(5), "to equal", [[78, 60, 15, 96, 18, 80, 73], [80, 14, 78, 60, 96, 73, 18], [73, 21, 78, 18, 96, 80, 60], [], [60, 80, 18, 78, 73]]);
      });
    });
  });

  describe("when given a minimum", function () {
    beforeEach(function () {
      generator = new ArrayGenerator(new IntegerGenerator({ min: 0, max: 100 }), {
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

    describe("expand", function () {
      it("honor the constaints", function () {
        expect(generator.expand([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 4,
            max: 30
          }
        });
      });
    });
  });

  describe("when given a maximum", function () {
    beforeEach(function () {
      generator = new ArrayGenerator(new IntegerGenerator({ min: 0, max: 100 }), {
        max: 20
      });
    });

    it("honor the minimum length", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("shrink", function () {
      it("honor the constaints", function () {
        expect(generator.shrink([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 0
          }
        });
      });
    });

    describe("expand", function () {
      it("honor the constaints", function () {
        expect(generator.expand([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 0,
            max: 20
          }
        });
      });
    });
  });

  describe("when given both a minimum and a maximum", function () {
    beforeEach(function () {
      generator = new ArrayGenerator(new IntegerGenerator({ min: 0, max: 100 }), {
        min: 4,
        max: 8
      });
    });

    it("honor the constraints length", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("shrink", function () {
      it("honor the constaints", function () {
        expect(generator.shrink([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 4
          }
        });
      });
    });

    describe("expand", function () {
      it("honor the constaints", function () {
        expect(generator.expand([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 4,
            max: 8
          }
        });
      });
    });
  });
});