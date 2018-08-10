"use strict";

var expect = require("../test/expect");
var WeightedGenerator = require("./WeightedGenerator");
var ConstantGenerator = require("./ConstantGenerator");
var IntegerGenerator = require("./IntegerGenerator");
var StringGenerator = require("./StringGenerator");
var chanceCache = require("./chanceCache");

describe("WeightedGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;
  beforeEach(function () {
    generator = new WeightedGenerator([["one", 50], ["two", 10], ["three", 30], ["four", 10]]);
  });

  describe("when given no arguments", function () {
    it("fails", function () {
      expect(function () {
        new WeightedGenerator(); // eslint-disable-line no-new
      }, "to throw", "Weighted require a non-empty array of items with weights");
    });
  });

  it("generates items by random picking them from an array", function () {
    expect(generator, "to yield items", ["one", "three", "four", "one", "three"]);
  });

  describe("shrink", function () {
    it("returns a constant generator with the given value", function () {
      expect(generator.shrink("four"), "to satisfy", {
        options: { value: "four" }
      }).and("to be a", ConstantGenerator);
    });
  });

  describe("expand", function () {
    it("return new weighted generator where the found item is more likely to get picked again", function () {
      expect(generator.expand("four"), "to satisfy", {
        options: [["one", 50], ["two", 10], ["three", 30], ["four", 50 * 1.5]]
      }).and("to be a", WeightedGenerator);
    });
  });

  describe("when the items contains generators", function () {
    beforeEach(function () {
      generator = new WeightedGenerator([[new IntegerGenerator({ min: 0, max: 100 }), 20], [new StringGenerator({ min: 5 }), 80]]);
    });

    it("generates items by random picking a generator and use that to generate the next value", function () {
      expect(generator, "to yield items", ["n25SSlGlheH#ySk0Wbe)19*pa", 100, 62, "aFbvMTDkdv[BrHg6ToCM", "d@SYmHea(*)P7CwbhrYr", "TK9cm^CtnX3xFMpOQnc)!5"]);
    });

    describe("shrink", function () {
      it("returns the shrunken generator that it was given", function () {
        var value = generator.take(1)[0];
        expect(generator.shrink(value), "to satisfy", {
          generatorName: "stringSplicer",
          options: { text: "n25SSlGlheH#ySk0Wbe)19*pa", min: 5 }
        });
      });
    });

    describe("expand", function () {
      it("returns a weighted generator where the found item is expanded and the weight is increased", function () {
        var value = generator.take(1)[0];

        expect(generator.expand(value), "to yield items", ["TwTMaFbvMTDkdv[BrHg6ToCM[RId@S", "n25SSlGlheH#ySk0Wbe)19*pa", "n25SSlG&heH#ySk0Wbe)19*pa", "^@!UHyheBxXyX1RVu$PIC", "!41Pr5sKcM0FibGhoc%VJxPLZ^ksSE", "n25SSlGlheH#ySk0Wbe)19*pa", "xqMP0DAe)s)ssZK0wkv]ctT[LEdcu", "rYkNKH[OrRXf4Brr17BIU[UDN8g7", "n25SSlGlheH#ySk0Wbe)19*pa", "m8[PMNtr]g", "%nU5SSlGlheH$ySk0Wbe)19*pa", "n25SSlGlheH#yKk0Ube)19*Oa", ")Q)[@fvwCo!txJmB", "n25SSlGlheH#ySk0Wbe)19*pa", 70]);
      });
    });
  });
});