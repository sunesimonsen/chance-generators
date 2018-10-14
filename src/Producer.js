const Generator = require("./Generator");
const unwrap = require("./unwrap");

class Producer extends Generator {
  constructor(producer, startValue) {
    super("producer", { producer, startValue });

    if (typeof producer !== "function") {
      throw new Error(
        "The producer has the signature producer((previous, context, chance) => { ... }, initialValue)"
      );
    }
  }

  generate(chance, context) {
    const { producer, startValue } = this.options;

    const producerContext = context.childContext(producer);

    if (!producerContext.has("context")) {
      producerContext.set("context", {});
    }

    const value =
      producerContext.has("previous") || typeof startValue === "undefined"
        ? unwrap(
            producer(
              producerContext.get("previous"),
              producerContext.get("context"),
              chance
            ),
            chance,
            context
          )
        : startValue;

    producerContext.set("previous", value);

    return value;
  }
}

module.exports = Producer;
