"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var cache = {};
var cacheBase = {};

Number.isFinite = Number.isFinite || function (value) {
  return typeof value === "number" && isFinite(value);
};

Number.isInteger = Number.isInteger || function (value) {
  return Number.isFinite(value) && Math.floor(value) === value;
};

var getMagicValuesSet = function getMagicValuesSet() {
  return (typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" && global.recordLocation && global.recordLocation.magicValues;
};

var getMagicValues = function getMagicValues() {
  var magicValuesSet = getMagicValuesSet();

  return magicValuesSet && (Array.isArray(magicValuesSet) ? [].concat(magicValuesSet) : Array.from(magicValuesSet)) || [];
};

var invalidateCacheIfNecessary = function invalidateCacheIfNecessary() {
  var magicValuesSet = getMagicValuesSet();

  var isCacheInvalid = !magicValuesSet || cacheBase.size !== magicValuesSet.size || cacheBase.magicValuesSet !== magicValuesSet;

  if (isCacheInvalid) {
    cache = {};
    cacheBase = {
      magicValuesSet: magicValuesSet,
      size: magicValuesSet ? magicValuesSet.size : 0
    };
  }
};

var getMagicStrings = function getMagicStrings() {
  invalidateCacheIfNecessary();

  if (!cache.strings) {
    cache.strings = getMagicValues().filter(function (v) {
      return typeof v === "string";
    });
  }

  return cache.strings;
};

var getMagicIntegers = function getMagicIntegers() {
  invalidateCacheIfNecessary();

  if (!cache.integer) {
    cache.integer = getMagicValues().filter(function (v) {
      return Number.isInteger(v);
    });
  }

  return cache.integer;
};

var getMagicFloating = function getMagicFloating() {
  invalidateCacheIfNecessary();

  if (!cache.floating) {
    cache.floating = getMagicValues().filter(function (v) {
      return Number.isFinite(v) && !Number.isInteger(v);
    });
  }

  return cache.floating;
};

module.exports = {
  getMagicFloating: getMagicFloating,
  getMagicIntegers: getMagicIntegers,
  getMagicStrings: getMagicStrings,
  getMagicValues: getMagicValues
};