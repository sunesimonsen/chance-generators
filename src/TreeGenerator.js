const Generator = require("./Generator");
const ConstantGenerator = require("./ConstantGenerator");
const ShapeGenerator = require("./ShapeGenerator");

const mapLeafs = (tree, mapper) =>
  Array.isArray(tree) ? tree.map(v => mapLeafs(v, mapper)) : mapper(tree);

const countItems = tree =>
  Array.isArray(tree)
    ? tree.map(countItems).reduce((sum, count) => sum + count, 0)
    : 1;

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

  shrink(value) {
    if (value.length === 0) {
      return new ConstantGenerator([]);
    }

    const itemGenerator = this.options.itemGenerator;
    const size = countItems(value);

    if (this.options.min === size) {
      return new ShapeGenerator(
        mapLeafs(value, leaf => itemGenerator.shrink(leaf))
      );
    }

    return new TreeGenerator(itemGenerator, {
      min: this.options.min,
      max: size
    });
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
