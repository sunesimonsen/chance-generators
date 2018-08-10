const GeneratorIterator = require("./GeneratorIterator");

class Generator {
  constructor(name, options = {}) {
    this.isGenerator = true;
    this.generatorName = name;
    this.options = options;
  }

  values(options) {
    return new GeneratorIterator(this, options);
  }

  take(count, options) {
    return this.values(options).take(count);
  }

  toString() {
    return this.generatorName || this.contructor.name || "generator";
  }
}

module.exports = Generator;
