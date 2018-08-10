const expect = require("../test/expect");
const MagicIntegerGenerator = require("./MagicIntegerGenerator");
const chanceCache = require("./chanceCache");

describe("MagicIntegerGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;
  describe("without magic integers available", () => {
    beforeEach(() => {
      generator = new MagicIntegerGenerator();
    });

    it("just generates random integers", () => {
      expect(generator, "to yield items", [
        -2260084377780224,
        5342043492581376,
        8119347222413312,
        -5702731889115136,
        4179231256870912,
        5038465087438848,
        1777273287999488,
        1744697403899904,
        -6196617325576192,
        -975790292336640
      ]);
    });
  });

  describe("with magic integers available", () => {
    beforeEach(() => {
      global.recordLocation = {};
      global.recordLocation.magicValues = [
        42,
        666,
        66.6,
        "foo",
        "bar",
        "baz",
        "one",
        "two",
        "three",
        -100
      ];

      generator = new MagicIntegerGenerator();
    });

    afterEach(() => {
      global.recordLocation = null;
    });

    it("randomly pick between the magic integers", () => {
      expect(generator, "to yield items", [
        666,
        -100,
        -100,
        42,
        -100,
        -100,
        666,
        666,
        42,
        666
      ]);
    });
  });
});
