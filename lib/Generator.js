"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeneratorIterator = require("./GeneratorIterator");

var Generator = function () {
  function Generator(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Generator);

    this.isGenerator = true;
    this.generatorName = name;
    this.options = options;
  }

  _createClass(Generator, [{
    key: "values",
    value: function values(options) {
      return new GeneratorIterator(this, options);
    }
  }, {
    key: "take",
    value: function take(count, options) {
      return this.values(options).take(count);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.generatorName || this.contructor.name || "generator";
    }
  }, {
    key: "map",
    value: function map(mapper) {
      var MappingGenerator = require("./MappingGenerator");
      return new MappingGenerator(this, mapper);
    }
  }]);

  return Generator;
}();

module.exports = Generator;