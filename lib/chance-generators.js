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

    function generatorFunction (name, args, f) {
      f.isGenerator = true
      f.generatorName = name
      f.args = args
      f.toString = function () {
        return name
      }
      return f
    }

    function createGenerator (name, args, omitUnwap) {
      var omitUnwrapIndex = {}

      omitUnwap && args.forEach(function (arg, i) {
        if (omitUnwap.indexOf(arg) !== -1) {
          omitUnwrapIndex[i] = true
        }
      })

      var g = generatorFunction(name, args, function () {
        if (arguments.length === 0) {
          return chance[name].apply(chance, args.map(function (arg, i) {
            return omitUnwrapIndex[i] ? arg : unwrap(arg)
          }))
        } else {
          return createGenerator(
            name,
            Array.prototype.slice.call(arguments)
          )
        }
      })

      return g
    }

    var overrides = {
      n: generatorFunction('n', [], function (generator, count) {
        return createGenerator('n', [generator, count], [generator])
      }),
      unique: generatorFunction('unique', [], function (generator, count, options) {
        return createGenerator('unique', [generator, count], [generator])
      })
    }

    Object.keys(Chance.prototype).forEach(function (key) {
      var property = chance[key]
      if (typeof property === 'function') {
        if (overrides[key]) {
          that[key] = overrides[key]
        } else {
          that[key] = createGenerator(key, [])
        }
      } else {
        that[key] = property
      }
    })
  }

  return ExtendedChance
})
