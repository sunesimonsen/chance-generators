"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var ArraySplicerGenerator = require("./ArraySplicerGenerator");
var WeightedGenerator = require("./WeightedGenerator");

var UniqueGenerator = function (_Generator) {
  _inherits(UniqueGenerator, _Generator);

  function UniqueGenerator(itemGenerator) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === undefined ? 20 : _ref$max,
        comparator = _ref.comparator;

    _classCallCheck(this, UniqueGenerator);

    var _this = _possibleConstructorReturn(this, (UniqueGenerator.__proto__ || Object.getPrototypeOf(UniqueGenerator)).call(this, "array", {
      itemGenerator: itemGenerator,
      min: min,
      max: max,
      comparator: comparator
    }));

    if (!itemGenerator || !itemGenerator.isGenerator) {
      throw new Error("The unique generator requires an item generator as first argument");
    }
    return _this;
  }

  _createClass(UniqueGenerator, [{
    key: "shrink",
    value: function shrink(items) {
      if (items.length === 0) {
        return new ConstantGenerator([]);
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
    value: function generate(chance, context) {
      var _options = this.options,
          itemGenerator = _options.itemGenerator,
          min = _options.min,
          max = _options.max,
          comparator = _options.comparator;


      return chance.unique(function () {
        return itemGenerator.generate(chance, context);
      }, chance.natural({ min: min, max: max }), comparator && { comparator: comparator });
    }
  }]);

  return UniqueGenerator;
}(Generator);

module.exports = UniqueGenerator;