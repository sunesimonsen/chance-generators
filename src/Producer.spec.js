const expect = require("../test/expect");
const Producer = require("./Producer");
const chanceCache = require("./chanceCache");

describe("Producer", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  describe("when given no arguments", () => {
    it("fails", () => {
      expect(
        () => {
          new Producer(); // eslint-disable-line no-new
        },
        "to throw",
        "The producer requires has the signature producer((last, chance) => { ... }, initialValue)"
      );
    });
  });

  describe("when given a producer and an initialValue", () => {
    it("generates values using the given producer function starting with the initialValue", () => {
      const generator = new Producer(last => last + 1, 10);

      expect(generator, "to yield items", [10, 11, 12, 13, 14, 15]);
    });
  });

  describe("when only given a producer", () => {
    it("generates values using the given producer function", () => {
      const generator = new Producer(
        (last, chance) =>
          chance.natural({ max: 10 }) * chance.natural({ max: 10 })
      );

      expect(generator, "to yield items", [32, 20, 64, 36, 4, 1]);
    });
  });
});
