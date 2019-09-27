const unwrap = (shape, chance, context) => {
  if (!shape) {
    return shape;
  } else if (Array.isArray(shape)) {
    return shape.map(item => unwrap(item, chance, context));
  } else if (shape.isGenerator) {
    return shape.generate(chance, context);
  } else if (typeof shape === "object" && shape.constructor === Object) {
    return Object.keys(shape).reduce((result, key) => {
      result[key] = unwrap(shape[key], chance, context);
      return result;
    }, {});
  } else {
    return shape;
  }
};

module.exports = unwrap;
