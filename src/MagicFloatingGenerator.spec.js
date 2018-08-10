const expect = require("../test/expect");
const MagicFloatingGenerator = require("./MagicFloatingGenerator");
const chanceCache = require("./chanceCache");

describe("MagicFloatingGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;
  describe("without magic floats available", () => {
    beforeEach(() => {
      generator = new MagicFloatingGenerator();
    });

    it("just generates random floats", () => {
      expect(generator, "to yield items", [
        -226008437778.0224,
        534204349258.1376,
        811934722241.3312,
        -570273188911.5135,
        417923125687.0912,
        503846508743.8848,
        177727328799.9488,
        174469740389.9904,
        -619661732557.6191,
        -97579029233.664
      ]);
    });
  });

  describe("with magic floats available", () => {
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
        -100,
        42.24
      ];

      generator = new MagicFloatingGenerator();
    });

    afterEach(() => {
      global.recordLocation = null;
    });

    it("randomly pick between the magic floats", () => {
      expect(generator, "to yield items", [
        66.6,
        42.24,
        42.24,
        66.6,
        42.24,
        42.24,
        42.24,
        42.24,
        66.6,
        66.6
      ]);
    });
  });
});
