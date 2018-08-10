const expect = require("../test/expect");
const createGeneratorFacade = require("./createGeneratorFacade");
const IntegerGenerator = require("./IntegerGenerator");
const ArrayGenerator = require("./ArrayGenerator");
const Chance = require("chance");

describe("createGeneratorFacade(IntegerGenerator)", () => {
  const array = (...args) => new ArrayGenerator(...args);
  const integer = createGeneratorFacade(IntegerGenerator);

  it("returns a function that has the same properties as the given generator", () => {
    expect(integer, "to satisfy", {
      expand: expect.it("to be a function"),
      generate: expect.it("to be a function"),
      generatorName: "integer",
      isGenerator: true,
      shrink: expect.it("to be a function"),
      take: expect.it("to be a function"),
      toString: expect.it("to be a function"),
      values: expect.it("to be a function")
    });
  });

  describe("values", () => {
    it("returns the same values as the raw generator", () => {
      expect(
        integer.take(4, { skipSeedCache: true }),
        "to equal",
        new IntegerGenerator().take(4, { skipSeedCache: true })
      );
    });
  });

  it("shrinks similarly to the raw generator", () => {
    expect(
      integer.shrink(5).take(4, { skipSeedCache: true }),
      "to equal",
      new IntegerGenerator().shrink(5).take(4, { skipSeedCache: true })
    );
  });

  it("expands similarly to the raw generator", () => {
    expect(
      integer.expand(5).take(4, { skipSeedCache: true }),
      "to equal",
      new IntegerGenerator().expand(5).take(4, { skipSeedCache: true })
    );
  });

  it("generates similarly to the raw generator", () => {
    expect(
      integer.generate(new Chance(42)),
      "to equal",
      new IntegerGenerator().generate(new Chance(42))
    );
  });

  describe("when called with arguments", () => {
    it("returns the same values as the raw generators created with the same arguments", () => {
      expect(
        integer({ min: -10, max: 10 }).take(4, { skipSeedCache: true }),
        "to equal",
        new IntegerGenerator({ min: -10, max: 10 }).take(4, {
          skipSeedCache: true
        })
      );
    });

    it("shrinks similarly to the raw generator", () => {
      expect(
        integer({ min: -10, max: 10 })
          .shrink(5)
          .take(4, { skipSeedCache: true }),
        "to equal",
        new IntegerGenerator({ min: -10, max: 10 })
          .shrink(5)
          .take(4, { skipSeedCache: true })
      );
    });

    it("expands similarly to the raw generator", () => {
      expect(
        integer({ min: -10, max: 10 })
          .expand(5)
          .take(4, { skipSeedCache: true }),
        "to equal",
        new IntegerGenerator({ min: -10, max: 10 })
          .expand(5)
          .take(4, { skipSeedCache: true })
      );
    });
  });

  it("returns a function that forwards all arguments to the underlying generator", () => {
    expect(
      array(integer({ min: -10, max: 10 }), { max: 10 }).take(4, {
        skipSeedCache: true
      }),
      "to equal",
      new ArrayGenerator(new IntegerGenerator({ min: -10, max: 10 }), {
        max: 10
      }).take(4, { skipSeedCache: true })
    );
  });
});
