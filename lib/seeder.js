"use strict";

var seed = 42;

var setSeed = function setSeed(newSeed) {
  seed = newSeed;
};

module.exports = {
  seed: seed,
  setSeed: setSeed
};