/*global define*/
(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('chance'))
  } else if (typeof define === 'function' && define.amd) {
    define(['chance'], factory)
  } else {
    root.weknowhow = root.weknowhow || {}
    root.weknowhow.chanceGenerators = factory(root.chance)
  }
})(this, function (Chance) {
  function ExtendedChance (seed) {
    if (!(this instanceof ExtendedChance)) {
      return new ExtendedChance(seed)
    }

    var that = this
    var chance = typeof seed === 'undefined'
        ? new Chance()
        : new Chance(seed)

    function unwrap (v) {
      if (Array.isArray(v)) {
        return v.map(unwrap)
      } else if (v && typeof v === 'object') {
        return Object.keys(v).reduce(function (result, key) {
          result[key] = unwrap(v[key])
          return result
        }, {})
      } else {
        return v && v.isGenerator ? v() : v
      }
    }

    function markGenerator (name, f) {
      f.isGenerator = true
      f.generatorName = name
      f.toString = function () {
        return name
      }
      return f
    }

    var overrides = {
      n: markGenerator('n', function (generator, count) {
        return markGenerator('n', function () {
          return chance.n(generator, unwrap(count))
        })
      }),
      unique: markGenerator('unique', function (generator, count, options) {
        return markGenerator('unique', function () {
          return chance.unique(generator, unwrap(count))
        })
      })
    }

    Object.keys(Chance.prototype).forEach(function (key) {
      var property = chance[key]
      if (typeof property === 'function') {
        if (overrides[key]) {
          that[key] = overrides[key]
        } else {
          that[key] = markGenerator(key, function () {
            if (arguments.length === 0) {
              return property.apply(chance, arguments)
            } else {
              var args = Array.prototype.slice.call(arguments)
              return markGenerator(key, function () {
                return property.apply(chance, args.map(unwrap))
              })
            }
          })
        }
      } else {
        that[key] = property
      }
    })
  }

  return ExtendedChance
})
