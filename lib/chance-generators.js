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
  function copy (source) {
    var result = {}
    Object.keys(source).forEach(function (key) {
      result[key] = source[key]
    })
    return result
  }

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

  function ExtendedChance (seed) {
    if (!(this instanceof ExtendedChance)) {
      return new ExtendedChance(seed)
    }

    var that = this
    var chance = typeof seed === 'undefined'
        ? new Chance()
        : new Chance(seed)

    // Fix that pick provided a count of zero or one does not return an array
    var originalPick = Chance.prototype.pick
    chance.pick = function (array, count) {
      if (count === 0) {
        return []
      }

      if (count === 1) {
        return [originalPick.call(chance, array, count)]
      }

      return originalPick.call(chance, array, count)
    }

    chance.shape = function (data) {
      return unwrap(data)
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

    function installMapFunction (generator) {
      generator.map = function (f) {
        var lastValue, lastMappedValue
        var mapGenerator = generatorFunction(generator.name + '.map', [], function () {
          lastValue = generator()
          lastMappedValue = f(lastValue)
          return lastMappedValue
        })

        mapGenerator.shrink = function (value) {
          if (value === lastMappedValue) {
            return generator.shrink(lastValue).map(f)
          } else {
            return generator
          }
        }

        installMapFunction(mapGenerator)

        return mapGenerator
      }
    }

    var overrides = {
      n: function (generator, count) {
        return createGenerator('n', [generator, count], [generator])
      },
      pickset: function (data, count) {
        var picksetGenerator = generatorFunction('pickset', [data, count], function () {
          picksetGenerator.lastValue = chance.pickset(data, unwrap(count))
          picksetGenerator.lastUnwrappedValue = unwrap(picksetGenerator.lastValue)
          return picksetGenerator.lastUnwrappedValue
        })

        installMapFunction(picksetGenerator)

        picksetGenerator.shrink = function (data) {
          return shrinkers.pickset(picksetGenerator, data)
        }

        return picksetGenerator
      },
      unique: function (generator, count, options) {
        return createGenerator('unique', [generator, count], [generator])
      }
    }

    function minMaxShrinker (generator, data) {
      var currentLimits = generator.args[0] || {}
      var limits = copy(currentLimits)

      var value = typeof data === 'string'
        ? parseFloat(data.replace(/^[^\d]*/, ''))
        : data

      if (value < 0 && value < (currentLimits.max || 0)) {
        var max = currentLimits.max || 0
        limits = {
          min: value,
          max: Math.min(0, max)
        }
      } else if (value > 0 && value > (currentLimits.min || 0)) {
        var min = currentLimits.min || 0
        limits = {
          min: Math.max(0, min),
          max: value
        }
      } else {
        return that.identity(data)
      }

      return that[generator.generatorName](limits)
    }

    var shrinkers = {
      n: function (generator, data) {
        if (data.length === 0) {
          return that.identity(data)
        }

        var count = generator.args[1]
        if (count && count.shrink) {
          count = count.shrink(data.length)
        } else {
          count = data.length
        }

        var dataGenerator = generator.args[0]
        if (dataGenerator.shrink) {
          return that.pickset(data.map(dataGenerator.shrink), count)
        } else {
          return that.pickset(data, count)
        }
      },
      pick: function (generator, data) {
        if (Array.isArray(data)) {
          return shrinkers.pickset(generator, data)
        } else {
          return shrinkers.pickone(generator, data)
        }
      },
      pickone: function (generator, data) {
        return that.identity(data)
      },
      pickset: function (generator, data) {
        if (data.length === 0) {
          return that.identity(data)
        }

        var shrinkable = false
        var count = generator.args[1]
        if (count && count.shrink) {
          shrinkable = true
          count = count.shrink(data.length)
        }

        var shrinkableData = (generator.lastValue || []).some(function (g) {
          return g && g.shrink
        })

        shrinkable = shrinkable || shrinkableData

        if (shrinkableData && data.length < 10 && generator.lastUnwrappedValue === data) {
          data = generator.lastValue.map(function (g, i) {
            return g && g.shrink
              ? g.shrink(data[i])
              : data[i]
          })
        }

        if (!shrinkable) {
          return that.identity(data)
        }

        return that.pickset(data, count)
      },
      unique: function (generator, data) {
        var count = generator.args[1]
        if (count && count.shrink) {
          count = count.shrink(data.length)
        } else {
          count = data.length
        }

        var dataGenerator = generator.args[0]
        if (dataGenerator.shrink) {
          return that.pickset(data.map(dataGenerator.shrink), count)
        } else {
          return that.pickset(data, count)
        }
      },
      shape: function (generator, data) {
        var shapeGenerators = generator.args[0]
        var shrunk = false
        var newShape = Object.keys(shapeGenerators).reduce(function (result, key) {
          var entry = shapeGenerators[key]
          if (entry && typeof entry.shrink === 'function') {
            shrunk = true
            result[key] = entry.shrink(data[key])
          } else {
            result[key] = entry
          }

          return result
        }, {})

        if (shrunk) {
          return that.shape(newShape)
        } else {
          return that.identity(data)
        }
      },
      string: function (generator, data) {
        var currentLimits = generator.args[0] || {}
        var limits = copy(currentLimits)

        var pool = {}
        for (var i = 0; i < data.length; i += 1) {
          pool[data[i]] = true
        }
        limits.pool = Object.keys(pool).join('')

        if (data.length === 0) {
          return that.identity(data)
        } else if (typeof limits.length === 'undefined') {
          limits.length = that.integer({ min: 0, max: data.length })
        } else if (limits.length && limits.length.shrink) {
          limits.length = limits.length.shrink(data.length)
        } else {
          return that.identity(data)
        }

        return that.string(limits)
      },
      integer: minMaxShrinker,
      natural: minMaxShrinker,
      floating: minMaxShrinker,
      year: minMaxShrinker,
      altitude: minMaxShrinker,
      depth: minMaxShrinker,
      latitude: minMaxShrinker,
      longitude: minMaxShrinker,
      dollar: minMaxShrinker
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

      var shrinker = shrinkers[name]
      if (shrinker) {
        g.shrink = function (data) {
          return shrinker(g, data)
        }
      } else {
        g.shrink = function (data) {
          return that.identity(data)
        }
      }

      installMapFunction(g)

      return g
    }

    ['shape'].concat(Object.keys(Chance.prototype)).forEach(function (key) {
      var property = chance[key]
      if (typeof property === 'function') {
        if (overrides[key]) {
          that[key] = generatorFunction(key, [], overrides[key])
        } else {
          that[key] = createGenerator(key, [])
        }
      } else {
        that[key] = property
      }
    })

    that.identity = generatorFunction('identity', [], function (data) {
      var identityGenerator = generatorFunction('identity', [data], function () {
        return data
      })

      identityGenerator.map = function (fn) {
        return that.identity(fn(data))
      }

      return identityGenerator
    })

    that.array = generatorFunction('array', [], function (generator, count) {
      if (typeof count === 'undefined') {
        return that.n(generator, that.natural({ max: 50 }))
      } else {
        return that.n(generator, count)
      }
    })
  }

  return ExtendedChance
})
