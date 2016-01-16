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
    var that = this
    var chance = new Chance(seed)

    function unwrap (v) {
      return v && v.isGenerator ? v() : v
    }

    function markGenerator (f) {
      f.isGenerator = true
      return f
    }

    var overrides = {
      n: function (generator, n) {
        if (typeof n === 'undefined') {
          return markGenerator(function () {
            return chance.n(generator, chance.integer({ min: 0, max: 100 }))
          })
        } else {
          var result = markGenerator(function () {
            return chance.n(generator, unwrap(n))
          })
          return result
        }
      },
      pick: function (arr, n) {
        return markGenerator(function () {
          return chance.pick(arr.map(unwrap), unwrap(n))
        })
      },
      shuffle: function (arr) {
        return markGenerator(function () {
          return chance.shuffle(arr.map(unwrap))
        })
      }
    }

    Object.keys(Chance.prototype).forEach(function (key) {
      var property = chance[key]
      if (typeof property === 'function') {
        if (overrides[key]) {
          that[key] = markGenerator(overrides[key])
        } else {
          that[key] = markGenerator(function () {
            if (arguments.length === 0) {
              return property.apply(chance, arguments)
            } else {
              var args = arguments
              return markGenerator(function () {
                return property.apply(chance, args)
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
