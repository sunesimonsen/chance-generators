const Chance = require("chance");

let cache = Object.create(null);

module.exports = {
  get(seed) {
    if (!cache[seed]) {
      cache[seed] = new Chance(seed);
    }
    return cache[seed];
  },
  clear() {
    cache = Object.create(null);
  }
};
