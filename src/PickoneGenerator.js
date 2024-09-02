const Generator = require("./Generator");
const ConstantGenerator = require("./ConstantGenerator");
const WeightedGenerator = require("./WeightedGenerator");
const unwrap = require("./unwrap");

class PickoneGenerator extends Generator {
  constructor(items = []) {
    super("pickone", {
      items
    });

    if (items.length === 0) {
      throw new Error("Pickone require a non-empty array of items");
    }
  }

  shrink(item) {
    if (
      this.lastUnwrappedValue === item &&
      this.lastValue &&
      this.lastValue.shrink
    ) {
      return this.lastValue.shrink(item);
    } else {
      return new ConstantGenerator(item);
    }
  }

  expand(item) {
    const expandableItem =
      this.lastUnwrappedValue === item &&
      this.lastValue &&
      this.lastValue.expand;

    return new WeightedGenerator([
      [this, 10],
      [expandableItem ? this.lastValue.expand(item) : item, 15]
    ]);
  }

  generate(chance, context) {
    const { items } = this.options;

    const index = chance.natural({ max: items.length - 1 });
    this.lastValue = items[index];

    this.lastUnwrappedValue = unwrap(this.lastValue, chance, context);

    return this.lastUnwrappedValue;
  }
}

module.exports = PickoneGenerator;
