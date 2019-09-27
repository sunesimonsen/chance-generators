"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var WeightedGenerator = require("./WeightedGenerator");
var unwrap = require("./unwrap");

var PickoneGenerator = function (_Generator) {
  _inherits(PickoneGenerator, _Generator);

  function PickoneGenerator() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, PickoneGenerator);

    var _this = _possibleConstructorReturn(this, (PickoneGenerator.__proto__ || Object.getPrototypeOf(PickoneGenerator)).call(this, "pickone", {
      items: items
    }));

    if (items.length === 0) {
      throw new Error("Pickone require a non-empty array of items");
    }
    return _this;
  }

  _createClass(PickoneGenerator, [{
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
      var expandableItem = this.lastUnwrappedValue === item && this.lastValue.expand;

      return new WeightedGenerator([[this, 10], [expandableItem ? this.lastValue.expand(item) : item, 15]]);
    }
  }, {
    key: "generate",
    value: function generate(chance, context) {
      var items = this.options.items;


      var index = chance.natural({ max: items.length - 1 });
      this.lastValue = items[index];

      this.lastUnwrappedValue = unwrap(this.lastValue, chance, context);

      return this.lastUnwrappedValue;
    }
  }]);

  return PickoneGenerator;
}(Generator);

module.exports = PickoneGenerator;