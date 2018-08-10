const expect = require("../test/expect");
const StringSplicerGenerator = require("./StringSplicerGenerator");
const chanceCache = require("./chanceCache");

describe("StringSplicerGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  describe("when given no arguments", () => {
    it("fails", () => {
      expect(
        () => {
          new StringSplicerGenerator(); // eslint-disable-line no-new
        },
        "to throw",
        "The string splicer generator requires a string as first argument"
      );
    });
  });

  let generator;
  describe("without a given minimum", () => {
    beforeEach(() => {
      generator = new StringSplicerGenerator("foobarbaz");
    });

    it("generates strings that is the result of splicing out parts of the given text", () => {
      expect(generator, "to yield items", [
        "fooz",
        "foobarbaz",
        "foobarb",
        "foobaaz",
        "frbaz",
        "foobarbaz",
        "arbaz",
        "foobarbaz"
      ]);
    });

    describe("shrink", () => {
      it("shrinks towards the empty string", () => {
        expect(generator, "to shrink towards", "");
      });
    });

    describe("expand", () => {
      it("picks the expanded value more often", () => {
        expect(generator.expand("frbaz"), "to yield items", [
          "foobarb",
          "foobarb",
          "frbaz",
          "frbaz",
          "foobarbaz",
          "arbaz",
          "frbaz",
          "foobarbaz"
        ]);
      });
    });
  });

  describe("with a given minimum", () => {
    beforeEach(() => {
      generator = new StringSplicerGenerator("foobarbaz", { min: 6 });
    });

    it("generates strings that is the result of splicing out parts of the given text", () => {
      expect(generator, "to yield items", [
        "foobaz",
        "foobarbaz",
        "foobarb",
        "foobaaz",
        "fobarbaz",
        "foobarbaz",
        "oobarbaz"
      ]);
    });

    describe("shrink", () => {
      it("shrinks towards the minimum allowed length", () => {
        expect(generator, "to shrink towards", "foobaz");
      });
    });

    describe("expand", () => {
      it("picks the expanded value more often", () => {
        expect(generator.expand("foobaz"), "to yield items", [
          "foobarb",
          "foobarb",
          "foobaz",
          "foobaz",
          "foobarbaz",
          "oobarbaz",
          "foobaz",
          "foobarbaz"
        ]);
      });
    });
  });
});
