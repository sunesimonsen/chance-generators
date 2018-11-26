"use strict";

var expect = require("../test/expect");
var StringGenerator = require("./StringGenerator");
var StringSplicerGenerator = require("./StringSplicerGenerator");
var chanceCache = require("./chanceCache");

describe("StringGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;

  describe("with default settings", function () {
    beforeEach(function () {
      generator = new StringGenerator();
    });

    it("yields random strings when iterated", function () {
      expect(generator, "to yield items", ["(n25SSlGlhe", "ySk0Wbe)19*pan", "TwTMaFbvMTDkdv[BrHg6ToCM[RId@S"]);
    });

    describe("shrink", function () {
      it("shrinks towards the empty string", function () {
        expect(generator, "to shrink towards", "");
      });

      describe("when the given string", function () {
        it("returns a StringSplicerGenerator", function () {
          var shrunkenGenerator = generator.shrink("foobar");
          expect(shrunkenGenerator, "to satisfy", {
            options: {
              text: "foobar",
              min: 0
            }
          }).and("to be an", StringSplicerGenerator);
        });
      });
    });

    describe("expand", function () {
      it("returns a new generator that is an expansion on the given value", function () {
        var expandedGenerator = generator.expand("foobarbaz");

        expect(expandedGenerator.take(10), "to equal", ["(foobarblz", "panfoTbarbazvMT", "foobarbaz", "foobarbaz", "nc)f5obarbaz&yg", ")uSfoobarbaz", "ifoobarbazx", "foobarbaz", "foobarbaz", "foobarbaz"]);
      });
    });
  });

  describe("with a minimum", function () {
    beforeEach(function () {
      generator = new StringGenerator({
        min: 5
      });
    });

    it("yields random strings with a length that is greater than or equal to the minimum when iterated", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("shrink", function () {
      it("honor the constraints", function () {
        expect(generator.shrink("foobar"), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });

    describe("expand", function () {
      it("honor the constraints", function () {
        expect(generator.expand("foobar"), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });
  });

  describe("with a maximum", function () {
    beforeEach(function () {
      generator = new StringGenerator({
        max: 13
      });
    });

    it("yields random strings with a length that is less than or equal to the maximum when iterated", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("shrink", function () {
      it("honor the constraints", function () {
        expect(generator.shrink("foobar"), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });

    describe("expand", function () {
      it("honor the constraints", function () {
        expect(generator.expand("foobar"), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });
  });

  describe("with a minimun and a maximum", function () {
    beforeEach(function () {
      generator = new StringGenerator({
        min: 5,
        max: 13
      });
    });

    it("yields random strings with a length between the given limits", function () {
      expect(generator, "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
    });

    describe("shrink", function () {
      it("honor the constraints", function () {
        expect(generator.shrink("foobar"), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });

    describe("expand", function () {
      it("honor the constraints", function () {
        expect(generator.expand("foobar"), "to yield items satisfying", "to have length satisfying", "to be within", generator.options.min, generator.options.max);
      });
    });
  });
});