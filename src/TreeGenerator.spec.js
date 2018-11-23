const expect = require("../test/expect").clone();
const TreeGenerator = require("./TreeGenerator");
const IntegerGenerator = require("./IntegerGenerator");
const chanceCache = require("./chanceCache");

const countItems = tree =>
  Array.isArray(tree)
    ? tree.map(countItems).reduce((sum, count) => sum + count, 0)
    : 1;

expect.addAssertion(
  "<array|string> to have size satisfying <assertion>",
  (expect, subject) => {
    expect.shift(countItems(subject));
  }
);

describe("TreeGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  describe("when given no arguments", () => {
    it("fails", () => {
      expect(
        () => {
          new TreeGenerator(); // eslint-disable-line no-new
        },
        "to throw",
        "The tree generator requires an item generator as first argument"
      );
    });
  });

  let generator, itemGenerator;
  describe("when only given a generator for the items", () => {
    beforeEach(() => {
      itemGenerator = new IntegerGenerator({ min: 0, max: 100 });
      generator = new TreeGenerator(itemGenerator);
    });

    it("yields random trees of items generated with the given generator", () => {
      expect(generator, "to yield items", [
        [[[60, 15], [5, [60, 71], 2], 97, 84], [18, [30, 53]]],
        [],
        [29, [[29, [46, 79]], [[59, 4], [17, 6]]], 95, [[30, 9], 69, 44]],
        [
          [84, 17, 39],
          [[42, [57, 3], 85], [39, 93]],
          [[57, [97, 85], [54, [97, 61, 27]], [16, 1], [39, 29]], 1]
        ]
      ]);
    });
  });

  describe("when given a minimum", () => {
    beforeEach(() => {
      generator = new TreeGenerator(
        new IntegerGenerator({ min: 0, max: 100 }),
        {
          min: 4
        }
      );
    });

    it("honor the minimum length", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to have size satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });
  });
  describe("when given both a minimum and a maximum", () => {
    beforeEach(() => {
      generator = new TreeGenerator(
        new IntegerGenerator({ min: 0, max: 100 }),
        {
          min: 4,
          max: 8
        }
      );
    });

    it("honor the constraints length", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to have size satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });
  });
});
