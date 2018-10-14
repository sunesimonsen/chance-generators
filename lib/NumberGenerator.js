"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var IntegerGenerator = require("./IntegerGenerator");
var FloatingGenerator = require("./FloatingGenerator");
var MagicFloatingGenerator = require("./MagicFloatingGenerator");
var MagicIntegerGenerator = require("./MagicIntegerGenerator");
var WeightedGenerator = require("./WeightedGenerator");
var PickoneGenerator = require("./PickoneGenerator");

var _require = require("./magicValues"),
    getMagicIntegers = _require.getMagicIntegers,
    getMagicFloating = _require.getMagicFloating;

var NumberGenerator = function (_Generator) {
  _inherits(NumberGenerator, _Generator);

  function NumberGenerator() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$integer = _ref.integer,
        integer = _ref$integer === undefined ? true : _ref$integer,
        _ref$floating = _ref.floating,
        floating = _ref$floating === undefined ? true : _ref$floating,
        _ref$infinity = _ref.infinity,
        infinity = _ref$infinity === undefined ? false : _ref$infinity,
        _ref$nan = _ref.nan,
        nan = _ref$nan === undefined ? false : _ref$nan;

    _classCallCheck(this, NumberGenerator);

    var options = {};
    var generators = [];

    if (floating) {
      options.floating = true;
      generators.push([new FloatingGenerator({ min: -100, max: 100 }), 30]);
      generators.push([new FloatingGenerator({ min: -10000, max: 10000 }), 20]);
      generators.push([new FloatingGenerator(), 5]);

      if (getMagicFloating().length) {
        generators.push([new MagicFloatingGenerator(), 5]);
      }
    }

    if (integer) {
      options.integer = true;
      generators.push([new IntegerGenerator({ min: -100, max: 100 }), 30]);
      generators.push([new IntegerGenerator({ min: -10000, max: 10000 }), 20]);
      generators.push([new IntegerGenerator(), 5]);
      generators.push([new PickoneGenerator([-0, +0]), 0.1]);

      if (getMagicIntegers().length) {
        generators.push([new MagicIntegerGenerator(), 5]);
        generators.push([new MagicIntegerGenerator().map(function (v) {
          return v + 1;
        }), 5]);
        generators.push([new MagicIntegerGenerator().map(function (v) {
          return v - 1;
        }), 5]);
      }
    }

    if (infinity) {
      options.infinity = true;
      generators.push([new PickoneGenerator([Infinity, -Infinity]), 0.5]);
    }

    if (nan) {
      options.nan = true;
      generators.push([NaN, 0.1]);
    }

    var _this = _possibleConstructorReturn(this, (NumberGenerator.__proto__ || Object.getPrototypeOf(NumberGenerator)).call(this, "number", options));

    if (Object.keys(options).length === 0) {
      throw new Error("You must include at least one of the options for the number generator: integer, floating, infinity, nan");
    }

    _this.composedGenerator = new WeightedGenerator(generators);
    return _this;
  }

  _createClass(NumberGenerator, [{
    key: "shrink",
    value: function shrink(number) {
      return this.composedGenerator.shrink(number);
    }
  }, {
    key: "expand",
    value: function expand(number) {
      return this.composedGenerator.expand(number);
    }
  }, {
    key: "generate",
    value: function generate(chance, context) {
      return this.composedGenerator.generate(chance, context);
    }
  }]);

  return NumberGenerator;
}(Generator);

module.exports = NumberGenerator;