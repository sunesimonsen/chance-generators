const expect = require("../test/expect");
const StringGenerator = require("./StringGenerator");
const StringSplicerGenerator = require("./StringSplicerGenerator");
const chanceCache = require("./chanceCache");

describe("StringGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;

  describe("with default settings", () => {
    beforeEach(() => {
      generator = new StringGenerator();
    });

    it("yields random strings when iterated", () => {
      expect(generator, "to yield items", [
        "(n25SSlGlhe",
        "ySk0Wbe)19*pan",
        "TwTMaFbvMTDkdv[BrHg6ToCM[RId@S"
      ]);
    });

    describe("shrink", () => {
      it("shrinks towards the empty string", () => {
        expect(generator, "to shrink towards", "");
      });

      describe("when the given string", () => {
        it("returns a StringSplicerGenerator", () => {
          const shrunkenGenerator = generator.shrink("foobar");
          expect(shrunkenGenerator, "to satisfy", {
            options: {
              text: "foobar",
              min: 0
            }
          }).and("to be an", StringSplicerGenerator);
        });
      });
    });

    describe("expand", () => {
      it("returns a new generator that is an expansion on the given value", () => {
        const expandedGenerator = generator.expand("foobarbaz");

        expect(expandedGenerator.take(10), "to equal", [
          "(foobarblz",
          "panfoTbarbazvMT",
          "foobarbaz",
          "foobarbaz",
          "nc)f5obarbaz&yg",
          ")uSfoobarbaz",
          "ifoobarbazx",
          "foobarbaz",
          "foobarbaz",
          "foobarbaz"
        ]);
      });
    });
  });

  describe("with a minimum", () => {
    beforeEach(() => {
      generator = new StringGenerator({
        min: 5
      });
    });

    it("yields random strings with a length that is greater than or equal to the minimum when iterated", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to have length satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });

    describe("shrink", () => {
      it("honor the constraints", () => {
        expect(
          generator.shrink("foobar"),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });

    describe("expand", () => {
      it("honor the constraints", () => {
        expect(
          generator.expand("foobar"),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });
  });

  describe("with a maximum", () => {
    beforeEach(() => {
      generator = new StringGenerator({
        max: 13
      });
    });

    it("yields random strings with a length that is less than or equal to the maximum when iterated", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to have length satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });

    describe("shrink", () => {
      it("honor the constraints", () => {
        expect(
          generator.shrink("foobar"),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });

    describe("expand", () => {
      it("honor the constraints", () => {
        expect(
          generator.expand("foobar"),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });
  });

  describe("with a minimun and a maximum", () => {
    beforeEach(() => {
      generator = new StringGenerator({
        min: 5,
        max: 13
      });
    });

    it("yields random strings with a length between the given limits", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to have length satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });

    describe("shrink", () => {
      it("honor the constraints", () => {
        expect(
          generator.shrink("foobar"),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });

    describe("expand", () => {
      it("honor the constraints", () => {
        expect(
          generator.expand("foobar"),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });
  });
});
