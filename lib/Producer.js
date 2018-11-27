"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = require("./Generator");
var unwrap = require("./unwrap");

var Producer = function (_Generator) {
  _inherits(Producer, _Generator);

  function Producer(producer, startValue) {
    _classCallCheck(this, Producer);

    var _this = _possibleConstructorReturn(this, (Producer.__proto__ || Object.getPrototypeOf(Producer)).call(this, "producer", { producer: producer, startValue: startValue }));

    if (typeof producer !== "function") {
      throw new Error("The producer has the signature producer((previous, context, chance) => { ... }, initialValue)");
    }
    return _this;
  }

  _createClass(Producer, [{
    key: "generate",
    value: function generate(chance, context) {
      var _options = this.options,
          producer = _options.producer,
          startValue = _options.startValue;


      var producerContext = context.childContext(producer);

      if (!producerContext.has("context")) {
        producerContext.set("context", {});
      }

      var value = producerContext.has("previous") || typeof startValue === "undefined" ? unwrap(producer(producerContext.get("previous"), producerContext.get("context"), chance), chance, context) : startValue;

      producerContext.set("previous", value);

      return value;
    }
  }]);

  return Producer;
}(Generator);

module.exports = Producer;