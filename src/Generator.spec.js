const expect = require("../test/expect");
const IntegerGenerator = require("./IntegerGenerator");
const chanceCache = require("./chanceCache");

describe("Generator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  const generator = new IntegerGenerator({ min: 0, max: 100 });

  describe("toString", () => {
    it("returns the name of the generator", () => {
      expect(generator.toString(), "to equal", "integer");
    });
  });

  describe("map", () => {
    const mapper = s => s.toUpperCase();
    const mapGenerator = generator.map(mapper);

    it("returns a new mapping generator", () => {
      expect(mapGenerator, "to satisfy", {
        generatorName: "map",
        isGenerator: true,
        isMappedGenerator: true
      });
    });
  });

  describe("values", () => {
    it("returns a iterator with a default seed", () => {
      expect(generator.values(), "to satisfy", {
        isGeneratorIterator: true,
        seed: 42
      });
    });

    it("generates values with the default seed", () => {
      const iterator = generator.values();

      expect([iterator.next(), iterator.next(), iterator.next()], "to equal", [
        37,
        80,
        96
      ]);
    });

    describe("when given a seed", () => {
      it("returns an iterator with the given seed", () => {
        expect(generator.values({ seed: 666 }), "to satisfy", {
          isGeneratorIterator: true,
          seed: 666
        });
      });

      it("generates values with the given seed", () => {
        const iterator = generator.values({ seed: 666 });

        expect(
          [iterator.next(), iterator.next(), iterator.next()],
          "to equal",
          [70, 10, 85]
        );
      });
    });

    describe("when using a random seed", () => {
      it("uses a random seed for every iterator", () => {
        expect(generator.values({ seed: null }), "to satisfy", {
          isGeneratorIterator: true,
          seed: expect.it("to be a number").and("not to be", 42)
        });
      });
    });
  });

  describe("first", () => {
    it("returns the first item from the generator", () => {
      expect(generator.first(), "to equal", 37);
    });

    it("advances the random values", () => {
      expect(generator.first(), "not to equal", generator.first());
    });

    describe("when given a seed", () => {
      it("generate an item with the given seed", () => {
        expect(generator.first({ seed: 666 }), "to equal", 70);
      });
    });
  });

  describe("take", () => {
    it("returns the given number of items from the generator", () => {
      expect(generator.take(5), "to equal", [37, 80, 96, 18, 73]);
    });

    it("returns the next n elements produced by the generator", () => {
      expect(generator.take(5), "not to equal", generator.take(5));
    });

    describe("when given a seed", () => {
      it("generates items with the given seed", () => {
        expect(generator.take(5, { seed: 666 }), "to equal", [
          70,
          10,
          85,
          21,
          68
        ]);
      });
    });
  });
});
