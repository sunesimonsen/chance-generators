const Generator = require("./Generator");

class TreeGenerator extends Generator {
  constructor(itemGenerator, { min = 0, max = 30 } = {}) {
    super("tree", {
      itemGenerator,
      min,
      max
    });

    if (!itemGenerator || !itemGenerator.isGenerator) {
      throw new Error(
        "The tree generator requires an item generator as first argument"
      );
    }
  }

  generate(chance, context) {
    const { itemGenerator, min, max } = this.options;

    if (max === 0) {
      return [];
    }

    const count = chance.natural({ min, max });
    let remainding = count;
    const result = [];
    while (remainding > 0) {
      const size = Math.min(
        remainding,
        chance.natural({
          min: 1,
          max: Math.max(1, count - 1)
        })
      );

      if (size === 1) {
        result.push(itemGenerator.generate(chance, context));
      } else {
        result.push(
          new TreeGenerator(itemGenerator, { min: size, max: size }).generate(
            chance,
            context
          )
        );
      }

      remainding -= size;
    }

    return result;
  }
}

module.exports = TreeGenerator;
