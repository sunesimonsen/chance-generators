"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chanceCache = require("./chanceCache");
var Chance = require("chance");
var Context = require("./Context");

var GeneratorIterator = function () {
  function GeneratorIterator(generator) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$seed = _ref.seed,
        seed = _ref$seed === undefined ? 42 : _ref$seed,
        _ref$skipSeedCache = _ref.skipSeedCache,
        skipSeedCache = _ref$skipSeedCache === undefined ? false : _ref$skipSeedCache;

    _classCallCheck(this, GeneratorIterator);

    this.isGeneratorIterator = true;
    this.isShrinkable = Boolean(generator.shrink);
    this.isExpandable = Boolean(generator.expand);
    this.generator = generator;
    this.seed = seed == null ? Math.round(Math.random() * 10000) : seed;
    this.context = new Context();

    if (skipSeedCache) {
      this.chance = new Chance(seed);
    } else {
      this.chance = chanceCache.get(seed);
    }
  }

  _createClass(GeneratorIterator, [{
    key: "shrink",
    value: function shrink(value) {
      if (this.isShrinkable) {
        this.generator = this.generator.shrink(value);
        this.context = new Context();
        this.isShrinkable = Boolean(this.generator.shrink);
      }
    }
  }, {
    key: "expand",
    value: function expand(value) {
      if (this.isExpandable) {
        this.generator = this.generator.expand(value);
        this.context = new Context();
        this.isExpandable = Boolean(this.generator.expand);
      }
    }
  }, {
    key: "take",
    value: function take(count) {
      if (typeof count !== "number" || count < 1) {
        throw new Error("The take method requires a positive number as parameter");
      }

      var result = new Array(count);
      for (var i = 0; i < count; i += 1) {
        result[i] = this.next();
      }
      return result;
    }
  }, {
    key: "next",
    value: function next() {
      return this.generator.generate(this.chance, this.context);
    }
  }]);

  return GeneratorIterator;
}();

module.exports = GeneratorIterator;