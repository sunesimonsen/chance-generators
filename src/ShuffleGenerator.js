const Generator = require("./Generator");
const ConstantGenerator = require("./ConstantGenerator");
const WeightedGenerator = require("./WeightedGenerator");

class ShuffleGenerator extends Generator {
  constructor(items = []) {
    super("shuffle", {
      items
    });

    if (items.length === 0) {
      throw new Error("Shuffle require a non-empty array of items");
    }
  }

  shrink(items) {
    const shrinkable = (this.lastValue || []).some(g => g && g.shrink);

    if (shrinkable) {
      return new ShuffleGenerator(
        this.lastValue.map(
          (g, i) => (g && g.shrink ? g.shrink(items[i]) : items[i])
        )
      );
    } else {
      return new ConstantGenerator(items);
    }
  }

  expand(items) {
    return new WeightedGenerator([
      [this, 1],
      [new ConstantGenerator(items), 1.5]
    ]);
  }

  generate(chance, context) {
    const { items } = this.options;

    this.lastValue = chance.shuffle(items);

    return this.lastValue.map(
      item => (item && item.isGenerator ? item.generate(chance, context) : item)
    );
  }
}

module.exports = ShuffleGenerator;
