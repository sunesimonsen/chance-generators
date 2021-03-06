const expect = require("../test/expect");
const PicksetGenerator = require("./PicksetGenerator");
const IntegerGenerator = require("./IntegerGenerator");
const Producer = require("./Producer");
const chanceCache = require("./chanceCache");

describe("PicksetGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;

  describe("when given no limits", () => {
    beforeEach(() => {
      generator = new PicksetGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    describe("when given no arguments", () => {
      it("fails", () => {
        expect(
          () => {
            new PicksetGenerator(); // eslint-disable-line no-new
          },
          "to throw",
          "Pickset require a non-empty array of items"
        );
      });
    });

    it("create arrays by picking subsets of the given items", () => {
      expect(generator, "to yield items", [[7, 8, 1, 5], [0], [8, 3, 4, 1, 7]]);
    });

    describe("shrink", () => {
      it("shrinks towards the empty array", () => {
        expect(generator, "to shrink towards", []);
      });
    });

    describe("expand", () => {
      it("expands the given data", () => {
        expect(generator.expand([7, 9, 1, 6]), "to yield items", [
          [7, 9, 1, 6],
          [7, 7, 1, 6],
          [2, 0, 7, 9, 1, 6, 5, 4],
          [7, 9, 1, 6],
          [6, 1, 7, 9, 1, 6, 8, 0],
          [9, 5, 7, 9, 1, 6, 4, 3],
          [7, 9, 1, 6],
          [7, 9, 1, 6, 8, 2],
          [7, 9, 1, 6, 3],
          [3, 8, 9, 1, 6, 1]
        ]);
      });
    });
  });

  describe("when given a minimum", () => {
    beforeEach(() => {
      generator = new PicksetGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
        min: 3
      });
    });

    it("create arrays by picking subsets larger than or equal to the given minimum size", () => {
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
      it("shrinks towards an array of minimum length", () => {
        expect(generator, "to shrink towards", [1, 8, 7]);
      });
    });

    describe("expand", () => {
      it("honor the constraints", () => {
        expect(
          generator.expand([7, 9, 1, 6]),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });
  });

  describe("when given a maximum", () => {
    beforeEach(() => {
      generator = new PicksetGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
        max: 6
      });
    });

    it("create arrays by picking subsets that is less than or equal to given maximum size", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to have length satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });

    describe("expand", () => {
      it("honor the constraints", () => {
        expect(
          generator.expand([7, 9, 1, 6]),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });
  });

  describe("when given a minimum and a maximum", () => {
    beforeEach(() => {
      generator = new PicksetGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
        min: 3,
        max: 6
      });
    });

    it("create arrays by picking subsets that within the minimum and maximum sizes", () => {
      expect(
        generator,
        "to yield items satisfying",
        "to have length satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });

    describe("expand", () => {
      it("honor the constraints", () => {
        expect(
          generator.expand([7, 9, 1, 6]),
          "to yield items satisfying",
          "to have length satisfying",
          "to be within",
          generator.options.min,
          generator.options.max
        );
      });
    });
  });

  describe("when the items contains generators", () => {
    const itemGenerator = new IntegerGenerator({ min: 0, max: 100 });

    beforeEach(() => {
      generator = new PicksetGenerator([
        itemGenerator,
        itemGenerator,
        itemGenerator,
        itemGenerator
      ]);
    });

    it("uses the generators to generator values for the resulting arrays", () => {
      expect(generator, "to yield items", [[96], [], [45, 15, 10]]);
    });

    describe("and has a minimum", () => {
      beforeEach(() => {
        generator = new PicksetGenerator(
          [
            itemGenerator,
            itemGenerator,
            itemGenerator,
            itemGenerator,
            itemGenerator,
            itemGenerator
          ],
          { min: 3 }
        );
      });

      describe("shrink", () => {
        it("shrinks towards an array of minimum length and minimum items", () => {
          expect(generator, "to shrink towards", [0, 0, 0]);
        });
      });

      describe("expand", () => {
        it("uses the generators", () => {
          expect(generator.expand([7, 9, 1, 6]), "to yield items", [
            [7, 9, 1, 6],
            [84, 9, 1, 6],
            [7, 9, 1, 6],
            [7, 9, 1, 68],
            [7, 9, 1, 6],
            [52, 9, 1, 6],
            [7, 9, 1, 6, 52],
            [7, 27, 1, 6],
            [7, 9, 1, 6],
            [7, 9, 1, 6]
          ]);
        });

        it("honor the constraints", () => {
          expect(
            generator.expand([7, 9, 1, 6]),
            "to yield items satisfying",
            "to have length satisfying",
            "to be within",
            generator.options.min,
            generator.options.max
          );
        });
      });
    });

    describe("and the generators uses the iteration context", () => {
      beforeEach(() => {
        const increasingNumber = new Producer(last => last + 1, 0);
        const color = new Producer((_, context) => {
          const index = context.colorIndex || 0;
          context.colorIndex = index + 1;

          const colors = ["green", "yellow", "red"];
          return colors[index % colors.length];
        });

        generator = new PicksetGenerator([
          increasingNumber.map(v => `0: ${v}`),
          color.map(v => `1: ${v}`),
          increasingNumber.map(v => `2: ${v}`),
          color.map(v => `3: ${v}`)
        ]);
      });

      it("each generator gets a context for all iterations", () => {
        expect(generator, "to yield items", [
          ["3: green"],
          ["0: 0", "2: 1", "1: yellow", "3: red"],
          ["0: 2", "1: green"],
          [],
          ["3: yellow", "1: red"],
          ["2: 3", "0: 4", "3: green"],
          ["3: yellow", "2: 5", "0: 6"],
          [],
          ["0: 7", "1: red", "3: green", "2: 8"],
          ["0: 9", "1: yellow"]
        ]);
      });
    });
  });
});
