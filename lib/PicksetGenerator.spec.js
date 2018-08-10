"use strict";

var expect = require("../test/expect");
var PicksetGenerator = require("./PicksetGenerator");
var IntegerGenerator = require("./IntegerGenerator");
var chanceCache = require("./chanceCache");

describe("PicksetGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;

  describe("when given no limits", function () {
    beforeEach(function () {
      generator = new PicksetGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    describe("when given no arguments", function () {
      it("fails", function () {
        expect(function () {
          new PicksetGenerator(); // eslint-disable-line no-new
        }, "to throw", "Pickset require a non-empty array of items");
      });
    });

    it("create arrays by picking subsets of the given items", function () {
      expect(generator, "to yield items", [[7, 8, 1, 5], [0], [8, 3, 4, 1, 7]]);
    });

    describe("shrink", function () {
      it("shrinks towards the empty array", function () {
        expect(generator, "to shrink towards", []);
      });
    });

    describe("expand", function () {
      it("expands the given data", function () {
        expect(generator.expand([7, 9, 1, 6]), "to yield items", [[7, 9, 1, 6], [7, 7, 1, 6], [2, 0, 7, 9, 1, 6, 5, 4], [7, 9, 1, 6], [6, 1, 7, 9, 1, 6, 8, 0], [9, 5, 7, 9, 1, 6, 4, 3], [7, 9, 1, 6], [7, 9, 1, 6, 8, 2], [7, 9, 1, 6, 3], [3, 8, 9, 1, 6, 1]]);
      });
    });
  });

  describe("when given a minimum", function () {
    beforeEach(function () {
      generator = new PicksetGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
        min: 3
      });
    });

    it("create arrays by picking subsets larger than or equal to the given minimum size", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("shrink", function () {
      it("shrinks towards an array of minimum length", function () {
        expect(generator, "to shrink towards", [1, 8, 7]);
      });
    });

    describe("expand", function () {
      it("honor the constraints", function () {
        expect(generator.expand([7, 9, 1, 6]), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });
  });

  describe("when given a maximum", function () {
    beforeEach(function () {
      generator = new PicksetGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
        max: 6
      });
    });

    it("create arrays by picking subsets that is less than or equal to given maximum size", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("expand", function () {
      it("honor the constraints", function () {
        expect(generator.expand([7, 9, 1, 6]), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });
  });

  describe("when given a minimum and a maximum", function () {
    beforeEach(function () {
      generator = new PicksetGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
        min: 3,
        max: 6
      });
    });

    it("create arrays by picking subsets that within the minimum and maximum sizes", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("expand", function () {
      it("honor the constraints", function () {
        expect(generator.expand([7, 9, 1, 6]), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });
  });

  describe("when the items contains generators", function () {
    var itemGenerator = new IntegerGenerator({ min: 0, max: 100 });

    beforeEach(function () {
      generator = new PicksetGenerator([itemGenerator, itemGenerator, itemGenerator, itemGenerator]);
    });

    it("uses the generators to generator values for the resulting arrays", function () {
      expect(generator, "to yield items", [[96], [], [45, 15, 10]]);
    });

    describe("and has a minimum", function () {
      beforeEach(function () {
        generator = new PicksetGenerator([itemGenerator, itemGenerator, itemGenerator, itemGenerator, itemGenerator, itemGenerator], { min: 3 });
      });

      describe("shrink", function () {
        it("shrinks towards an array of minimum length and minimum items", function () {
          expect(generator, "to shrink towards", [0, 0, 0]);
        });
      });

      describe("expand", function () {
        it("uses the generators", function () {
          expect(generator.expand([7, 9, 1, 6]), "to yield items", [[7, 9, 1, 6], [84, 9, 1, 6], [7, 9, 1, 6], [7, 9, 1, 68], [7, 9, 1, 6], [52, 9, 1, 6], [7, 9, 1, 6, 52], [7, 27, 1, 6], [7, 9, 1, 6], [7, 9, 1, 6]]);
        });

        it("honor the constraints", function () {
          expect(generator.expand([7, 9, 1, 6]), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
        });
      });
    });
  });
});