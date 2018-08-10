const expect = require("../test/expect");
const createChanceProxyGenerator = require("./createChanceProxyGenerator");
const createGeneratorFacade = require("./createGeneratorFacade");
const chanceCache = require("./chanceCache");

describe("createChanceProxyGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  it("generates a proxy generator based on a given chance method", () => {
    const DollarGenerator = createChanceProxyGenerator("dollar");
    const dollar = createGeneratorFacade(DollarGenerator);

    expect(dollar({ max: 20 }), "to yield items", [
      "$7.49",
      "$15.93",
      "$19.02",
      "$3.67"
    ]);
  });
});
