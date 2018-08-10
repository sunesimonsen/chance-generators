const IntegerGenerator = require("./IntegerGenerator");

class NaturalGenerator extends IntegerGenerator {
  constructor({
    name = "natural",
    min = 0,
    max = Number.MAX_SAFE_INTEGER || 9007199254740991
  } = {}) {
    if (min < 0) {
      throw new Error("Chance: Min cannot be less than zero.");
    }

    super({
      name,
      min,
      max
    });
  }
}

module.exports = NaturalGenerator;
