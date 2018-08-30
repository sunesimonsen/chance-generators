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

const getMagicValuesSet = () =>
  typeof global === "object" &&
  global.recordLocation &&
  global.recordLocation.magicValues;

const getMagicValues = () => {
  const magicValuesSet = getMagicValuesSet();

  return (magicValuesSet && Array.from(magicValuesSet)) || [];
};

const invalidateCacheIfNecessary = () => {
  const magicValuesSet = getMagicValuesSet();

  const isCacheInvalid =
    !magicValuesSet ||
    cacheBase.size !== magicValuesSet.size ||
    cacheBase.magicValuesSet !== magicValuesSet;

  if (isCacheInvalid) {
    cache = {};
    cacheBase = {
      magicValuesSet: magicValuesSet,
      size: magicValuesSet ? magicValuesSet.size : 0
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
