"use strict";

var createGeneratorFacade = require("./createGeneratorFacade");
var createChanceProxyGeneratorFacade = require("./createChanceProxyGeneratorFacade");
var ArrayGenerator = require("./ArrayGenerator");
var ArraySplicerGenerator = require("./ArraySplicerGenerator");
var ConstantGenerator = require("./ConstantGenerator");
var FloatingGenerator = require("./FloatingGenerator");
var IntegerGenerator = require("./IntegerGenerator");
var MagicFloatingGenerator = require("./MagicFloatingGenerator");
var MagicIntegerGenerator = require("./MagicIntegerGenerator");
var MagicStringGenerator = require("./MagicStringGenerator");
var NaturalGenerator = require("./NaturalGenerator");
var NumberGenerator = require("./NumberGenerator");
var PickoneGenerator = require("./PickoneGenerator");
var PicksetGenerator = require("./PicksetGenerator");
var Producer = require("./Producer");
var SequenceGenerator = require("./SequenceGenerator");
var ShapeGenerator = require("./ShapeGenerator");
var ShuffleGenerator = require("./ShuffleGenerator");
var StringGenerator = require("./StringGenerator");
var StringSplicerGenerator = require("./StringSplicerGenerator");
var TextGenerator = require("./TextGenerator");
var UniqueGenerator = require("./UniqueGenerator");
var WeightedGenerator = require("./WeightedGenerator");

var facade = {
  array: function array() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(ArrayGenerator, [null].concat(args)))();
  },
  arraySplicer: function arraySplicer() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return new (Function.prototype.bind.apply(ArraySplicerGenerator, [null].concat(args)))();
  },
  constant: createGeneratorFacade(ConstantGenerator),
  floating: createGeneratorFacade(FloatingGenerator),
  integer: createGeneratorFacade(IntegerGenerator),
  magicFloating: createGeneratorFacade(MagicFloatingGenerator),
  magicInteger: createGeneratorFacade(MagicIntegerGenerator),
  magicString: createGeneratorFacade(MagicStringGenerator),
  natural: createGeneratorFacade(NaturalGenerator),
  number: createGeneratorFacade(NumberGenerator),
  pickone: function pickone() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return new (Function.prototype.bind.apply(PickoneGenerator, [null].concat(args)))();
  },
  pickset: function pickset() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return new (Function.prototype.bind.apply(PicksetGenerator, [null].concat(args)))();
  },
  sequence: function sequence() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return new (Function.prototype.bind.apply(SequenceGenerator, [null].concat(args)))();
  },
  shape: function shape() {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return new (Function.prototype.bind.apply(ShapeGenerator, [null].concat(args)))();
  },
  shuffle: function shuffle() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return new (Function.prototype.bind.apply(ShuffleGenerator, [null].concat(args)))();
  },
  string: createGeneratorFacade(StringGenerator),
  stringSplicer: function stringSplicer() {
    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    return new (Function.prototype.bind.apply(StringSplicerGenerator, [null].concat(args)))();
  },
  text: createGeneratorFacade(TextGenerator),
  producer: function producer() {
    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    return new (Function.prototype.bind.apply(Producer, [null].concat(args)))();
  },
  unique: function unique() {
    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    return new (Function.prototype.bind.apply(UniqueGenerator, [null].concat(args)))();
  },
  weighted: function weighted() {
    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    return new (Function.prototype.bind.apply(WeightedGenerator, [null].concat(args)))();
  }
};

["bool", "character", "letter", "prime", "paragraph", "sentence", "syllable", "word", "age", "birthday", "cf", "cpf", "first", "gender", "last", "name", "prefix", "ssn", "suffix", "animal", "android_id", "apple_token", "bb_pin", "wp7_anid", "wp8_anid2", "avatar", "color", "company", "domain", "email", "fbid", "google_analytics", "hashtag", "ip", "ipv6", "klout", "profession", "tld", "twitter", "url", "address", "altitude", "areacode", "city", "coordinates", "country", "depth", "geohash", "latitude", "longitude", "phone", "postal", "province", "state", "street", "zip", "ampm", "date", "hammertime", "hour", "millisecond", "minute", "month", "second", "timestamp", "timezone", "weekday", "year", "cc", "cc_type", "currency", "currency_pair", "dollar", "euro", "exp", "exp_month", "exp_year", "coin", "dice", "guid", "hash", "radio", "rpg", "tv"].forEach(function (method) {
  facade[method] = createChanceProxyGeneratorFacade(method);
});

module.exports = facade;