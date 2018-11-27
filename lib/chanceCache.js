"use strict";

var Chance = require("chance");

var cache = Object.create(null);

module.exports = {
  get: function get(seed) {
    if (!cache[seed]) {
      cache[seed] = new Chance(seed);
    }
    return cache[seed];
  },
  clear: function clear() {
    cache = Object.create(null);
  }
};