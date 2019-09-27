"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var WeightedGenerator = require("./WeightedGenerator");

var StringSplicerGenerator = function (_Generator) {
  _inherits(StringSplicerGenerator, _Generator);

  function StringSplicerGenerator(text) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min;

    _classCallCheck(this, StringSplicerGenerator);

    var _this = _possibleConstructorReturn(this, (StringSplicerGenerator.__proto__ || Object.getPrototypeOf(StringSplicerGenerator)).call(this, "stringSplicer", {
      text: text,
      min: min
    }));

    if (typeof text !== "string") {
      throw new Error("The string splicer generator requires a string as first argument");
    }
    return _this;
  }

  _createClass(StringSplicerGenerator, [{
    key: "shrink",
    value: function shrink(text) {
      var min = this.options.min;


      if (text.length === min) {
        return new ConstantGenerator(text);
      }

      return new StringSplicerGenerator(text, { min: min });
    }
  }, {
    key: "expand",
    value: function expand(text) {
      return new WeightedGenerator([[this, 1], [new ConstantGenerator(text), 1.5]]);
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var _options = this.options,
          min = _options.min,
          text = _options.text;

      var from = chance.natural({ max: text.length });
      var length = chance.natural({
        max: Math.min(text.length - from, text.length - min)
      });
      return text.slice(0, from) + text.slice(from + length);
    }
  }]);

  return StringSplicerGenerator;
}(Generator);

module.exports = StringSplicerGenerator;