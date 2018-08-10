const Generator = require("./Generator");

class ConstantGenerator extends Generator {
  constructor(value) {
    super("constant", {
      value
    });
  }

  generate() {
    return this.options.value;
  }
}

module.exports = ConstantGenerator;
