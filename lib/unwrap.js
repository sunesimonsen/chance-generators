"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var unwrap = function unwrap(shape, chance, context) {
  if (!shape) {
    return shape;
  } else if (Array.isArray(shape)) {
    return shape.map(function (item) {
      return unwrap(item, chance, context);
    });
  } else if (shape.isGenerator) {
    return shape.generate(chance, context);
  } else if ((typeof shape === "undefined" ? "undefined" : _typeof(shape)) === "object") {
    return Object.keys(shape).reduce(function (result, key) {
      result[key] = unwrap(shape[key], chance, context);
      return result;
    }, {});
  } else {
    return shape;
  }
};

module.exports = unwrap;