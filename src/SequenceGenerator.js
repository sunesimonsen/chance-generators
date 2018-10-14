const Generator = require("./Generator");
const GeneratorIterator = require("./GeneratorIterator");
const ConstantGenerator = require("./ConstantGenerator");
const WeightedGenerator = require("./WeightedGenerator");
const unwrap = require("./unwrap");

class SequenceGenerator extends Generator {
  constructor(producer, { min = 0, max = 30, initialValue = null } = {}) {
    super("string", { producer, min, max, initialValue });

    if (typeof producer !== "function") {
      throw new Error(
        "The sequence generator requires a producer function as first argument"
      );
    }
  }

  values() {
    return new GeneratorIterator(this);
  }

  shrink(items) {
    if (items.length === this.options.min) {
      return new ConstantGenerator(items);
    }

    return new SequenceGenerator(this.options.producer, {
      min: this.options.min,
      max: items.length
    });
  }

  expand(items) {
    const { producer, max, initialValue } = this.options;

    const emptyContext = Object.keys(this.lastProducerContext).length === 0;

    if (this.lastValue === items && items.length < max && emptyContext) {
      return new SequenceGenerator(producer, {
        min: 0,
        max: max - items.length,
        initialValue:
          items.length === 0 ? initialValue : items[items.length - 1]
      }).map(tail => items.concat(tail));
    } else {
      return new WeightedGenerator([
        [this, 1],
        [new ConstantGenerator(items), 1.5]
      ]);
    }
  }

  generate(chance, context) {
    const { producer, min, max, initialValue } = this.options;

    let producerContext = Object.create(null);

    const count = chance.natural({ min, max });
    const result = [];

    for (var i = 0; i < count; i += 1) {
      result.push(
        unwrap(
          producer(i === 0 ? initialValue : result[i - 1], producerContext),
          chance,
          context
        )
      );
    }

    this.lastValue = result;
    this.lastProducerContext = producerContext;

    return this.lastValue;
  }
}

module.exports = SequenceGenerator;
