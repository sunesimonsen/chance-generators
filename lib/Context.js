"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
  function Context() {
    _classCallCheck(this, Context);
  }

  _createClass(Context, [{
    key: "get",
    value: function get(key) {
      return this.data && this.data[key];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (!this.data) {
        this.data = Object.create(null);
      }
      this.data[key] = value;

      return this;
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.data && key in this.data;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return !this.data && !this.childContexts;
    }
  }, {
    key: "childContext",
    value: function childContext(key) {
      if (!this.childContexts) {
        this.childContexts = [];
      }

      for (var i = 0; i < this.childContexts.length; i += 1) {
        var entry = this.childContexts[i];
        if (entry.key === key) {
          return entry.context;
        }
      }

      var context = new Context();
      this.childContexts.push({ key: key, context: context });
      return context;
    }
  }]);

  return Context;
}();

module.exports = Context;