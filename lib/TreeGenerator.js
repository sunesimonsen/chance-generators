"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Generator = require("./Generator");
var ArrayGenerator = require("./ArrayGenerator");

var sliceToTree = function sliceToTree(items, start, end, chance) {
  var size = end - start;

  if (size === 1) {
    return items[start];
  }

  if (size === 2) {
    return items.slice(start, end);
  }

  var offset = 0;
  var result = [];

  while (offset + start < end) {
    var remainding = end - (start + offset);
    var count = Math.max(1, chance.natural({ max: size }) % remainding);
    var tree = sliceToTree(items, start + offset, start + offset + count, chance);

    if (count === size) {
      result.push.apply(result, _toConsumableArray(tree));
    } else {
      result.push(tree);
    }

    offset += count;
  }

  return result;
};

var arrayToTree = function arrayToTree(items, chance) {
  if (items.length < 3) {
    return items;
  }

  return sliceToTree(items, 0, items.length, chance);
};

var mapLeaves = function mapLeaves(tree, mapper) {
  return Array.isArray(tree) ? tree.map(function (v) {
    return mapLeaves(v, mapper);
  }) : mapper(tree);
};

var countItems = function countItems(tree) {
  return Array.isArray(tree) ? tree.map(countItems).reduce(function (sum, count) {
    return sum + count;
  }, 0) : 1;
};

var TreeGenerator = function (_Generator) {
  _inherits(TreeGenerator, _Generator);

  function TreeGenerator(itemGenerator) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$min = _ref.min,
        min = _ref$min === undefined ? 0 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === undefined ? 30 : _ref$max;

    _classCallCheck(this, TreeGenerator);

    var _this = _possibleConstructorReturn(this, (TreeGenerator.__proto__ || Object.getPrototypeOf(TreeGenerator)).call(this, "tree", {
      itemGenerator: itemGenerator,
      min: min,
      max: max
    }));

    if (!itemGenerator || !itemGenerator.isGenerator) {
      throw new Error("The tree generator requires an item generator as first argument");
    }

    _this.composedGenerator = new ArrayGenerator(itemGenerator, {
      min: min,
      max: max
    }).map(arrayToTree);
    return _this;
  }

  _createClass(TreeGenerator, [{
    key: "expand",
    value: function expand(value) {
      return this.composedGenerator.expand(value);
    }
  }, {
    key: "shrink",
    value: function shrink(value) {
      return this.composedGenerator.shrink(value);
    }
  }, {
    key: "generate",
    value: function generate(chance, context) {
      return this.composedGenerator.generate(chance, context);
    }
  }]);

  return TreeGenerator;
}(Generator);

module.exports = TreeGenerator;