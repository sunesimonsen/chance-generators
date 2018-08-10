"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var WeightedGenerator = require("./WeightedGenerator");

var ShuffleGenerator = function (_Generator) {
  _inherits(ShuffleGenerator, _Generator);

  function ShuffleGenerator() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, ShuffleGenerator);

    var _this = _possibleConstructorReturn(this, (ShuffleGenerator.__proto__ || Object.getPrototypeOf(ShuffleGenerator)).call(this, "shuffle", {
      items: items
    }));

    if (items.length === 0) {
      throw new Error("Shuffle require a non-empty array of items");
    }
    return _this;
  }

  _createClass(ShuffleGenerator, [{
    key: "shrink",
    value: function shrink(items) {
      var shrinkable = items === this.lastUnwrappedValue && (this.lastValue || []).some(function (g) {
        return g && g.shrink;
      });

      if (shrinkable) {
        return new ShuffleGenerator(this.lastValue.map(function (g, i) {
          return g && g.shrink ? g.shrink(items[i]) : items[i];
        }));
      } else {
        return new ConstantGenerator(items);
      }
    }
  }, {
    key: "expand",
    value: function expand(items) {
      return new WeightedGenerator([[this, 1], [new ConstantGenerator(items), 1.5]]);
    }
  }, {
    key: "generate",
    value: function generate(chance) {
      var items = this.options.items;


      this.lastValue = chance.shuffle(items);

      this.lastUnwrappedValue = this.lastValue.map(function (item) {
        return item && item.isGenerator ? item.generate(chance) : item;
      });

      return this.lastUnwrappedValue;
    }
  }]);

  return ShuffleGenerator;
}(Generator);

module.exports = ShuffleGenerator;