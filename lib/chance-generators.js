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
    } else if (v && typeof v === 'object' && v.constructor === Object) {
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
        var mapGenerator = generatorFunction(generator.generatorName + '.map', [], function () {
          lastValue = generator()
          lastMappedValue = unwrap(f(lastValue, that))
          return lastMappedValue
        })

        mapGenerator.isMappedGenerator = true
        mapGenerator.parentGenerator = generator
        mapGenerator.mapFunction = f

        if (generator.shrink) {
          mapGenerator.shrink = function (value) {
            if (value === lastMappedValue) {
              return generator.shrink(lastValue).map(f)
            } else {
              return mapGenerator
            }
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
        return that.constant(data)
      }

      return that[generator.generatorName](limits)
    }

    var shrinkers = {
      n: function (generator, data) {
        if (data.length === 0) {
          return that.constant(data)
        }

        var length = generator.args[1]

        var minLength = 0

        if (typeof length === 'number') {
          minLength = length
        } else if (length && length.isGenerator && length.args[0] && length.args[0].min) {
          minLength = length.args[0].min
        }

        var dataGenerator = generator.args[0]
        if (dataGenerator.shrink) {
          return that.arraySplicer(data.map(dataGenerator.shrink), { min: minLength })
        } else {
          return that.arraySplicer(data, { min: minLength })
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
        return that.constant(data)
      },
      pickset: function (generator, data) {
        if (data.length === 0) {
          return that.constant(data)
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
        } else {
          data = generator.lastValue
        }

        if (!shrinkable) {
          return that.constant(data)
        }

        return that.pickset(data, count)
      },
      unique: function (generator, data) {
        if (data.length === 0) {
          return that.constant(data)
        }

        var count = generator.args[1]
        if (count && count.shrink) {
          count = count.shrink(data.length)
        } else {
          count = data.length
        }

        var dataGenerator = generator.args[0]

        return that.unique(dataGenerator, count)
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
          return that.constant(data)
        }
      },
      string: function (generator, data) {
        var options = generator.args[0] || {}

        if (data.length === 0) {
          return that.constant(data)
        }

        var minLength = 0

        if (typeof options.length === 'number') {
          minLength = options.length
        } else if (options.length && options.length.min) {
          minLength = options.length.min
        }

        return that.stringSplicer(data, { min: minLength })
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
          return that.constant(data)
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

    that.identity = that.constant = generatorFunction('constant', [], function (data) {
      var constantGenerator = generatorFunction('constant', [data], function () {
        return data
      })

      installMapFunction(constantGenerator)

      return constantGenerator
    })

    that.stringSplicer = generatorFunction('stringSplicer', [], function (text, options) {
      if (typeof text !== 'string') {
        throw new Error('The stringSplicer requires a string as the first argument')
      }

      var min = (options || {}).min || 0

      var g = generatorFunction('stringSplicer', [text, options], function () {
        var from = chance.natural({ max: text.length })
        var length = chance.natural({ max: text.length - min })

        return text.slice(0, from) + text.slice(from + length)
      })

      g.shrink = function (data) {
        if (data.length === min) {
          return that.constant(data)
        }

        return that.stringSplicer(data, options)
      }

      installMapFunction(g)

      return g
    })

    that.array = generatorFunction('array', [], function (generator, count) {
      if (typeof count === 'undefined') {
        return that.n(generator, that.natural({ max: 50 }))
      } else {
        return that.n(generator, count)
      }
    })

    that.arraySplicer = generatorFunction('arraySplicer', [], function (array, options) {
      if (!Array.isArray(array)) {
        throw new Error('The arraySplicer requires an array as the first argument')
      }

      var min = (options || {}).min || 0

      var g = generatorFunction('arraySplicer', [array, options], function () {
        var from = chance.natural({ max: array.length })
        var length = chance.natural({ max: array.length - min })

        g.lastValue = array.slice()
        g.lastValue.splice(from, length)
        g.lastUnwrappedValue = unwrap(g.lastValue)

        return g.lastUnwrappedValue
      })

      g.shrink = function (data) {
        var shrinkableData = (g.lastValue || []).some(function (g) {
          return g && g.shrink
        })

        if (!shrinkableData && data.length === min) {
          return that.constant(data)
        }

        if (shrinkableData && data.length < 10 && g.lastUnwrappedValue === data) {
          data = g.lastValue.map(function (g, i) {
            return g && g.shrink
              ? g.shrink(data[i])
              : data[i]
          })
        } else {
          data = g.lastValue
        }

        return that.arraySplicer(data, options)
      }

      installMapFunction(g)

      return g
    })


    that.sequence = generatorFunction('sequence', [], function (fn, count) {
      count = typeof count === 'undefined'
        ? that.natural({ max: 50 })
        : count

      var g = generatorFunction('sequence', [fn, count], function () {
        var context = {}
        var previous = null
        var valueGenerator = function () {
          var result = previous === null
              ? unwrap(fn(context))
              : unwrap(fn(context, previous))

          previous = result

          return result
        }

        return that.array(valueGenerator, count)()
      })

      g.shrink = function (data) {
        if (data.length === 0) {
          return that.constant([])
        }

        var count = g.args[1]
        if (count && count.shrink) {
          count = count.shrink(data.length)
        } else {
          count = data.length
        }
        var valueGenerator = g.args[0]
        return that.sequence(valueGenerator, count)
      }

      installMapFunction(g)

      return g
    })
  }

  return ExtendedChance
})
