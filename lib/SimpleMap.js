"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleMap = function () {
  function SimpleMap() {
    _classCallCheck(this, SimpleMap);

    this.keys = [];
    this.values = [];
  }

  _createClass(SimpleMap, [{
    key: "set",
    value: function set(key, value) {
      var index = this.keys.indexOf(key);

      if (index === -1) {
        this.keys.push(key);
        this.values.push(value);
      } else {
        this.keys[index] = key;
        this.values[index] = value;
      }
    }
  }, {
    key: "forEach",
    value: function forEach(cb) {
      for (var i = 0; i < this.keys.length; i += 1) {
        cb(this.values[i], this.keys[i]);
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      var index = this.keys.indexOf(key);

      return this.values[index];
    }
  }]);

  return SimpleMap;
}();

module.exports = typeof Map === "function" ? Map : SimpleMap;