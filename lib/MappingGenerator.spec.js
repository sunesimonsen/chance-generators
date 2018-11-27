"use strict";

var expect = require("../test/expect");
var StringGenerator = require("./StringGenerator");
var chanceCache = require("./chanceCache");

var _require = require("./index"),
    animal = _require.animal,
    bool = _require.bool;

describe("MappingGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = new StringGenerator({ min: 10 });
  var mapGenerator = generator.map(function (s) {
    return s.toUpperCase();
  });

  it("returns a new generator", function () {
    expect(mapGenerator, "to satisfy", {
      isGenerator: true
    });
  });

  it("returns a new generator that is a mapping over the original generator", function () {
    expect(mapGenerator, "to yield items", ["(N25SSLGLHEH#YSK0", "E)19*PAN]NTWTMAFBVMTDKD", "BRHG6TOCM[RID@SY", "EA(*)P7CWBHRY", "YJTK9CM^CTNX3XF"]);
  });

  it("unwraps returned values", function () {
    expect(bool.map(function (hasAnimal) {
      return hasAnimal ? animal : null;
    }), "to yield items", ["Tarantula", "Rabbits", null, null, "Bald Eagle"]);
  });

  describe("shrink", function () {
    it("shrinks the parent generator and maps it again", function () {
      expect(mapGenerator, "to shrink towards", "(LHEH#YSK0");
    });
  });

  describe("expand", function () {
    it("expands the parent generator and maps it again", function () {
      var value = mapGenerator.first();

      expect(mapGenerator.expand(value), "to yield items", ["E)1(N25SSLGLTEH#YSK0", "A(N25SSLGLHEH#YJK09", "(%25SSLGLHEH)YSK0U", "(N25SSLGLHEH#YSK0", "(N25SSLGLHEH#YSK0"]);
    });
  });
});