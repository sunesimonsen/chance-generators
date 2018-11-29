const Generator = require("./Generator");
const unwrap = require("./unwrap");

class MappingGenerator extends Generator {
  constructor(generator, mapper) {
    super("map", { mapper });
    this.isMappedGenerator = true;
    this.parentGenerator = generator;

    if (generator.shrink) {
      this.shrink = (value, context) => {
        if (value === this.lastMappedValue) {
          return generator.shrink(this.lastValue, context).map(mapper);
        } else {
          return this;
        }
      };
    }

    if (generator.expand) {
      this.expand = (value, context) => {
        if (value === this.lastMappedValue) {
          return generator.expand(this.lastValue, context).map(mapper);
        } else {
          return this;
        }
      };
    }
  }

  generate(chance, context) {
    this.lastValue = this.parentGenerator.generate(chance, context);

    const { mapper } = this.options;

    this.lastMappedValue = unwrap(
      mapper(this.lastValue, chance),
      chance,
      context
    );

    return this.lastMappedValue;
  }
}

module.exports = MappingGenerator;
