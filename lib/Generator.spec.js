"use strict";

var expect = require("../test/expect");
var IntegerGenerator = require("./IntegerGenerator");
var chanceCache = require("./chanceCache");

describe("Generator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = new IntegerGenerator({ min: 0, max: 100 });

  describe("toString", function () {
    it("returns the name of the generator", function () {
      expect(generator.toString(), "to equal", "integer");
    });
  });

  describe("map", function () {
    var mapper = function mapper(s) {
      return s.toUpperCase();
    };
    var mapGenerator = generator.map(mapper);

    it("returns a new mapping generator", function () {
      expect(mapGenerator, "to satisfy", {
        generatorName: "map",
        isGenerator: true,
        isMappedGenerator: true
      });
    });
  });

  describe("values", function () {
    it("returns a iterator with a default seed", function () {
      expect(generator.values(), "to satisfy", {
        isGeneratorIterator: true,
        seed: 42
      });
    });

    it("generates values with the default seed", function () {
      var iterator = generator.values();

      expect([iterator.next(), iterator.next(), iterator.next()], "to equal", [37, 80, 96]);
    });

    describe("when given a seed", function () {
      it("returns an iterator with the given seed", function () {
        expect(generator.values({ seed: 666 }), "to satisfy", {
          isGeneratorIterator: true,
          seed: 666
        });
      });

      it("generates values with the given seed", function () {
        var iterator = generator.values({ seed: 666 });

        expect([iterator.next(), iterator.next(), iterator.next()], "to equal", [70, 10, 85]);
      });
    });

    describe("when using a random seed", function () {
      it("uses a random seed for every iterator", function () {
        expect(generator.values({ seed: null }), "to satisfy", {
          isGeneratorIterator: true,
          seed: expect.it("to be a number").and("not to be", 42)
        });
      });
    });
  });

  describe("first", function () {
    it("returns the first item from the generator", function () {
      expect(generator.first(), "to equal", 37);
    });

    it("advances the random values", function () {
      expect(generator.first(), "not to equal", generator.first());
    });

    describe("when given a seed", function () {
      it("generate an item with the given seed", function () {
        expect(generator.first({ seed: 666 }), "to equal", 70);
      });
    });
  });

  describe("take", function () {
    it("fails when given no arguments", function () {
      expect(function () {
        generator.take();
      }, "to throw", "The take method requires a positive number as parameter");
    });

    it("returns the given number of items from the generator", function () {
      expect(generator.take(5), "to equal", [37, 80, 96, 18, 73]);
    });

    it("returns the next n elements produced by the generator", function () {
      expect(generator.take(5), "not to equal", generator.take(5));
    });

    describe("when given a seed", function () {
      it("generates items with the given seed", function () {
        expect(generator.take(5, { seed: 666 }), "to equal", [70, 10, 85, 21, 68]);
      });
    });
  });
});