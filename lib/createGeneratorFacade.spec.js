"use strict";

var expect = require("../test/expect");
var createGeneratorFacade = require("./createGeneratorFacade");
var IntegerGenerator = require("./IntegerGenerator");
var ArrayGenerator = require("./ArrayGenerator");
var Chance = require("chance");
var Context = require("./Context");

describe("createGeneratorFacade(IntegerGenerator)", function () {
  var array = function array() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(ArrayGenerator, [null].concat(args)))();
  };
  var integer = createGeneratorFacade(IntegerGenerator);

  it("returns a function that has the same properties as the given generator", function () {
    expect(integer, "to satisfy", {
      expand: expect.it("to be a function"),
      generate: expect.it("to be a function"),
      generatorName: "integer",
      isGenerator: true,
      shrink: expect.it("to be a function"),
      take: expect.it("to be a function"),
      toString: expect.it("to be a function"),
      values: expect.it("to be a function")
    });
  });

  describe("values", function () {
    it("returns the same values as the raw generator", function () {
      expect(integer.take(4, { skipSeedCache: true }), "to equal", new IntegerGenerator().take(4, { skipSeedCache: true }));
    });
  });

  it("shrinks similarly to the raw generator", function () {
    expect(integer.shrink(5).take(4, { skipSeedCache: true }), "to equal", new IntegerGenerator().shrink(5).take(4, { skipSeedCache: true }));
  });

  it("expands similarly to the raw generator", function () {
    expect(integer.expand(5).take(4, { skipSeedCache: true }), "to equal", new IntegerGenerator().expand(5).take(4, { skipSeedCache: true }));
  });

  it("generates similarly to the raw generator", function () {
    expect(integer.generate(new Chance(42), new Context()), "to equal", new IntegerGenerator().generate(new Chance(42), new Context()));
  });

  describe("when called with arguments", function () {
    it("returns the same values as the raw generators created with the same arguments", function () {
      expect(integer({ min: -10, max: 10 }).take(4, { skipSeedCache: true }), "to equal", new IntegerGenerator({ min: -10, max: 10 }).take(4, {
        skipSeedCache: true
      }));
    });

    it("shrinks similarly to the raw generator", function () {
      expect(integer({ min: -10, max: 10 }).shrink(5).take(4, { skipSeedCache: true }), "to equal", new IntegerGenerator({ min: -10, max: 10 }).shrink(5).take(4, { skipSeedCache: true }));
    });

    it("expands similarly to the raw generator", function () {
      expect(integer({ min: -10, max: 10 }).expand(5).take(4, { skipSeedCache: true }), "to equal", new IntegerGenerator({ min: -10, max: 10 }).expand(5).take(4, { skipSeedCache: true }));
    });
  });

  it("returns a function that forwards all arguments to the underlying generator", function () {
    expect(array(integer({ min: -10, max: 10 }), { max: 10 }).take(4, {
      skipSeedCache: true
    }), "to equal", new ArrayGenerator(new IntegerGenerator({ min: -10, max: 10 }), {
      max: 10
    }).take(4, { skipSeedCache: true }));
  });
});