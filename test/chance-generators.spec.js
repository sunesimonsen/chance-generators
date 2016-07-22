/*global describe, it*/
var Chance = require('../lib/chance-generators')
var expect = require('unexpected')

expect.addAssertion('<any> [not] to be contained by <array>', function (expect, item, array) {
  expect(array, '[not] to contain', item)
})

expect.addAssertion('<string> to have length satisfying <assertion>', function (expect, value) {
  expect.shift(value.length)
})

expect.addAssertion('<array> to have unique items', function (expect, arr) {
  var seen = []
  expect(arr, 'to have items satisfying', function (item) {
    expect(seen.indexOf(item), 'to be', -1)
    seen.push(item)
  })
})

describe('chance-generators', function () {
  var chance

  beforeEach(() => {
    chance = new Chance(42)
  })

  describe('constructor', () => {
    describe('given a seed', () => {
      it('uses the seed to produce random values', () => {
        expect(new Chance(13).integer(), 'to equal', new Chance(13).integer())
      })
    })

    it('uses a random seed by default', () => {
      expect(new Chance().integer(), 'to be a number')
    })

    it('can be called without new', () => {
      expect(Chance(13).integer(), 'to equal', new Chance(13).integer())
    })
  })

  describe('integer', function () {
    it('produces a random integer', () => {
      expect(chance.integer(), 'to be a number')
    })

    describe('given a min and max value', function () {
      it('returns a new generator function honoring the given constraints', function () {
        expect(chance.integer({ min: 0, max: 10 }), 'when called', 'to be within', 0, 10)
      })
    })

    describe('toString', () => {
      it('returns the name of the generator', () => {
        expect(chance.integer({ max: 10 }).toString(), 'to be', 'integer')
      })
    })

    describe('map', () => {
      it('returns a new generator where the generated values are mapped with the given function', () => {
        expect(
          chance.integer({ min: -10, max: 10 }).map(v => v + 10),
          'when called',
          'to be within', 0, 20
        )
      })

      describe('shrink', () => {
        it('returns a new generator where the input is shrunken with with regards to the original generator', () => {
          var generator = chance.integer({ min: -10, max: 10 }).map(v => v + 10)
          while (generator.shrink) {
            generator = generator.shrink(generator())
          }
          expect(generator, 'when called', 'to equal', 10)
        })
      })
    })
  })

  describe('string', function () {
    it('produces a random string', () => {
      expect(chance.string(), 'to be a string')
    })

    describe('given a length', function () {
      it('returns a new generator function honoring the given constraints', function () {
        expect(chance.string({ length: 4 }), 'when called', 'to have length', 4)
      })
    })

    describe('map', () => {
      it('returns a new generator where the generated values are mapped with the given function', () => {
        var generator = chance.string.map(s => s.toUpperCase()).map(s => s.replace(/[^A-Z]/g, '-'))

        expect(
          generator,
          'when called',
          'to match', /[A-Z-]*/
        )
      })

      describe('shrink', () => {
        it('returns a new generator where the input is shrunken with with regards to the original generator', () => {
          var generator = chance.string({ length: chance.natural({ max: 10 }) })
              .map(s => s.toUpperCase())
              .map(s => s.replace(/[^A-Z]/g, '-'))

          while (generator.shrink) {
            generator = generator.shrink(generator())
          }

          expect(generator, 'when called', 'to equal', '')
        })
      })
    })
  })

  describe('n', function () {
    describe('given a generator function', function () {
      it('returns a new generator producing arrays with instance of the given generator of length 1', function () {
        expect(chance.n(chance.string), 'when called', 'to satisfy',
               expect.it('to have length', 1).and('to have items satisfying', 'to be a string'))
      })
    })

    describe('given a generator function and a number', () => {
      it('returns a new generator producing arrays with the specified length', function () {
        expect(chance.n(chance.string, 3), 'when called', 'to have length', 3)
      })

      it('returns a new generator producing arrays with instances of the given generator', function () {
        expect(chance.n(chance.string, 3), 'when called',
               'to have items satisfying', 'to be a string')
      })
    })

    describe('given a generator function and another generator producing numbers', () => {
      it('returns a new generator producing arrays with the length specified by the second generator', function () {
        expect(chance.n(chance.string, chance.integer({ min: 2, max: 4 })), 'when called', 'to satisfy', {
          length: expect.it('to be within', 2, 4)
        })
      })

      it('returns a new generator producing arrays with instances of the given generator', function () {
        expect(chance.n(chance.string, chance.integer({ min: 2, max: 4 })), 'when called',
               'to have items satisfying', 'to be a string')
      })
    })

    describe('shrink', () => {
      it('returns a new generator that work on the provided data', () => {
        var generator = chance.n(chance.string, chance.integer({ min: 2, max: 4 }))
        while (generator.shrink) {
          generator = generator.shrink(generator())
        }
        expect(generator, 'when called', 'to have length', 2)
      })
    })
  })

  describe('array', () => {
    describe('given a generator function', function () {
      it('returns a new generator producing arrays with instance of the given generator of length 0-50', function () {
        expect(chance.array(chance.string), 'when called', 'to satisfy', (array) => {
          expect(array, 'to satisfy', {
            length: expect.it('to be within', 0, 50)
          }).and('to have items satisfying', 'to be a string')
        })
      })
    })

    describe('given a generator function and a number', () => {
      it('returns a new generator producing arrays with the specified length', function () {
        expect(chance.array(chance.string, 3), 'when called', 'to have length', 3)
      })

      it('returns a new generator producing arrays with instances of the given generator', function () {
        expect(chance.array(chance.string, 3), 'when called',
               'to have items satisfying', 'to be a string')
      })
    })

    describe('given a generator function and another generator producing numbers', () => {
      it('returns a new generator producing arrays with the length specified by the second generator', function () {
        expect(chance.array(chance.string, chance.integer({ min: 2, max: 4 })), 'when called', 'to satisfy', {
          length: expect.it('to be within', 2, 4)
        })
      })

      it('returns a new generator producing arrays with instances of the given generator', function () {
        expect(chance.array(chance.string, chance.integer({ min: 2, max: 4 })), 'when called',
               'to have items satisfying', 'to be a string')
      })
    })

    describe('shrink', () => {
      it('returns a new generator that work on the provided data', () => {
        var generator = chance.array(chance.string)
        while (generator.shrink) {
          generator = generator.shrink(generator())
        }
        expect(generator, 'when called', 'to be empty')
      })
    })
  })

  describe('shuffle', () => {
    describe('given an array', () => {
      it('returns a new generator producing shuffled versions of the given array', () => {
        expect(chance.shuffle([42, 'foo', { wat: 'taw' }]), 'when called',
              'to contain', 42, 'foo', { wat: 'taw' })
      })
    })

    describe('given an array of generators', () => {
      it('returns a new generator producing shuffled versions of the given array ' +
         'where items are generated by the generators in the array', () => {
        expect(chance.shuffle([chance.integer, true, chance.string]), 'when called',
               'to have items satisfying',
               expect.it('to be a number').or('to be a string').or('to be a boolean'))
      })
    })
  })

  describe('pick', () => {
    describe('given an array', () => {
      it('returns a new generator picking random elements from the array', () => {
        var arr = [42, 'foo', { wat: 'taw' }]
        expect(chance.pick(arr), 'when called', 'to be contained by', arr)
      })
    })

    describe('given an array and a number', () => {
      it('returns a new generator picking the given number of random elements from the array', () => {
        var arr = [42, 'foo', { wat: 'taw' }]
        expect(chance.pick(arr, 2), 'when called', 'to satisfy',
               expect.it('to have length', 2)
                       .and('to have items satisfying', 'to be contained by', arr))
      })
    })

    describe('given an array of generators', () => {
      it('returns a new generator picking random elements from the array ' +
         'where the items are generated by the generators in the array', () => {
        expect(chance.pick([chance.integer, chance.string, true], 2), 'when called',
               'to have items satisfying',
               expect.it('to be a number').or('to be a string').or('to be a boolean'))
      })
    })
  })

  describe('unique', () => {
    describe('given a generator and a number', () => {
      it('returns a new generator that returns the specified number of unique items generated by the given generator', () => {
        var arr = [42, 'foo', { wat: 'taw' }]
        expect(chance.unique(chance.pick(arr), 3), 'when called', 'to satisfy',
               expect.it('to have length', 3)
                       .and('to have items satisfying', 'to be contained by', arr)
                       .and('to have unique items'))
      })
    })
  })

  describe('constant', () => {
    it('generate the given value', () => {
      expect(chance.constant({ foo: 'bar' }), 'when called', 'to equal', {
        foo: 'bar'
      })
    })

    it('always generates the given value', () => {
      const value = { foo: 'bar' }
      const generator = chance.constant(value)
      for (var i = 0; i < 5; i += 1) {
        expect(generator, 'when called', 'to be', value)
      }
    })

    it('does not unwrap generators', () => {
      expect(chance.constant(chance.integer), 'when called', 'to be a function')
    })

    it('supports the map method', () => {
      const generator = chance.constant(42).map((value) => {
        return chance.natural({ max: value })
      })
      expect(generator, 'when called', 'to be within', 0, 42)
    })
  })

  describe('identity', () => {
    it('generate the given value', () => {
      expect(chance.identity({ foo: 'bar' }), 'when called', 'to equal', {
        foo: 'bar'
      })
    })

    it('always generates the given value', () => {
      const value = { foo: 'bar' }
      for (var i = 0; i < 5; i += 1) {
        expect(chance.identity(value), 'when called', 'to be', value)
      }
    })

    it('does not unwrap generators', () => {
      expect(chance.identity(chance.integer), 'when called', 'to be a function')
    })
  })

  describe('shape', () => {
    describe('given an object', () => {
      it('unwraps generators in the object', () => {
        expect(chance.shape({
          constant: 42,
          x: chance.integer,
          y: chance.integer
        }), 'when called', 'to satisfy', {
          constant: 42,
          x: expect.it('to be a number'),
          y: expect.it('to be a number')
        })
      })
    })

    describe('shrink', () => {
      it('returns a new generator that work on the provided data', () => {
        var generator = chance.shape({
          constant: 42,
          x: chance.integer({ min: 2, max: 4 }),
          y: chance.integer({ min: 2, max: 4 })
        })

        for (var i = 0; i < 3; i += 1) {
          var generatedValue = generator()
          generator = generator.shrink(generatedValue)
          expect(generator, 'when called', 'to satisfy', {
            constant: 42,
            x: expect.it('to be less than or equal to', generatedValue.x),
            y: expect.it('to be less than or equal to', generatedValue.y)
          })
        }
      })
    })

    describe('map', () => {
      it('returns a new generator where the generated values are mapped with the given function', () => {
        var generator = chance.shape({
          x: chance.integer,
          y: chance.integer
        }).map(coordinate => `${coordinate.x},${coordinate.y}`)

        expect(
          generator,
          'when called',
          'to match', /\d+,\d+/
        )
      })

      it('should not unwrap Object subclasses', () => {
        function Foo (value) {
          this.value = value
        }

        expect(
          chance.integer({ min: 0, max: 10 }).map(value => new Foo(value)),
          'when called',
          'to be a', Foo
        )
      })

      it('provides the generator instance as the second parameter to the mapper function', () => {
        expect(
          chance.integer({ min: 0, max: 10 }).map((length, { array, string }) => (
            array(string({ length }))
          )),
          'when called',
          'to have items satisfying',
          'to have length satisfying',
          'to be within', 0, 10
        )
      })

      describe('shrink', () => {
        it('returns a new generator where the input is shrunken with with regards to the original generator', () => {
          var generator = chance.shape({
            x: chance.integer({ min: -20, max: 20 }),
            y: chance.integer({ min: -20, max: 20 })
          }).map(coordinate => `${coordinate.x},${coordinate.y}`)

          while (generator.shrink) {
            generator = generator.shrink(generator())
          }

          expect(generator, 'when called', 'to equal', '0,0')
        })
      })
    })
  })
})
