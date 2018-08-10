const createChanceProxyGenerator = require("./createChanceProxyGenerator");
const createGeneratorFacade = require("./createGeneratorFacade");

module.exports = method => {
  const Generator = createChanceProxyGenerator(method);
  return createGeneratorFacade(Generator);
};
