const createGeneratorFacade = Generator => {
  const generatorFacade = (...args) => new Generator(...args);
  const defaultGenerator = new Generator();

  generatorFacade.isGenerator = true;
  generatorFacade.generatorName = defaultGenerator.generatorName;

  [
    "expand",
    "first",
    "generate",
    "map",
    "shrink",
    "take",
    "toString",
    "values"
  ].forEach(method => {
    if (defaultGenerator[method]) {
      generatorFacade[method] = defaultGenerator[method].bind(defaultGenerator);
    }
  });

  return generatorFacade;
};

module.exports = createGeneratorFacade;
