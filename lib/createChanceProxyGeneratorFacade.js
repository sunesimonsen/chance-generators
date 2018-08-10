"use strict";

var createChanceProxyGenerator = require("./createChanceProxyGenerator");
var createGeneratorFacade = require("./createGeneratorFacade");

module.exports = function (method) {
  var Generator = createChanceProxyGenerator(method);
  return createGeneratorFacade(Generator);
};