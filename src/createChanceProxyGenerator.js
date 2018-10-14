const Generator = require("./Generator");
const unwrap = require("./unwrap");

const createChanceProxyGenerator = method => {
  class ChanceProxyGenerator extends Generator {
    constructor(...args) {
      super(method, args);
    }

    generate(chance, context) {
      return chance[this.generatorName](
        ...unwrap(this.options, chance, context)
      );
    }
  }

  return ChanceProxyGenerator;
};

module.exports = createChanceProxyGenerator;
