"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var unwrap = require("./unwrap");

var WeightedGenerator = function (_Generator) {
  _inherits(WeightedGenerator, _Generator);

  function WeightedGenerator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, WeightedGenerator);

    var _this = _possibleConstructorReturn(this, (WeightedGenerator.__proto__ || Object.getPrototypeOf(WeightedGenerator)).call(this, "weighted", options));

    if (options.length === 0) {
      throw new Error("Weighted require a non-empty array of items with weights");
    }
    return _this;
  }

  _createClass(WeightedGenerator, [{
    key: "shrink",
    value: function shrink(item) {
      if (this.lastUnwrappedValue === item && this.lastValue.shrink) {
        return this.lastValue.shrink(item);
      } else {
        return new ConstantGenerator(item);
      }
    }
  }, {
    key: "expand",
    value: function expand(item) {
      var _this2 = this;

      var isGeneratorItem = this.lastValue && this.lastValue.isGenerator;

      var expandableItem = this.lastUnwrappedValue === item && isGeneratorItem && this.lastValue.expand;

      var expandedItem = expandableItem ? this.lastValue.expand(item) : item;

      var maxWeight = this.options.reduce(function (result, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            item = _ref2[0],
            weight = _ref2[1];

        return Math.max(result, weight);
      }, -Infinity);

      var filteredOptions = expandableItem ? this.options : this.options.filter(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            optionItem = _ref4[0];

        return optionItem !== item && optionItem !== _this2.lastValue;
      });

      return new WeightedGenerator([].concat(_toConsumableArray(filteredOptions.slice(0, 20)), [[expandedItem, maxWeight * 1.5]]));
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var items = this.options.map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            item = _ref6[0],
            weight = _ref6[1];

        return item;
      });
      var weights = this.options.map(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            item = _ref8[0],
            weight = _ref8[1];

        return weight;
      });

      this.lastValue = chance.weighted(items, weights);
      this.lastUnwrappedValue = unwrap(this.lastValue, chance);

      return this.lastUnwrappedValue;
    }
  }]);

  return WeightedGenerator;
}(Generator);

module.exports = WeightedGenerator;