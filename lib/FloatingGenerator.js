"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var WeightedGenerator = require("./WeightedGenerator");

var MAX_INT = Number.MAX_SAFE_INTEGER || 9007199254740991;

var FloatingGenerator = function (_Generator) {
  _inherits(FloatingGenerator, _Generator);

  function FloatingGenerator() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$name = _ref.name,
        name = _ref$name === undefined ? "floating" : _ref$name,
        _ref$fixed = _ref.fixed,
        fixed = _ref$fixed === undefined ? 4 : _ref$fixed,
        _ref$min = _ref.min,
        min = _ref$min === undefined ? -(MAX_INT / Math.pow(10, fixed)) : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === undefined ? MAX_INT / Math.pow(10, fixed) : _ref$max;

    _classCallCheck(this, FloatingGenerator);

    return _possibleConstructorReturn(this, (FloatingGenerator.__proto__ || Object.getPrototypeOf(FloatingGenerator)).call(this, name, {
      min: min,
      max: max,
      fixed: fixed
    }));
  }

  _createClass(FloatingGenerator, [{
    key: "shrink",
    value: function shrink(value) {
      if (value < 0 && value < this.options.max) {
        return new FloatingGenerator({
          min: value,
          max: Math.min(0, this.options.max)
        });
      } else if (value > 0 && value > this.options.min) {
        return new FloatingGenerator({
          min: Math.max(0, this.options.min),
          max: value
        });
      } else {
        return new ConstantGenerator(value);
      }
    }
  }, {
    key: "expand",
    value: function expand(value) {
      return new WeightedGenerator([[new ConstantGenerator(value), 2], [new FloatingGenerator({
        min: Math.max(value - 100, this.options.min),
        max: Math.min(value + 100, this.options.max)
      }), 1], [this, 2]]);
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      return chance.floating(this.options);
    }
  }]);

  return FloatingGenerator;
}(Generator);

module.exports = FloatingGenerator;