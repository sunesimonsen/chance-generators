"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");

var PicksetGenerator = function (_Generator) {
  _inherits(PicksetGenerator, _Generator);

  function PicksetGenerator() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === undefined ? items.length : _ref$max;

    _classCallCheck(this, PicksetGenerator);

    var _this = _possibleConstructorReturn(this, (PicksetGenerator.__proto__ || Object.getPrototypeOf(PicksetGenerator)).call(this, "pickset", {
      items: items,
      min: min,
      max: max
    }));

    if (items.length === 0) {
      throw new Error("Pickset require a non-empty array of items");
    }
    return _this;
  }

  _createClass(PicksetGenerator, [{
    key: "shrink",
    value: function shrink(items) {
      if (items.length === 0) {
        return new ConstantGenerator([]);
      }

      var shrinkableData = items.length < 10 && items === this.lastUnwrappedValue && (this.lastValue || []).some(function (g) {
        return g && g.shrink;
      });

      var shrinkable = items.length < this.options.max || shrinkableData;

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

      return new PicksetGenerator(items, {
        min: this.options.min,
        max: items.length
      });
    }
  }, {
    key: "expand",
    value: function expand(data) {
      return this.map(function (items, chance) {
        var margin = Math.max(Math.min(Math.floor((items.length - data.length) / 2), Math.ceil(data.length * 0.3)), 0);

        var includeLeftMargin = chance.bool({ likelihood: 70 });
        var includeRightMargin = chance.bool({ likelihood: 70 });

        var marginLength = (includeLeftMargin ? margin : 0) + (includeRightMargin ? margin : 0);

        var result = new Array(marginLength + data.length);

        var i = 0;
        if (includeLeftMargin) {
          while (i < margin) {
            result[i] = items[i++];
          }
        }

        for (var j = 0; j < data.length; i++, j++) {
          result[i] = chance.bool({ likelihood: 95 }) ? data[j] : items[i % items.length];
        }

        if (includeRightMargin) {
          while (i < result.length) {
            result[i] = items[i++];
          }
        }

        return result;
      });
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var _options = this.options,
          items = _options.items,
          min = _options.min,
          max = _options.max;


      this.lastValue = chance.pickset(items, chance.natural({ min: min, max: max }));

      this.lastUnwrappedValue = this.lastValue.map(function (item) {
        return item && item.isGenerator ? item.generate(chance) : item;
      });

      return this.lastUnwrappedValue;
    }
  }]);

  return PicksetGenerator;
}(Generator);

module.exports = PicksetGenerator;