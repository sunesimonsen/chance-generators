"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var StringSplicerGenerator = require("./StringSplicerGenerator");

var StringGenerator = function (_Generator) {
  _inherits(StringGenerator, _Generator);

  function StringGenerator() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === undefined ? 30 : _ref$max,
        pool = _ref.pool;

    _classCallCheck(this, StringGenerator);

    var options = { min: min, max: max };
    if (pool) {
      options.pool = pool;
    }

    return _possibleConstructorReturn(this, (StringGenerator.__proto__ || Object.getPrototypeOf(StringGenerator)).call(this, "string", options));
  }

  _createClass(StringGenerator, [{
    key: "shrink",
    value: function shrink(text) {
      if (text.length === 0) {
        return new ConstantGenerator("");
      }

      return new StringSplicerGenerator(text, { min: this.options.min });
    }
  }, {
    key: "expand",
    value: function expand(data) {
      return this.map(function (text, chance) {
        var margin = Math.max(Math.min(Math.floor((text.length - data.length) / 2), Math.ceil(data.length * 0.3)), 0);

        var includeLeftMargin = chance.bool({ likelihood: 70 });
        var includeRightMargin = chance.bool({ likelihood: 70 });

        var marginLength = (includeLeftMargin ? margin : 0) + (includeRightMargin ? margin : 0);

        var result = new Array(marginLength + data.length);

        var i = 0;
        if (includeLeftMargin) {
          while (i < margin) {
            result[i] = text[i++];
          }
        }

        for (var j = 0; j < data.length; i++, j++) {
          result[i] = chance.bool({ likelihood: 95 }) ? data[j] : text[i % text.length];
        }

        if (includeRightMargin) {
          while (i < result.length) {
            result[i] = text[i++];
          }
        }

        return result.join("");
      });
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var _options = this.options,
          min = _options.min,
          max = _options.max,
          pool = _options.pool;

      return chance.string({ length: chance.natural({ min: min, max: max }), pool: pool });
    }
  }]);

  return StringGenerator;
}(Generator);

module.exports = StringGenerator;