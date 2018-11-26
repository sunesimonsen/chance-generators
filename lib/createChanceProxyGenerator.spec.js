"use strict";

var expect = require("../test/expect");
var createChanceProxyGenerator = require("./createChanceProxyGenerator");
var createGeneratorFacade = require("./createGeneratorFacade");
var chanceCache = require("./chanceCache");

describe("createChanceProxyGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  it("generates a proxy generator based on a given chance method", function () {
    var DollarGenerator = createChanceProxyGenerator("dollar");
    var dollar = createGeneratorFacade(DollarGenerator);

    expect(dollar({ max: 20 }), "to yield items", ["$7.49", "$15.93", "$19.02", "$3.67"]);
  });
});