const Generator = require("./Generator");

class ReduceGenerator extends Generator {
  constructor(producer, initialValue) {
    super("producer", { producer, initialValue });

    if (typeof producer !== "function") {
      throw new Error(
        "The producer requires has the signature producer((last, chance) => { ... }, initialValue)"
      );
    }
  }

  generate(chance, context) {
    context.last =
      context.hasLast || typeof this.options.initialValue === "undefined"
        ? this.options.producer(context.last, chance)
        : this.options.initialValue;

    context.hasLast = true;

    return context.last;
  }
}

module.exports = ReduceGenerator;
