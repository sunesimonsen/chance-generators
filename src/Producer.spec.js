const expect = require("../test/expect");
const Producer = require("./Producer");
const chanceCache = require("./chanceCache");
const NaturalGenerator = require("./NaturalGenerator");

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
        "The producer has the signature producer((previous, context, chance) => { ... }, initialValue)"
      );
    });
  });

  describe("when given a producer and an initialValue", () => {
    it("generates values using the given producer function starting with the initialValue", () => {
      const generator = new Producer(previous => previous + 1, 10);

      expect(generator, "to yield items", [10, 11, 12, 13, 14, 15]);
    });
  });

  describe("when only given a producer", () => {
    it("generates values using the given producer function", () => {
      const generator = new Producer(
        (previous, context, chance) =>
          chance.natural({ max: 10 }) * chance.natural({ max: 10 })
      );

      expect(generator, "to yield items", [32, 20, 64, 36, 4, 1]);
    });
  });

  it("unwraps the returned value", () => {
    const generator = new Producer((previous, context, chance) => ({
      id: previous ? previous.id + 1 : 0,
      age: new NaturalGenerator({ max: 100 })
    }));

    expect(generator, "to yield items", [
      { id: 0, age: 37 },
      { id: 1, age: 80 },
      { id: 2, age: 96 },
      { id: 3, age: 18 },
      { id: 4, age: 73 },
      { id: 5, age: 78 }
    ]);
  });

  it("supports mapping", () => {
    const generator = new Producer(previous => previous + 1, 10).map(
      x => x + x
    );

    expect(generator, "to yield items", [20, 22, 24, 26, 28, 30]);
  });
});
