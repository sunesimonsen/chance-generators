"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var ArraySplicerGenerator = require("./ArraySplicerGenerator");
var PicksetGenerator = require("./PicksetGenerator");

var ArrayGenerator = function (_Generator) {
  _inherits(ArrayGenerator, _Generator);

  function ArrayGenerator(itemGenerator) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === undefined ? 30 : _ref$max;

    _classCallCheck(this, ArrayGenerator);

    var _this = _possibleConstructorReturn(this, (ArrayGenerator.__proto__ || Object.getPrototypeOf(ArrayGenerator)).call(this, "array", {
      itemGenerator: itemGenerator,
      min: min,
      max: max
    }));

    if (!itemGenerator || !itemGenerator.isGenerator) {
      throw new Error("The array generator requires an item generator as first argument");
    }
    return _this;
  }

  _createClass(ArrayGenerator, [{
    key: "shrink",
    value: function shrink(items) {
      if (items.length === 0) {
        return new ConstantGenerator([]);
      }

      var itemGenerator = this.options.itemGenerator;
      if (itemGenerator.shrink) {
        items = items.map(function (item) {
          return itemGenerator.shrink(item);
        });
      }

      return new ArraySplicerGenerator(items, {
        min: this.options.min
      });
    }
  }, {
    key: "expand",
    value: function expand(items) {
      var _options = this.options,
          itemGenerator = _options.itemGenerator,
          min = _options.min,
          max = _options.max;


      return new PicksetGenerator([itemGenerator].concat(_toConsumableArray(items)), {
        min: min,
        max: max
      });
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var _options2 = this.options,
          itemGenerator = _options2.itemGenerator,
          min = _options2.min,
          max = _options2.max;


      return chance.n(function () {
        return itemGenerator.generate(chance);
      }, chance.natural({ min: min, max: max }));
    }
  }]);

  return ArrayGenerator;
}(Generator);

module.exports = ArrayGenerator;