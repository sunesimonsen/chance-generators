const Generator = require("./Generator");
const unwrap = require("./unwrap");

class MappingGenerator extends Generator {
  constructor(generator, mapper) {
    super("map", { mapper });
    this.isMappedGenerator = true;
    this.parentGenerator = generator;

    if (generator.shrink) {
      this.shrink = value => {
        if (value === this.lastMappedValue) {
          return generator.shrink(this.lastValue).map(mapper);
        } else {
          return this;
        }
      };
    }

    if (generator.expand) {
      this.expand = value => {
        if (value === this.lastMappedValue) {
          return generator.expand(this.lastValue).map(mapper);
        } else {
          return this;
        }
      };
    }
  }

  generate(chance) {
    this.lastValue = this.parentGenerator.generate(chance);
    const { mapper } = this.options;
    this.lastMappedValue = unwrap(mapper(this.lastValue, chance), chance);
    return this.lastMappedValue;
  }
}

module.exports = MappingGenerator;
