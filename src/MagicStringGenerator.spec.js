const expect = require("../test/expect");
const MagicStringGenerator = require("./MagicStringGenerator");
const chanceCache = require("./chanceCache");

describe("MagicStringGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;
  describe("without magic strings available", () => {
    beforeEach(() => {
      generator = new MagicStringGenerator();
    });

    it("just generates random strings", () => {
      expect(generator, "to yield items", [
        "(n25SSlGlhe",
        "ySk0Wbe)19*pan",
        "TwTMaFbvMTDkdv[BrHg6ToCM[RId@S",
        "Hea(*)P7CwbhrYrGYjTK9",
        "^",
        "nX3xFMpOQnc)",
        "H*D%&S1&ygQoMd)y!C3uN9RA)u",
        "ukv7mfb]F5Dovab8o0",
        "65Sf&AWi^@!UHyheBxXyX1",
        "u$PICi)0!41Pr5sKcM"
      ]);
    });
  });

  describe("with magic strings available", () => {
    beforeEach(() => {
      global.recordLocation = {};
      global.recordLocation.magicValues = [
        42,
        666,
        "foo",
        "bar",
        "baz",
        "one",
        "two",
        "three"
      ];

      generator = new MagicStringGenerator();
    });

    afterEach(() => {
      global.recordLocation = null;
    });

    it("randomly pick between the magic strings", () => {
      expect(generator, "to yield items", [
        "baz",
        "two",
        "three",
        "bar",
        "two",
        "two",
        "one",
        "one",
        "foo",
        "baz"
      ]);
    });
  });
});
