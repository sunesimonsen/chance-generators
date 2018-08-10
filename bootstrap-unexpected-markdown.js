global.unexpected = require("unexpected");
const chanceCache = require("./src/chanceCache");

const index = require("./src");
Object.keys(index).forEach(prop => {
  Object.defineProperty(global, prop, {
    get() {
      chanceCache.clear();
      return index[prop];
    }
  });
});
