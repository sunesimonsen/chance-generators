"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var WeightedGenerator = require("./WeightedGenerator");

var _require = require("./magicValues"),
    getMagicStrings = _require.getMagicStrings;

var MagicStringGenerator = function (_Generator) {
  _inherits(MagicStringGenerator, _Generator);

  function MagicStringGenerator(arg) {
    _classCallCheck(this, MagicStringGenerator);

    return _possibleConstructorReturn(this, (MagicStringGenerator.__proto__ || Object.getPrototypeOf(MagicStringGenerator)).call(this, "magicString"));
  }

  _createClass(MagicStringGenerator, [{
    key: "expand",
    value: function expand(generated) {
      return new WeightedGenerator([[this, 1], [generated, 1.5]]);
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var magicStrings = getMagicStrings();

      if (magicStrings.length > 0) {
        return chance.pickone(magicStrings);
      } else {
        return chance.string({ length: chance.natural({ min: 0, max: 30 }) });
      }
    }
  }]);

  return MagicStringGenerator;
}(Generator);

module.exports = MagicStringGenerator;