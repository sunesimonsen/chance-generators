"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var WeightedGenerator = require("./WeightedGenerator");
var NumberGenerator = require("./NumberGenerator");
var TextGenerator = require("./TextGenerator");
var PickoneGenerator = require("./PickoneGenerator");
var createChanceProxyGeneratorFacade = require("./createChanceProxyGeneratorFacade");

var PrimitiveGenerator = function (_Generator) {
  _inherits(PrimitiveGenerator, _Generator);

  function PrimitiveGenerator() {
    _classCallCheck(this, PrimitiveGenerator);

    var _this = _possibleConstructorReturn(this, (PrimitiveGenerator.__proto__ || Object.getPrototypeOf(PrimitiveGenerator)).call(this, "primitive"));

    _this.composedGenerator = new WeightedGenerator([[new NumberGenerator(), 10], [new TextGenerator(), 10], [new PickoneGenerator([null, undefined]), 1], [createChanceProxyGeneratorFacade("bool"), 1]]);
    return _this;
  }

  _createClass(PrimitiveGenerator, [{
    key: "shrink",
    value: function shrink(value) {
      return this.composedGenerator.shrink(value);
    }
  }, {
    key: "expand",
    value: function expand(value) {
      return this.composedGenerator.expand(value);
    }
  }, {
    key: "generate",
    value: function generate(chance, context) {
      return this.composedGenerator.generate(chance, context);
    }
  }]);

  return PrimitiveGenerator;
}(Generator);

module.exports = PrimitiveGenerator;