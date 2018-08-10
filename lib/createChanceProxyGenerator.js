"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var unwrap = require("./unwrap");

var createChanceProxyGenerator = function createChanceProxyGenerator(method) {
  var ChanceProxyGenerator = function (_Generator) {
    _inherits(ChanceProxyGenerator, _Generator);

    function ChanceProxyGenerator() {
      _classCallCheck(this, ChanceProxyGenerator);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(this, (ChanceProxyGenerator.__proto__ || Object.getPrototypeOf(ChanceProxyGenerator)).call(this, method, args));
    }

    _createClass(ChanceProxyGenerator, [{
      key: "generate",
      value: function generate(chance) {
        return chance[this.generatorName].apply(chance, _toConsumableArray(unwrap(this.options, chance)));
      }
    }]);

    return ChanceProxyGenerator;
  }(Generator);

  return ChanceProxyGenerator;
};

module.exports = createChanceProxyGenerator;