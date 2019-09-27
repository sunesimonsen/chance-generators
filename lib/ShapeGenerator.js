"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var ConstantGenerator = require("./ConstantGenerator");
var WeightedGenerator = require("./WeightedGenerator");
var unwrap = require("./unwrap");

var containsGeneratorsMatching = function containsGeneratorsMatching(shape, predicate) {
  if (!shape) {
    return false;
  } else if (Array.isArray(shape)) {
    return shape.some(function (item) {
      return containsGeneratorsMatching(item, predicate);
    });
  } else if (shape.isGenerator) {
    return predicate(shape);
  } else if ((typeof shape === "undefined" ? "undefined" : _typeof(shape)) === "object") {
    return Object.keys(shape).some(function (key) {
      return containsGeneratorsMatching(shape[key], predicate);
    });
  } else {
    return false;
  }
};

var _shrink = function _shrink(shape, generated) {
  if (!shape) {
    return shape;
  } else if (Array.isArray(shape)) {
    return shape.map(function (item, i) {
      return _shrink(item, generated[i]);
    });
  } else if (shape.isGenerator) {
    return shape.shrink ? shape.shrink(generated) : shape;
  } else if ((typeof shape === "undefined" ? "undefined" : _typeof(shape)) === "object") {
    return Object.keys(shape).reduce(function (result, key) {
      result[key] = _shrink(shape[key], generated[key]);
      return result;
    }, {});
  } else {
    return shape;
  }
};

var _expand = function _expand(shape, generated) {
  if (!shape) {
    return shape;
  } else if (Array.isArray(shape)) {
    return shape.map(function (item, i) {
      return _expand(item, generated[i]);
    });
  } else if (shape.isGenerator) {
    return shape.expand ? shape.expand(generated) : shape;
  } else if ((typeof shape === "undefined" ? "undefined" : _typeof(shape)) === "object") {
    return Object.keys(shape).reduce(function (result, key) {
      result[key] = _expand(shape[key], generated[key]);
      return result;
    }, {});
  } else {
    return shape;
  }
};

var ShapeGenerator = function (_Generator) {
  _inherits(ShapeGenerator, _Generator);

  function ShapeGenerator(shape) {
    _classCallCheck(this, ShapeGenerator);

    return _possibleConstructorReturn(this, (ShapeGenerator.__proto__ || Object.getPrototypeOf(ShapeGenerator)).call(this, "shape", shape));
  }

  _createClass(ShapeGenerator, [{
    key: "shrink",
    value: function shrink(generated) {
      var isShrinkable = containsGeneratorsMatching(this.options, function (generator) {
        return Boolean(generator.shrink);
      });

      if (isShrinkable) {
        return new ShapeGenerator(_shrink(this.options, generated));
      } else {
        return new ConstantGenerator(generated);
      }
    }
  }, {
    key: "expand",
    value: function expand(generated) {
      var isExpandable = containsGeneratorsMatching(this.options, function (generator) {
        return Boolean(generator.expand);
      });

      if (isExpandable) {
        return new WeightedGenerator([[new ShapeGenerator(_expand(this.options, generated)), 1], [new ConstantGenerator(generated), 1.5]]);
      } else {
        return new WeightedGenerator([[this, 1], [new ConstantGenerator(generated), 1.5]]);
      }
    }
  }, {
    key: "generate",
    value: function generate(chance, context) {
      return unwrap(this.options, chance, context);
    }
  }]);

  return ShapeGenerator;
}(Generator);

module.exports = ShapeGenerator;