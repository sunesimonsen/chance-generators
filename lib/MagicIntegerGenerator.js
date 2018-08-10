"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var WeightedGenerator = require("./WeightedGenerator");

var _require = require("./magicValues"),
    getMagicIntegers = _require.getMagicIntegers;

var MagicIntegerGenerator = function (_Generator) {
  _inherits(MagicIntegerGenerator, _Generator);

  function MagicIntegerGenerator(arg) {
    _classCallCheck(this, MagicIntegerGenerator);

    return _possibleConstructorReturn(this, (MagicIntegerGenerator.__proto__ || Object.getPrototypeOf(MagicIntegerGenerator)).call(this, "magicInteger"));
  }

  _createClass(MagicIntegerGenerator, [{
    key: "expand",
    value: function expand(generated) {
      return new WeightedGenerator([[this, 1], [generated, 1.5]]);
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var magicIntegers = getMagicIntegers();

      if (magicIntegers.length > 0) {
        return chance.pickone(magicIntegers);
      } else {
        return chance.integer();
      }
    }
  }]);

  return MagicIntegerGenerator;
}(Generator);

module.exports = MagicIntegerGenerator;