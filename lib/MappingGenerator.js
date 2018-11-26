"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var unwrap = require("./unwrap");

var MappingGenerator = function (_Generator) {
  _inherits(MappingGenerator, _Generator);

  function MappingGenerator(generator, mapper) {
    _classCallCheck(this, MappingGenerator);

    var _this = _possibleConstructorReturn(this, (MappingGenerator.__proto__ || Object.getPrototypeOf(MappingGenerator)).call(this, "map", { mapper: mapper }));

    _this.isMappedGenerator = true;
    _this.parentGenerator = generator;

    if (generator.shrink) {
      _this.shrink = function (value) {
        if (value === _this.lastMappedValue) {
          return generator.shrink(_this.lastValue).map(mapper);
        } else {
          return _this;
        }
      };
    }

    if (generator.expand) {
      _this.expand = function (value) {
        if (value === _this.lastMappedValue) {
          return generator.expand(_this.lastValue).map(mapper);
        } else {
          return _this;
        }
      };
    }
    return _this;
  }

  _createClass(MappingGenerator, [{
    key: "generate",
    value: function generate(chance, context) {
      this.lastValue = this.parentGenerator.generate(chance, context);

      var mapper = this.options.mapper;


      this.lastMappedValue = unwrap(mapper(this.lastValue, chance), chance, context);

      return this.lastMappedValue;
    }
  }]);

  return MappingGenerator;
}(Generator);

module.exports = MappingGenerator;