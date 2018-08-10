const expect = require("../test/expect");
const ArraySplicerGenerator = require("./ArraySplicerGenerator");
const chanceCache = require("./chanceCache");

describe("ArraySplicerGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  let generator;
  describe("when no minimum is given", () => {
    beforeEach(() => {
      generator = new ArraySplicerGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("generates arrays that is the result of splicing out parts of the given array", () => {
      expect(generator, "to yield items", [
        [0, 1, 2, 3, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 8, 9],
        [0, 5, 6, 7, 8, 9]
      ]);
    });

    describe("shrink", () => {
      it("shrink towards the empty array", () => {
        expect(generator, "to shrink towards", []);
      });
    });

    describe("expand", () => {
      it("picks the expanded value more often", () => {
        expect(generator.expand([6, 6, 6]), "to yield items", [
          [0, 1, 2, 3, 4, 5, 6, 7],
          [0, 1, 2, 3, 4, 5, 6, 7],
          [6, 6, 6],
          [6, 6, 6],
          [0, 1, 2, 3, 5, 6, 7, 8, 9]
        ]);
      });
    });
  });

  describe("with a given minimum", () => {
    beforeEach(() => {
      generator = new ArraySplicerGenerator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
        min: 5
      });
    });

    it("generates arrays that is the result of splicing out parts of the given array", () => {
      expect(generator, "to yield items", [
        [0, 1, 2, 3, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 8, 9],
        [0, 3, 4, 5, 6, 7, 8, 9]
      ]);
    });

    describe("shrink", () => {
      it("shrink towards an array with the minimum allowed length", () => {
        expect(generator, "to shrink towards", [0, 1, 2, 3, 8]);
      });
    });

    describe("expand", () => {
      it("picks the expanded value more often", () => {
        expect(generator.expand([6, 6, 6, 6, 6]), "to yield items", [
          [0, 1, 2, 3, 4, 5, 6, 7],
          [0, 1, 2, 3, 4, 5, 6, 7],
          [6, 6, 6, 6, 6],
          [6, 6, 6, 6, 6],
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        ]);
      });
    });
  });
});
