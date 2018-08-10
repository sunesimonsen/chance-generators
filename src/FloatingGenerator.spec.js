const expect = require("../test/expect");
const FloatingGenerator = require("./FloatingGenerator");
const chanceCache = require("./chanceCache");

describe("FloatingGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;

  describe("with default settings", () => {
    beforeEach(() => {
      generator = new FloatingGenerator();
    });

    it("yields random floats when iterated", () => {
      expect(generator, "to yield items", [
        -226008437778.0223,
        534204349258.1377,
        811934722241.3313
      ]);
    });

    describe("shrink", () => {
      it("shrinks towards zero", () => {
        expect(generator, "to shrink towards", 0);
      });

      describe("when the given number is above zero", () => {
        it("returns a new floating generator with a maximum of the given value and the minimum of zero", () => {
          const shrunkenGenerator = generator.shrink(42);
          expect(shrunkenGenerator, "to satisfy", {
            options: {
              min: 0,
              max: 42
            }
          }).and("to be an", FloatingGenerator);
        });
      });

      describe("when the given number is below zero", () => {
        it("returns a new floating generator with a minimum of the given value and the maximum of zero", () => {
          const shrunkenGenerator = generator.shrink(-42);
          expect(shrunkenGenerator, "to satisfy", {
            options: {
              min: -42,
              max: 0
            }
          }).and("to be an", FloatingGenerator);
        });
      });
    });

    describe("expand", () => {
      it("returns a new generator that is an expansion on the given value", () => {
        const expandedGenerator = generator.expand(-42.42);

        expect(expandedGenerator.take(10), "to equal", [
          -42.42,
          811934722241.3313,
          -42.42,
          503846508743.8849,
          -23.05,
          -42.42,
          -111.2211,
          -42.42,
          -42.42,
          30.8153
        ]);
      });
    });
  });

  describe("with a minimum", () => {
    beforeEach(() => {
      generator = new FloatingGenerator({
        min: 13
      });
    });

    it("yields random integers greater than or equal to the minimum when iterated", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to be greater than or equal to",
        generator.options.min
      );
    });

    describe("shrink", () => {
      it("honor the minimum", () => {
        expect(generator.shrink(42), "to satisfy", {
          options: {
            min: 13,
            max: 42
          }
        });
      });
    });

    describe("expand", () => {
      it("returns a new generator that is an expansion on the given value honoring the constraints", () => {
        const expandedGenerator = generator.expand(20);

        expect(
          expandedGenerator,
          "to yield items satisfying",
          "to be greater than or equal to",
          19
        );
      });
    });
  });

  describe("with a maximum", () => {
    beforeEach(() => {
      generator = new FloatingGenerator({
        max: 13
      });
    });

    it("yields random integers less than or equal to the maximum when iterated", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to be less than or equal to",
        generator.options.max
      );
    });

    describe("shrink", () => {
      it("honor the minimum", () => {
        expect(new FloatingGenerator({ max: -10 }).shrink(-20), "to satisfy", {
          options: {
            min: -20,
            max: -10
          }
        });
      });
    });

    describe("expand", () => {
      it("returns a new generator that is an expansion on the given value honoring the constraints", () => {
        const expandedGenerator = generator.expand(6);

        expect(
          expandedGenerator,
          "to yield items satisfying",
          "to be less than or equal to",
          13
        );
      });
    });
  });

  describe("with a minimun and a maximum", () => {
    beforeEach(() => {
      generator = new FloatingGenerator({
        min: -42,
        max: 666
      });
    });

    it("yields random integers between the given limits", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });

    describe("shrink", () => {
      it("honor the limit closest to zero", () => {
        expect(
          new FloatingGenerator({ min: -30, max: -10 }).shrink(-20),
          "to satisfy",
          {
            options: {
              min: -20,
              max: -10
            }
          }
        );
      });
    });

    describe("expand", () => {
      it("returns a new generator that is an expansion on the given value honoring the constraints", () => {
        const expandedGenerator = generator.expand(20);

        expect(
          expandedGenerator,
          "to yield items satisfying",
          "to be within",
          -42,
          666
        );
      });
    });
  });
});
