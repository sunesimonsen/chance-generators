const chanceCache = require("./chanceCache");
const Chance = require("chance");

class GeneratorIterator {
  constructor(generator, { seed = 42, skipSeedCache = false } = {}) {
    this.isGeneratorIterator = true;
    this.isShrinkable = Boolean(generator.shrink);
    this.isExpandable = Boolean(generator.expand);
    this.generator = generator;
    this.seed = seed == null ? Math.round(Math.random() * 10000) : seed;
    if (skipSeedCache) {
      this.chance = new Chance(seed);
    } else {
      this.chance = chanceCache.get(seed);
    }
  }

  shrink(value) {
    if (this.isShrinkable) {
      this.generator = this.generator.shrink(value);
      this.isShrinkable = Boolean(this.generator.shrink);
    }
  }

  expand(value) {
    if (this.isExpandable) {
      this.generator = this.generator.expand(value);
      this.isExpandable = Boolean(this.generator.expand);
    }
  }

  take(count) {
    const result = new Array(count);
    for (var i = 0; i < count; i += 1) {
      result[i] = this.next();
    }
    return result;
  }

  next() {
    return this.generator.generate(this.chance);
  }
}

module.exports = GeneratorIterator;
