"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var WeightedGenerator = require("./WeightedGenerator");

var ArraySplicerGenerator = function (_Generator) {
  _inherits(ArraySplicerGenerator, _Generator);

  function ArraySplicerGenerator(items) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min;

    _classCallCheck(this, ArraySplicerGenerator);

    return _possibleConstructorReturn(this, (ArraySplicerGenerator.__proto__ || Object.getPrototypeOf(ArraySplicerGenerator)).call(this, "arraySplicer", {
      items: items,
      min: min
    }));
  }

  _createClass(ArraySplicerGenerator, [{
    key: "shrink",
    value: function shrink(items) {
      if (items.length === 0) {
        return new ConstantGenerator([]);
      }

      var shrinkableData = items.length < 10 && items === this.lastUnwrappedValue && (this.lastValue || []).some(function (g) {
        return g && g.shrink;
      });

      var shrinkable = this.options.min < items.length || shrinkableData;

      if (!shrinkable) {
        return new ConstantGenerator(items);
      }

      if (shrinkableData) {
        items = this.lastValue.map(function (g, i) {
          return g && g.shrink ? g.shrink(items[i]) : items[i];
        });
      } else {
        items = this.lastValue;
      }

      return new ArraySplicerGenerator(items, {
        min: this.options.min
      });
    }
  }, {
    key: "expand",
    value: function expand(items) {
      return new WeightedGenerator([[this, 1], [new ConstantGenerator(items), 1.5]]);
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var _options = this.options,
          min = _options.min,
          items = _options.items;

      var from = chance.natural({ max: items.length });
      var length = chance.natural({
        max: Math.min(items.length - from, items.length - min)
      });

      this.lastValue = items.slice();
      this.lastValue.splice(from, length);

      this.lastUnwrappedValue = this.lastValue.map(function (item) {
        return item && item.isGenerator ? item.generate(chance) : item;
      });

      return this.lastUnwrappedValue;
    }
  }]);

  return ArraySplicerGenerator;
}(Generator);

module.exports = ArraySplicerGenerator;