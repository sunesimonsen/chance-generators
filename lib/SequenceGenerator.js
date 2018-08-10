"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var GeneratorIterator = require("./GeneratorIterator");
var ConstantGenerator = require("./ConstantGenerator");
var WeightedGenerator = require("./WeightedGenerator");
var unwrap = require("./unwrap");

var SequenceGenerator = function (_Generator) {
  _inherits(SequenceGenerator, _Generator);

  function SequenceGenerator(producer) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === undefined ? 30 : _ref$max,
        _ref$initialValue = _ref.initialValue,
        initialValue = _ref$initialValue === undefined ? null : _ref$initialValue;

    _classCallCheck(this, SequenceGenerator);

    var _this = _possibleConstructorReturn(this, (SequenceGenerator.__proto__ || Object.getPrototypeOf(SequenceGenerator)).call(this, "string", { producer: producer, min: min, max: max, initialValue: initialValue }));

    if (typeof producer !== "function") {
      throw new Error("The sequence generator requires a producer function as first argument");
    }
    return _this;
  }

  _createClass(SequenceGenerator, [{
    key: "values",
    value: function values() {
      return new GeneratorIterator(this);
    }
  }, {
    key: "shrink",
    value: function shrink(items) {
      if (items.length === this.options.min) {
        return new ConstantGenerator(items);
      }

      return new SequenceGenerator(this.options.producer, {
        min: this.options.min,
        max: items.length
      });
    }
  }, {
    key: "expand",
    value: function expand(items) {
      var _options = this.options,
          producer = _options.producer,
          max = _options.max,
          initialValue = _options.initialValue;


      var emptyContext = Object.keys(this.lastContext).length === 0;

      if (this.lastValue === items && items.length < max && emptyContext) {
        return new SequenceGenerator(producer, {
          min: 0,
          max: max - items.length,
          initialValue: items.length === 0 ? initialValue : items[items.length - 1]
        }).map(function (tail) {
          return items.concat(tail);
        });
      } else {
        return new WeightedGenerator([[this, 1], [new ConstantGenerator(items), 1.5]]);
      }
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var _options2 = this.options,
          producer = _options2.producer,
          min = _options2.min,
          max = _options2.max,
          initialValue = _options2.initialValue;


      var context = {};

      var count = chance.natural({ min: min, max: max });
      var result = [];

      for (var i = 0; i < count; i += 1) {
        result.push(unwrap(producer(i === 0 ? initialValue : result[i - 1], context), chance));
      }

      this.lastValue = result;
      this.lastContext = context;

      return this.lastValue;
    }
  }]);

  return SequenceGenerator;
}(Generator);

module.exports = SequenceGenerator;