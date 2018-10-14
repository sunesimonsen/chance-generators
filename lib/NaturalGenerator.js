"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegerGenerator = require("./IntegerGenerator");

var NaturalGenerator = function (_IntegerGenerator) {
  _inherits(NaturalGenerator, _IntegerGenerator);

  function NaturalGenerator() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$name = _ref.name,
        name = _ref$name === undefined ? "natural" : _ref$name,
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === undefined ? Number.MAX_SAFE_INTEGER || 9007199254740991 : _ref$max;

    _classCallCheck(this, NaturalGenerator);

    if (min < 0) {
      throw new Error("Chance: Min cannot be less than zero.");
    }

    return _possibleConstructorReturn(this, (NaturalGenerator.__proto__ || Object.getPrototypeOf(NaturalGenerator)).call(this, {
      name: name,
      min: min,
      max: max
    }));
  }

  return NaturalGenerator;
}(IntegerGenerator);

module.exports = NaturalGenerator;