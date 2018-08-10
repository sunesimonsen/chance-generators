const expect = require("../test/expect");
const ArrayGenerator = require("./ArrayGenerator");
const IntegerGenerator = require("./IntegerGenerator");
const ArraySplicerGenerator = require("./ArraySplicerGenerator");
const PicksetGenerator = require("./PicksetGenerator");
const chanceCache = require("./chanceCache");

describe("ArrayGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  describe("when given no arguments", () => {
    it("fails", () => {
      expect(
        () => {
          new ArrayGenerator(); // eslint-disable-line no-new
        },
        "to throw",
        "The array generator requires an item generator as first argument"
      );
    });
  });

  let generator, itemGenerator;
  describe("when only given a generator for the items", () => {
    beforeEach(() => {
      itemGenerator = new IntegerGenerator({ min: 0, max: 100 });
      generator = new ArrayGenerator(itemGenerator);
    });

    it("yields random arrays of items generated with the given generator", () => {
      expect(generator, "to yield items", [
        [80, 96, 18, 73, 78, 60, 60, 15, 45, 15, 10],
        [46],
        [
          33,
          60,
          14,
          71,
          65,
          2,
          5,
          97,
          72,
          84,
          94,
          21,
          0,
          18,
          100,
          18,
          62,
          30,
          61,
          53,
          0,
          43,
          2,
          29,
          53,
          61
        ]
      ]);
    });

    describe("shrink", () => {
      it("returns an ArraySplicerGenerator that shrinks towards the empty array", () => {
        expect(generator, "to shrink towards", []);
      });
    });

    describe("expand", () => {
      it("returns a PicksetGenerator using the given data in addition to the item generator", () => {
        expect(generator.expand([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            items: [itemGenerator, 80, 96, 18, 73, 78, 60],
            min: 0,
            max: 30
          }
        }).and("to be an", PicksetGenerator);
      });

      it("produces a generator that will generate arrays similar to the given value", () => {
        expect(generator.expand([80, 96, 18, 73, 78, 60]).take(5), "to equal", [
          [78, 60, 15, 96, 18, 80, 73],
          [80, 14, 78, 60, 96, 73, 18],
          [73, 21, 78, 18, 96, 80, 60],
          [],
          [60, 80, 18, 78, 73]
        ]);
      });
    });
  });

  describe("when given a minimum", () => {
    beforeEach(() => {
      generator = new ArrayGenerator(
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
        "to have length satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });

    describe("shrink", () => {
      it("returns an ArraySplicerGenerator that shrinks towards the minimum size array", () => {
        expect(generator.shrink([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 4
          }
        }).and("to be an", ArraySplicerGenerator);
      });
    });

    describe("expand", () => {
      it("honor the constaints", () => {
        expect(generator.expand([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 4,
            max: 30
          }
        });
      });
    });
  });

  describe("when given a maximum", () => {
    beforeEach(() => {
      generator = new ArrayGenerator(
        new IntegerGenerator({ min: 0, max: 100 }),
        {
          max: 20
        }
      );
    });

    it("honor the minimum length", () => {
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
      it("honor the constaints", () => {
        expect(generator.shrink([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 0
          }
        });
      });
    });

    describe("expand", () => {
      it("honor the constaints", () => {
        expect(generator.expand([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 0,
            max: 20
          }
        });
      });
    });
  });

  describe("when given both a minimum and a maximum", () => {
    beforeEach(() => {
      generator = new ArrayGenerator(
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
        "to have length satisfying",
        "to be within",
        generator.options.min,
        generator.options.max
      );
    });

    describe("shrink", () => {
      it("honor the constaints", () => {
        expect(generator.shrink([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 4
          }
        });
      });
    });

    describe("expand", () => {
      it("honor the constaints", () => {
        expect(generator.expand([80, 96, 18, 73, 78, 60]), "to satisfy", {
          options: {
            min: 4,
            max: 8
          }
        });
      });
    });
  });
});
