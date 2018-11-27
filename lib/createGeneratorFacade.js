"use strict";

var createGeneratorFacade = function createGeneratorFacade(Generator) {
  var generatorFacade = function generatorFacade() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Generator, [null].concat(args)))();
  };
  var defaultGenerator = new Generator();

  generatorFacade.isGenerator = true;
  generatorFacade.generatorName = defaultGenerator.generatorName;

  ["expand", "first", "generate", "map", "shrink", "take", "toString", "values"].forEach(function (method) {
    if (defaultGenerator[method]) {
      generatorFacade[method] = defaultGenerator[method].bind(defaultGenerator);
    }
  });

  return generatorFacade;
};

module.exports = createGeneratorFacade;