const createGeneratorFacade = require("./createGeneratorFacade");
const createChanceProxyGeneratorFacade = require("./createChanceProxyGeneratorFacade");
const ArrayGenerator = require("./ArrayGenerator");
const ArraySplicerGenerator = require("./ArraySplicerGenerator");
const ConstantGenerator = require("./ConstantGenerator");
const FloatingGenerator = require("./FloatingGenerator");
const IntegerGenerator = require("./IntegerGenerator");
const MagicFloatingGenerator = require("./MagicFloatingGenerator");
const MagicIntegerGenerator = require("./MagicIntegerGenerator");
const MagicStringGenerator = require("./MagicStringGenerator");
const NaturalGenerator = require("./NaturalGenerator");
const NumberGenerator = require("./NumberGenerator");
const PickoneGenerator = require("./PickoneGenerator");
const PicksetGenerator = require("./PicksetGenerator");
const Producer = require("./Producer");
const SequenceGenerator = require("./SequenceGenerator");
const ShapeGenerator = require("./ShapeGenerator");
const ShuffleGenerator = require("./ShuffleGenerator");
const StringGenerator = require("./StringGenerator");
const StringSplicerGenerator = require("./StringSplicerGenerator");
const TextGenerator = require("./TextGenerator");
const TreeGenerator = require("./TreeGenerator");
const UniqueGenerator = require("./UniqueGenerator");
const WeightedGenerator = require("./WeightedGenerator");

const facade = {
  array: (...args) => new ArrayGenerator(...args),
  arraySplicer: (...args) => new ArraySplicerGenerator(...args),
  constant: createGeneratorFacade(ConstantGenerator),
  floating: createGeneratorFacade(FloatingGenerator),
  integer: createGeneratorFacade(IntegerGenerator),
  magicFloating: createGeneratorFacade(MagicFloatingGenerator),
  magicInteger: createGeneratorFacade(MagicIntegerGenerator),
  magicString: createGeneratorFacade(MagicStringGenerator),
  natural: createGeneratorFacade(NaturalGenerator),
  number: createGeneratorFacade(NumberGenerator),
  pickone: (...args) => new PickoneGenerator(...args),
  pickset: (...args) => new PicksetGenerator(...args),
  sequence: (...args) => new SequenceGenerator(...args),
  shape: (...args) => new ShapeGenerator(...args),
  shuffle: (...args) => new ShuffleGenerator(...args),
  string: createGeneratorFacade(StringGenerator),
  stringSplicer: (...args) => new StringSplicerGenerator(...args),
  text: createGeneratorFacade(TextGenerator),
  tree: (...args) => new TreeGenerator(...args),
  producer: (...args) => new Producer(...args),
  unique: (...args) => new UniqueGenerator(...args),
  weighted: (...args) => new WeightedGenerator(...args)
};

[
  "bool",
  "character",
  "letter",
  "prime",
  "paragraph",
  "sentence",
  "syllable",
  "word",
  "age",
  "birthday",
  "cf",
  "cpf",
  "first",
  "gender",
  "last",
  "name",
  "prefix",
  "ssn",
  "suffix",
  "animal",
  "android_id",
  "apple_token",
  "bb_pin",
  "wp7_anid",
  "wp8_anid2",
  "avatar",
  "color",
  "company",
  "domain",
  "email",
  "fbid",
  "google_analytics",
  "hashtag",
  "ip",
  "ipv6",
  "klout",
  "profession",
  "tld",
  "twitter",
  "url",
  "address",
  "altitude",
  "areacode",
  "city",
  "coordinates",
  "country",
  "depth",
  "geohash",
  "latitude",
  "longitude",
  "phone",
  "postal",
  "province",
  "state",
  "street",
  "zip",
  "ampm",
  "date",
  "hammertime",
  "hour",
  "millisecond",
  "minute",
  "month",
  "second",
  "timestamp",
  "timezone",
  "weekday",
  "year",
  "cc",
  "cc_type",
  "currency",
  "currency_pair",
  "dollar",
  "euro",
  "exp",
  "exp_month",
  "exp_year",
  "coin",
  "dice",
  "guid",
  "hash",
  "radio",
  "rpg",
  "tv"
].forEach(method => {
  facade[method] = createChanceProxyGeneratorFacade(method);
});

module.exports = facade;
