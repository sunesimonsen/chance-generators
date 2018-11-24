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
        [[73, [[[5, 87], 60, 71], [97, 84], 21], 18], 18, 30],
        [
          [[53, 40, 4, 98], [9, 62, 38], 99, 47],
          86,
          [45, 1, 95],
          [38, 1, 23],
          24,
          69
        ],
        [[3, 91], 26],
        [[42, 21, 57], 3, 85]
      ]);
    });

    describe("shrink", () => {
      it("shrinks towards the empty tree", () => {
        expect(generator, "to shrink towards", []);
      });
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

    describe("shrink", () => {
      it("shrinks towards the minimum tree", () => {
        expect(generator, "to shrink towards", [0, 0, 0, 0]);
      });
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
