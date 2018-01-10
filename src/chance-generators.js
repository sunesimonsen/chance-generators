/*global define*/
((root, factory) => {
  if (typeof exports === "object") {
    module.exports = factory(require("chance"));
  } else if (typeof define === "function" && define.amd) {
    define(["chance"], factory);
  } else {
    root.weknowhow = root.weknowhow || {};
    root.weknowhow.chanceGenerators = factory(root.chance);
  }
})(this, Chance => {
  function extend(target, ...sources) {
    sources.forEach(source => {
      if (source) {
        Object.keys(source).forEach(key => {
          target[key] = source[key];
        });
      }
    });
    return target;
  }

  var isInteger =
    Number.isInteger ||
    function isInteger(value) {
      return (
        typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value
      );
    };

  function getMin(value) {
    if (typeof value === "number") {
      return value;
    }

    if (
      value &&
      value.isGenerator &&
      value.args[0] &&
      typeof value.args[0].min === "number"
    ) {
      return value.args[0].min;
    }

    return Number.MIN_SAFE_INTEGER;
  }

  function getMinNatural(value) {
    return Math.max(getMin(value), 0);
  }

  function getMax(value) {
    if (typeof value === "number") {
      return value;
    }

    if (
      value &&
      value.isGenerator &&
      value.args[0] &&
      typeof value.args[0].max === "number"
    ) {
      return value.args[0].max;
    }

    return Number.MAX_SAFE_INTEGER;
  }

  function unwrap(v) {
    if (Array.isArray(v)) {
      return v.map(unwrap);
    } else if (v && typeof v === "object" && v.constructor === Object) {
      return Object.keys(v).reduce((result, key) => {
        result[key] = unwrap(v[key]);
        return result;
      }, {});
    } else {
      return v && v.isGenerator ? v() : v;
    }
  }

  function ExtendedChance(seed) {
    if (!(this instanceof ExtendedChance)) {
      return new ExtendedChance(seed);
    }

    var that = this;
    var chance = typeof seed === "undefined" ? new Chance() : new Chance(seed);

    // Fix that pick provided a count of zero or one does not return an array
    var originalPick = Chance.prototype.pick;
    chance.pick = (array, count) => {
      if (count === 0) {
        return [];
      }

      if (count === 1) {
        return [originalPick.call(chance, array, count)];
      }

      return originalPick.call(chance, array, count);
    };

    chance.shape = data => unwrap(data);

    function generatorFunction(name, args, f) {
      f.isGenerator = true;
      f.generatorName = name;
      f.args = args;
      f.toString = () => name;
      return f;
    }

    function installMapFunction(generator) {
      generator.map = f => {
        var lastValue, lastMappedValue;
        var mapGenerator = generatorFunction(
          generator.generatorName + ".map",
          [],
          () => {
            lastValue = generator();
            lastMappedValue = unwrap(f(lastValue, that));
            return lastMappedValue;
          }
        );

        mapGenerator.isMappedGenerator = true;
        mapGenerator.parentGenerator = generator;
        mapGenerator.mapFunction = f;

        if (generator.shrink) {
          mapGenerator.shrink = value => {
            if (value === lastMappedValue) {
              return generator.shrink(lastValue).map(f);
            } else {
              return mapGenerator;
            }
          };
        }

        if (generator.expand) {
          mapGenerator.expand = value => {
            if (value === lastMappedValue) {
              return generator.expand(lastValue).map(f);
            } else {
              return mapGenerator;
            }
          };
        }

        installMapFunction(mapGenerator);

        return mapGenerator;
      };
    }

    var overrides = {
      n(generator, count) {
        return createGenerator("n", [generator, count], [generator]);
      },
      pickset(data, count) {
        var picksetGenerator = generatorFunction(
          "pickset",
          [data, count],
          () => {
            picksetGenerator.lastValue = chance.pickset(data, unwrap(count));
            picksetGenerator.lastUnwrappedValue = unwrap(
              picksetGenerator.lastValue
            );
            return picksetGenerator.lastUnwrappedValue;
          }
        );

        installMapFunction(picksetGenerator);

        picksetGenerator.shrink = data =>
          shrinkers.pickset(picksetGenerator, data);

        picksetGenerator.expand = data =>
          expanders.pickset(picksetGenerator, data);

        return picksetGenerator;
      },
      unique(generator, count, options) {
        var uniqueGenerator = generatorFunction(
          "unique",
          [generator, count],
          () => {
            var comparator = options && options.comparator;
            return comparator
              ? chance.unique(() => generator(), unwrap(count), {
                  comparator
                })
              : chance.unique(generator, unwrap(count));
          }
        );

        installMapFunction(uniqueGenerator);

        uniqueGenerator.shrink = data =>
          shrinkers.unique(uniqueGenerator, data);

        return uniqueGenerator;
      },
      weighted(data, weights) {
        var generator = generatorFunction("weighted", [data, weights], () => {
          generator.lastValue = chance.weighted(data, weights);
          generator.lastUnwrappedValue = unwrap(generator.lastValue);
          return generator.lastUnwrappedValue;
        });

        installMapFunction(generator);

        generator.shrink = data => shrinkers.weighted(generator, data);

        generator.expand = data => expanders.weighted(generator, data);

        return generator;
      }
    };

    function minMaxShrinker(generator, data) {
      var currentLimits = generator.args[0] || {};
      var limits = extend({}, currentLimits);

      var value =
        typeof data === "string"
          ? parseFloat(data.replace(/^[^\d]*/, ""))
          : data;

      if (value < 0 && value < (currentLimits.max || 0)) {
        var max = currentLimits.max || 0;
        limits = {
          min: value,
          max: Math.min(0, max)
        };
      } else if (value > 0 && value > (currentLimits.min || 0)) {
        var min = currentLimits.min || 0;
        limits = {
          min: Math.max(0, min),
          max: value
        };
      } else {
        return that.constant(data);
      }

      return that[generator.generatorName](limits);
    }

    var shrinkers = {
      n(generator, data) {
        if (data.length === 0) {
          return that.constant(data);
        }

        var length = generator.args[1];

        var minLength = getMinNatural(length);

        var dataGenerator = generator.args[0];
        if (dataGenerator.shrink) {
          return that.arraySplicer(data.map(dataGenerator.shrink), {
            min: minLength
          });
        } else {
          return that.arraySplicer(data, { min: minLength });
        }
      },
      pick(generator, data) {
        if (Array.isArray(data)) {
          return shrinkers.pickset(generator, data);
        } else {
          return shrinkers.pickone(generator, data);
        }
      },
      pickone(generator, data) {
        return that.constant(data);
      },
      pickset(generator, data) {
        if (data.length === 0) {
          return that.constant(data);
        }

        var shrinkable = false;
        var count = generator.args[1];
        if (count && count.shrink) {
          shrinkable = true;
          count = count.shrink(data.length);
        }

        var shrinkableData = (generator.lastValue || []).some(
          g => g && g.shrink
        );

        shrinkable = shrinkable || shrinkableData;

        if (
          shrinkableData &&
          data.length < 10 &&
          generator.lastUnwrappedValue === data
        ) {
          data = generator.lastValue.map(
            (g, i) => (g && g.shrink ? g.shrink(data[i]) : data[i])
          );
        } else {
          data = generator.lastValue;
        }

        if (!shrinkable) {
          return that.constant(data);
        }

        return that.pickset(data, count);
      },
      unique(generator, data) {
        if (data.length === 0) {
          return that.constant(data);
        }

        var count = generator.args[1];
        var minCount = getMinNatural(count);

        return that.arraySplicer(data, { min: minCount });
      },
      shape(generator, data) {
        var shapeGenerators = generator.args[0];
        var shrunk = false;
        var newShape = Object.keys(shapeGenerators).reduce((result, key) => {
          var entry = shapeGenerators[key];
          if (entry && typeof entry.shrink === "function") {
            shrunk = true;
            result[key] = entry.shrink(data[key]);
          } else {
            result[key] = entry;
          }

          return result;
        }, {});

        if (shrunk) {
          return that.shape(newShape);
        } else {
          return that.constant(data);
        }
      },
      string(generator, data) {
        var options = generator.args[0] || {};

        if (data.length === 0) {
          return that.constant(data);
        }

        var length = options.length;
        var minLength = getMinNatural(length);

        return that.stringSplicer(data, { min: minLength });
      },
      weighted(generator, data) {
        var shrinkable =
          generator.lastUnwrappedValue === data && generator.lastValue.shrink;
        if (shrinkable) {
          return generator.lastValue.shrink(data);
        } else {
          return that.constant(data);
        }
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
    };

    function numberExpander(generator, data) {
      var min = getMin(generator);
      var max = getMax(generator);
      var margin = that.integer({ min: -100, max: 100 });

      return that.weighted(
        [
          that.constant(data),
          that
            .constant(data)
            .map(value => Math.max(Math.min(value + margin(), max), min)),
          generator
        ],
        [2, 1, 2]
      );
    }

    var expanders = {
      n(generator, data) {
        var dataGenerator = generator.args[0];
        var count = generator.args[1];
        var options = generator.args[2];

        return that.pickset([dataGenerator].concat(data), count, options);
      },
      string(generator, data) {
        return generator.map(text => {
          var margin = Math.max(
            Math.min(
              Math.floor((text.length - data.length) / 2),
              Math.ceil(data.length * 0.3)
            ),
            0
          );
          var includeLeftMargin = chance.bool({ likelihood: 70 });
          var includeRightMargin = chance.bool({ likelihood: 70 });
          var marginLength =
            (includeLeftMargin ? margin : 0) +
            (includeRightMargin ? margin : 0);
          var result = new Array(marginLength + data.length);

          var i = 0;
          if (includeLeftMargin) {
            while (i < margin) {
              result[i] = text[i++];
            }
          }

          for (var j = 0; j < data.length; i++, j++) {
            result[i] = chance.bool({ likelihood: 95 })
              ? data[j]
              : text[i % text.length];
          }

          if (includeRightMargin) {
            while (i < result.length) {
              result[i] = text[i++];
            }
          }

          return result.join("");
        });
      },
      pickset(generator, data) {
        return generator.map(items => {
          var margin = Math.max(
            Math.min(
              Math.floor((items.length - data.length) / 2),
              Math.ceil(data.length * 0.3)
            ),
            0
          );
          var result = new Array(margin * 2 + data.length);

          var i = 0;
          while (i < margin) {
            result[i] = items[i++];
          }

          for (var j = 0; j < data.length; i++, j++) {
            result[i] = chance.bool({ likelihood: 95 })
              ? data[j]
              : items[i % items.length];
          }

          while (i < result.length) {
            result[i] = items[i++];
          }

          return result;
        });
      },
      shape(generator, data) {
        var shapeGenerators = generator.args[0];
        var newShape = Object.keys(shapeGenerators).reduce((result, key) => {
          var entry = shapeGenerators[key];
          if (entry && typeof entry.expand === "function") {
            result[key] = entry.expand(data[key]);
          } else {
            result[key] = entry;
          }

          return result;
        }, {});

        return that.pickone([that.shape(newShape), that.constant(data)]);
      },
      weighted(generator, data) {
        var expandable =
          generator.lastUnwrappedValue === data && generator.lastValue.expand;
        if (expandable) {
          return generator.lastValue.expand(data);
        } else {
          return that.constant(data);
        }
      },
      natural(generator, data) {
        var min = getMinNatural(generator);
        var max = getMax(generator);
        var margin = that.integer({ min: -100, max: 100 });

        return that.weighted(
          [
            that.constant(data),
            that
              .constant(data)
              .map(value => Math.max(Math.min(value + margin(), max), min)),
            generator
          ],
          [2, 1, 2]
        );
      },
      floating: numberExpander,
      integer: numberExpander,
      number: numberExpander
    };

    function createGenerator(name, args, omitUnwap) {
      var omitUnwrapIndex = {};

      omitUnwap &&
        args.forEach((arg, i) => {
          if (omitUnwap.indexOf(arg) !== -1) {
            omitUnwrapIndex[i] = true;
          }
        });

      var g = generatorFunction(name, args, (...options) => {
        if (options.length === 0) {
          return chance[name](
            ...args.map((arg, i) => (omitUnwrapIndex[i] ? arg : unwrap(arg)))
          );
        } else {
          return createGenerator(name, options);
        }
      });

      var shrinker = shrinkers[name];
      if (shrinker) {
        g.shrink = data => shrinker(g, data);
      } else {
        g.shrink = data => that.constant(data);
      }

      var expander = expanders[name];
      if (expander) {
        g.expand = data => expander(g, data);
      } else {
        g.expand = data => that.pickone([g, that.constant(data)]);
      }

      installMapFunction(g);

      return g;
    }

    ["shape"].concat(Object.keys(Chance.prototype)).forEach(key => {
      var property = chance[key];
      if (typeof property === "function") {
        if (overrides[key]) {
          that[key] = generatorFunction(key, [], overrides[key]);
          installMapFunction(that[key]);
        } else {
          that[key] = createGenerator(key, []);
        }
      } else {
        that[key] = property;
      }
    });

    that.identity = that.constant = generatorFunction("constant", [], data => {
      var constantGenerator = generatorFunction("constant", [data], () => data);

      installMapFunction(constantGenerator);

      return constantGenerator;
    });

    that.stringSplicer = generatorFunction(
      "stringSplicer",
      [],
      (text, options) => {
        if (typeof text !== "string") {
          throw new Error(
            "The stringSplicer requires a string as the first argument"
          );
        }

        var min = (options || {}).min || 0;

        var g = generatorFunction("stringSplicer", [text, options], () => {
          var from = chance.natural({ max: text.length });
          var length = chance.natural({ max: text.length - min });

          return text.slice(0, from) + text.slice(from + length);
        });

        g.shrink = data => {
          if (data.length === min) {
            return that.constant(data);
          }

          return that.stringSplicer(data, options);
        };

        installMapFunction(g);

        return g;
      }
    );

    that.array = generatorFunction("array", [], (generator, count) => {
      if (typeof count === "undefined") {
        return that.n(generator, that.natural({ max: 50 }));
      } else {
        return that.n(generator, count);
      }
    });

    that.arraySplicer = generatorFunction(
      "arraySplicer",
      [],
      (array, options) => {
        if (!Array.isArray(array)) {
          throw new Error(
            "The arraySplicer requires an array as the first argument"
          );
        }

        var min = (options || {}).min || 0;

        var g = generatorFunction("arraySplicer", [array, options], () => {
          var from = chance.natural({ max: array.length });
          var length = chance.natural({ max: array.length - min });

          g.lastValue = array.slice();
          g.lastValue.splice(from, length);
          g.lastUnwrappedValue = unwrap(g.lastValue);

          return g.lastUnwrappedValue;
        });

        g.shrink = data => {
          var shrinkableData = (g.lastValue || []).some(g => g && g.shrink);

          if (!shrinkableData && data.length === min) {
            return that.constant(data);
          }

          if (
            shrinkableData &&
            data.length < 10 &&
            g.lastUnwrappedValue === data
          ) {
            data = g.lastValue.map(
              (g, i) => (g && g.shrink ? g.shrink(data[i]) : data[i])
            );
          } else {
            data = g.lastValue;
          }

          return that.arraySplicer(data, options);
        };

        installMapFunction(g);

        return g;
      }
    );

    function hasMagicValues() {
      return (
        typeof global === "object" &&
        global.recordLocation &&
        global.recordLocation.magicValues
      );
    }

    var generatorCache = {};

    function createMagicValueGenerator(name, baseGeneratorName, predicate) {
      function createGenerator() {
        var magicValues = global.recordLocation.magicValues;

        var cacheEntry = generatorCache[name];
        if (cacheEntry && cacheEntry.size === magicValues.size) {
          return cacheEntry.generator;
        }

        var matchingMagicValues = [];
        magicValues.forEach(v => {
          if (predicate(v)) {
            matchingMagicValues.push(v);
          }
        });

        if (matchingMagicValues.length === 0) {
          return that[baseGeneratorName];
        }

        var generator = that.pickone(matchingMagicValues);

        generatorCache[name] = {
          size: magicValues.size,
          generator
        };

        return generator;
      }

      that[name] = generatorFunction(name, [], () => {
        if (!hasMagicValues()) {
          return that[baseGeneratorName]();
        }

        var generator = createGenerator();

        return generator();
      });

      installMapFunction(that[name]);

      var shrinker = shrinkers[baseGeneratorName];
      if (shrinker) {
        that[name].shrink = data => shrinker(that[baseGeneratorName], data);
      }

      var expander = expanders[baseGeneratorName];
      if (expander) {
        that[name].expand = data => expander(that[baseGeneratorName], data);
      }
    }

    createMagicValueGenerator(
      "magicString",
      "string",
      value => typeof value === "string"
    );

    createMagicValueGenerator("magicInteger", "integer", isInteger);

    createMagicValueGenerator(
      "magicNatural",
      "natural",
      value => isInteger(value) && value >= 0
    );

    createMagicValueGenerator("magicFloating", "floating", value =>
      isFinite(value)
    );

    createMagicValueGenerator(
      "magicNumber",
      "floating",
      value => typeof value === "number"
    );

    function getTextGenerator() {
      var shortString = that.string({ length: that.natural({ max: 7 }) });

      return that.weighted(
        [
          that.string,
          that.sentence,
          that.paragraph,
          that.syllable,
          that.word,
          that.magicString,
          that
            .array(
              that.weighted([that.magicString, shortString], [60, 40]),
              that.natural({ max: 10 })
            )
            .map(strings => strings.join(""))
        ],
        [20, 20, 10, 10, 10, 10, 5]
      );
    }

    that.text = generatorFunction("text", [], () => {
      var g = getTextGenerator();

      return g();
    });

    installMapFunction(that.text);

    that.text.shrink = data => shrinkers.string(that.string, data);

    that.text.expand = data => expanders.string(that.string, data);

    function getNumberGenerator() {
      var smallFloat = that.floating({ min: -100, max: 100 });
      var smallInteger = that.integer({ min: -100, max: 100 });
      var mediumFloat = that.floating({ min: -10000, max: 10000 });
      var mediumInteger = that.integer({ min: -10000, max: 10000 });

      return that.weighted(
        [
          smallFloat,
          smallInteger,
          mediumFloat,
          mediumInteger,
          that.integer,
          that.floating,
          that.magicNumber,
          that.magicInteger,
          that.magicInteger.map(value => value + 1),
          that.magicInteger.map(value => value - 1)
        ],
        [30, 30, 20, 20, 5, 5, 10, 5, 5, 5]
      );
    }

    that.number = generatorFunction("number", [], () => {
      var g = getNumberGenerator();

      return g();
    });

    installMapFunction(that.number);

    that.number.shrink = data => shrinkers.floating(that.floating, data);

    that.number.expand = data => expanders.number(that.number, data);

    that.sequence = generatorFunction("sequence", [], (fn, count, options) => {
      count = typeof count === "undefined" ? that.natural({ max: 50 }) : count;

      var g = generatorFunction("sequence", [fn, count], () => {
        options = options || {};
        var context = options.context || {};
        g.lastContext = context;
        var previous = "previous" in options ? options.previous : null;
        var valueGenerator = () => {
          var result =
            previous === null
              ? unwrap(fn(context))
              : unwrap(fn(context, previous));

          previous = result;

          return result;
        };

        g.lastValue = that.array(valueGenerator, count)();
        return g.lastValue;
      });

      g.shrink = data => {
        if (data.length === 0) {
          return that.constant([]);
        }

        var count = g.args[1];
        if (count && count.shrink) {
          count = count.shrink(data.length);
        } else {
          count = data.length;
        }
        var valueGenerator = g.args[0];
        return that.sequence(valueGenerator, count);
      };

      g.expand = data => {
        var count = g.args[1];

        if (g.lastValue !== data || !options.resumable) {
          return that.sequence(fn, count);
        }

        if (count && count.args[0] && count.args[0].max && count.shrink) {
          count = count.shrink(count.args[0].max - data.length);
        } else if (typeof count === "number") {
          count = count - data.length;
        }

        return that
          .sequence(fn, count, {
            context: Object.create(g.lastContext),
            previous: data[data.length - 1],
            resumable: true
          })
          .map(items => data.concat(items));
      };

      installMapFunction(g);

      return g;
    });
  }

  return ExtendedChance;
});
