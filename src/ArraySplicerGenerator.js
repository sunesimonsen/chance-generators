const Generator = require("./Generator");
const ConstantGenerator = require("./ConstantGenerator");
const WeightedGenerator = require("./WeightedGenerator");

class ArraySplicerGenerator extends Generator {
  constructor(items, { min = 0 } = {}) {
    super("arraySplicer", {
      items,
      min
    });
  }

  shrink(items) {
    if (items.length === 0) {
      return new ConstantGenerator([]);
    }

    const shrinkableData =
      items.length < 10 &&
      items === this.lastUnwrappedValue &&
      (this.lastValue || []).some(g => g && g.shrink);

    let shrinkable = this.options.min < items.length || shrinkableData;

    if (!shrinkable) {
      return new ConstantGenerator(items);
    }

    if (shrinkableData) {
      items = this.lastValue.map(
        (g, i) => (g && g.shrink ? g.shrink(items[i]) : items[i])
      );
    } else {
      items = this.lastValue;
    }

    return new ArraySplicerGenerator(items, {
      min: this.options.min
    });
  }

  expand(items) {
    return new WeightedGenerator([
      [this, 1],
      [new ConstantGenerator(items), 1.5]
    ]);
  }

  generate(chance, context) {
    const { min, items } = this.options;
    const from = chance.natural({ max: items.length });
    const length = chance.natural({
      max: Math.min(items.length - from, items.length - min)
    });

    this.lastValue = items.slice();
    this.lastValue.splice(from, length);

    this.lastUnwrappedValue = this.lastValue.map(
      item => (item && item.isGenerator ? item.generate(chance, context) : item)
    );

    return this.lastUnwrappedValue;
  }
}

module.exports = ArraySplicerGenerator;
