const Generator = require("./Generator");
const ConstantGenerator = require("./ConstantGenerator");
const WeightedGenerator = require("./WeightedGenerator");

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
    if (this.lastUnwrappedValue === item && this.lastValue.shrink) {
      return this.lastValue.shrink(item);
    } else {
      return new ConstantGenerator(item);
    }
  }

  expand(item) {
    const expandableItem =
      this.lastUnwrappedValue === item && this.lastValue.expand;

    return new WeightedGenerator([
      [this, 10],
      [expandableItem ? this.lastValue.expand(item) : item, 15]
    ]);
  }

  generate(chance) {
    const { items } = this.options;

    this.lastValue = chance.pickone(items);

    this.lastUnwrappedValue =
      this.lastValue && this.lastValue.isGenerator
        ? this.lastValue.generate(chance)
        : this.lastValue;

    return this.lastUnwrappedValue;
  }
}

module.exports = PickoneGenerator;
