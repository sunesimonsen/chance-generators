const unwrap = (shape, chance) => {
  if (!shape) {
    return shape;
  } else if (Array.isArray(shape)) {
    return shape.map(item => unwrap(item, chance));
  } else if (shape.isGenerator) {
    return shape.generate(chance);
  } else if (typeof shape === "object") {
    return Object.keys(shape).reduce((result, key) => {
      result[key] = unwrap(shape[key], chance);
      return result;
    }, {});
  } else {
    return shape;
  }
};

module.exports = unwrap;
