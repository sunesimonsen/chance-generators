"use strict";

var expect = require("../test/expect");
var PickoneGenerator = require("./PickoneGenerator");
var ConstantGenerator = require("./ConstantGenerator");
var IntegerGenerator = require("./IntegerGenerator");
var StringGenerator = require("./StringGenerator");
var chanceCache = require("./chanceCache");

describe("PickoneGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;
  beforeEach(function () {
    generator = new PickoneGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  describe("when given no arguments", function () {
    it("fails", function () {
      expect(function () {
        new PickoneGenerator(); // eslint-disable-line no-new
      }, "to throw", "Pickone require a non-empty array of items");
    });
  });

  it("generates items by random picking them from an array", function () {
    expect(generator, "to yield items", [3, 7, 9, 1, 7]);
  });

  describe("shrink", function () {
    it("returns a constant generator with the given value", function () {
      expect(generator.shrink(5), "to satisfy", { options: { value: 5 } }).and("to be a", ConstantGenerator);
    });
  });

  describe("expand", function () {
    it("returns a new generator that is more likely to pick the given item", function () {
      expect(generator.expand(5), "to yield items", [7, 5, 7, 5, 5, 5, 4, 0]);
    });
  });

  describe("when the items contains generators", function () {
    beforeEach(function () {
      generator = new PickoneGenerator([new IntegerGenerator({ min: 0, max: 100 }), new StringGenerator()]);
    });

    it("generates items by random picking a generator and use that to generate the next value", function () {
      expect(generator, "to yield items", [80, "5SSlG", 10, 46, "k0Wbe)19*p", 18]);
    });

    describe("shrink", function () {
      it("returns the shrunken generator that it was given", function () {
        var value = generator.first();
        expect(generator.shrink(value), "to satisfy", {
          generatorName: "integer",
          options: { min: 0, max: 80 }
        });
      });
    });

    describe("expand", function () {
      it("returns a new generator that is more likely to pick expansions around the given item", function () {
        var value = generator.take(2)[1];

        expect(value, "to equal", "5SSlG");

        expect(generator.expand(value), "to yield items", [5, "Sk5WSlG19", "CM[RId@SYmHea(*)P7C", 9, "YjTK9cm", "5SSlG", "yg5SSdG", "5SSlG00", "he5xSlG1R", "5s5SSlGib", "pq5SSlG", "j%5SSlG"]);
      });
    });
  });
});