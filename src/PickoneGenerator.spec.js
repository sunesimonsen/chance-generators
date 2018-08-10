const expect = require("../test/expect");
const PickoneGenerator = require("./PickoneGenerator");
const ConstantGenerator = require("./ConstantGenerator");
const IntegerGenerator = require("./IntegerGenerator");
const StringGenerator = require("./StringGenerator");
const chanceCache = require("./chanceCache");

describe("PickoneGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;
  beforeEach(() => {
    generator = new PickoneGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  describe("when given no arguments", () => {
    it("fails", () => {
      expect(
        () => {
          new PickoneGenerator(); // eslint-disable-line no-new
        },
        "to throw",
        "Pickone require a non-empty array of items"
      );
    });
  });

  it("generates items by random picking them from an array", () => {
    expect(generator, "to yield items", [3, 7, 9, 1, 7]);
  });

  describe("shrink", () => {
    it("returns a constant generator with the given value", () => {
      expect(generator.shrink(5), "to satisfy", { options: { value: 5 } }).and(
        "to be a",
        ConstantGenerator
      );
    });
  });

  describe("expand", () => {
    it("returns a new generator that is more likely to pick the given item", () => {
      expect(generator.expand(5), "to yield items", [7, 5, 7, 5, 5, 5, 4, 0]);
    });
  });

  describe("when the items contains generators", () => {
    beforeEach(() => {
      generator = new PickoneGenerator([
        new IntegerGenerator({ min: 0, max: 100 }),
        new StringGenerator()
      ]);
    });

    it("generates items by random picking a generator and use that to generate the next value", () => {
      expect(generator, "to yield items", [
        80,
        "5SSlG",
        10,
        46,
        "k0Wbe)19*p",
        18
      ]);
    });

    describe("shrink", () => {
      it("returns the shrunken generator that it was given", () => {
        const value = generator.take(1)[0];
        expect(generator.shrink(value), "to satisfy", {
          generatorName: "integer",
          options: { min: 0, max: 80 }
        });
      });
    });

    describe("expand", () => {
      it("returns a new generator that is more likely to pick expansions around the given item", () => {
        const value = generator.take(2)[1];

        expect(value, "to equal", "5SSlG");

        expect(generator.expand(value), "to yield items", [
          5,
          "Sk5WSlG19",
          "CM[RId@SYmHea(*)P7C",
          9,
          "YjTK9cm",
          "5SSlG",
          "yg5SSdG",
          "5SSlG00",
          "he5xSlG1R",
          "5s5SSlGib",
          "pq5SSlG",
          "j%5SSlG"
        ]);
      });
    });
  });
});
