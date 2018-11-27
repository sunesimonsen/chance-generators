const expect = require("../test/expect");
const ShuffleGenerator = require("./ShuffleGenerator");
const chanceCache = require("./chanceCache");
const { dollar, integer, letter } = require("./index");

describe("ShuffleGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;

  beforeEach(() => {
    generator = new ShuffleGenerator(["a", "b", "c"]);
  });

  describe("when given no arguments", () => {
    it("fails", () => {
      expect(
        () => {
          new ShuffleGenerator(); // eslint-disable-line no-new
        },
        "to throw",
        "Shuffle require a non-empty array of items"
      );
    });
  });

  it("create arrays by picking subsets of the given items", () => {
    expect(generator, "to yield items", [
      ["b", "c", "a"],
      ["a", "b", "c"],
      ["b", "c", "a"],
      ["b", "a", "c"],
      ["a", "c", "b"]
    ]);
  });

  describe("expand", () => {
    it("pick the given data more often", () => {
      expect(generator.expand(["b", "a", "c"]), "to yield items", [
        ["c", "b", "a"],
        ["b", "a", "c"],
        ["b", "a", "c"],
        ["b", "a", "c"],
        ["b", "a", "c"]
      ]);
    });
  });

  describe("shrink", () => {
    it("to the given data", () => {
      expect(generator, "to shrink towards", ["b", "c", "a"]);
    });
  });

  describe("when the items contains generators", () => {
    beforeEach(() => {
      generator = new ShuffleGenerator([letter, integer, dollar, 666]);
    });

    it("uses the generators to generator values for the resulting arrays", () => {
      expect(generator, "to yield items", [
        [4179231256870913, "$7796.91", 666, "p"],
        ["$999.75", "b", 666, -734106774142975],
        [666, 3748302344421377, "$6508.89", "a"]
      ]);
    });

    describe("shrink", () => {
      it("shrinks the item generators", () => {
        expect(generator, "to shrink towards", ["$7796.91", 666, "p", 0]);
      });
    });
  });
});
