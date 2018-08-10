let cache = {};
let cacheBase = {};

Number.isFinite =
  Number.isFinite ||
  function(value) {
    return typeof value === "number" && isFinite(value);
  };

Number.isInteger =
  Number.isInteger ||
  function(value) {
    return Number.isFinite(value) && Math.floor(value) === value;
  };

const getMagicValues = () =>
  (typeof global === "object" &&
    global.recordLocation &&
    global.recordLocation.magicValues) ||
  [];

const invalidateCacheIfNecessary = () => {
  const magicValues = getMagicValues();
  const isCacheInvalid =
    cacheBase.size !== magicValues.length ||
    cacheBase.magicValues !== magicValues;

  if (isCacheInvalid) {
    cache = {};
    cacheBase = {
      magicValues: magicValues,
      size: magicValues.length
    };
  }
};

const getMagicStrings = () => {
  invalidateCacheIfNecessary();

  if (!cache.strings) {
    cache.strings = getMagicValues().filter(v => typeof v === "string");
  }

  return cache.strings;
};

const getMagicIntegers = () => {
  invalidateCacheIfNecessary();

  if (!cache.integer) {
    cache.integer = getMagicValues().filter(v => Number.isInteger(v));
  }

  return cache.integer;
};

const getMagicFloating = () => {
  invalidateCacheIfNecessary();

  if (!cache.floating) {
    cache.floating = getMagicValues().filter(
      v => Number.isFinite(v) && !Number.isInteger(v)
    );
  }

  return cache.floating;
};

module.exports = {
  getMagicFloating,
  getMagicIntegers,
  getMagicStrings,
  getMagicValues
};
