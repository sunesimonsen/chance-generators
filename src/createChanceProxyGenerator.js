const Generator = require("./Generator");
const unwrap = require("./unwrap");

const createChanceProxyGenerator = method => {
  class ChanceProxyGenerator extends Generator {
    constructor(...args) {
      super(method, args);
    }

    generate(chance) {
      return chance[this.generatorName](...unwrap(this.options, chance));
    }
  }

  return ChanceProxyGenerator;
};

module.exports = createChanceProxyGenerator;
