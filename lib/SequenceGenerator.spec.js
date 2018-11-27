"use strict";

var SequenceGenerator = require("./SequenceGenerator");
var expect = require("../test/expect");
var IntegerGenerator = require("./IntegerGenerator");
var chanceCache = require("./chanceCache");

describe("SequenceGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  describe("when given no arguments", function () {
    it("fails", function () {
      expect(function () {
        new SequenceGenerator(); // eslint-disable-line no-new
      }, "to throw", "The sequence generator requires a producer function as first argument");
    });
  });

  var producer = function producer(previous) {
    return {
      gender: previous && previous.gender === "female" ? "male" : "female",
      age: new IntegerGenerator({ min: 0, max: 100 })
    };
  };

  var generator = void 0;
  beforeEach(function () {
    generator = new SequenceGenerator(producer);
  });

  it("uses the function to generate a sequence of values", function () {
    expect(generator, "to yield items", [[{ gender: "female", age: 80 }, { gender: "male", age: 96 }, { gender: "female", age: 18 }, { gender: "male", age: 73 }, { gender: "female", age: 78 }, { gender: "male", age: 60 }, { gender: "female", age: 60 }, { gender: "male", age: 15 }, { gender: "female", age: 45 }, { gender: "male", age: 15 }, { gender: "female", age: 10 }], [{ gender: "female", age: 46 }]]);
  });

  describe("shrink", function () {
    it("shrinks towards the empty array", function () {
      expect(generator, "to shrink towards", []);
    });
  });

  describe("expand", function () {
    it("expands the given sequence", function () {
      var generated = generator.first();
      expect(generator.expand(generated), "to yield items", [[{ gender: "female", age: 46 }, { gender: "male", age: 87 }, { gender: "female", age: 33 }, { gender: "male", age: 60 }, { gender: "female", age: 14 }, { gender: "male", age: 71 }, { gender: "female", age: 65 }, { gender: "male", age: 2 }, { gender: "female", age: 5 }, { gender: "male", age: 97 }, { gender: "female", age: 72 }, { gender: "male", age: 84 }, { gender: "female", age: 94 }], [{ gender: "female", age: 0 }, { gender: "male", age: 18 }, { gender: "female", age: 100 }, { gender: "male", age: 18 }, { gender: "female", age: 62 }, { gender: "male", age: 30 }, { gender: "female", age: 61 }, { gender: "male", age: 53 }, { gender: "female", age: 0 }, { gender: "male", age: 43 }, { gender: "female", age: 2 }, { gender: "male", age: 29 }, { gender: "female", age: 53 }, { gender: "male", age: 61 }, { gender: "female", age: 40 }, { gender: "male", age: 14 }], [{ gender: "female", age: 29 }, { gender: "male", age: 98 }, { gender: "female", age: 37 }, { gender: "male", age: 23 }, { gender: "female", age: 46 }, { gender: "male", age: 9 }, { gender: "female", age: 79 }, { gender: "male", age: 62 }, { gender: "female", age: 20 }, { gender: "male", age: 38 }, { gender: "female", age: 51 }, { gender: "male", age: 99 }]]);
    });
  });

  describe("when given a min and max", function () {
    beforeEach(function () {
      generator = new SequenceGenerator(producer, { min: 3, max: 5 });
    });

    it("generates arrays between the limits", function () {
      expect(generator, "to yield items", [[{ gender: "female", age: 80 }, { gender: "male", age: 96 }, { gender: "female", age: 18 }, { gender: "male", age: 73 }], [{ gender: "female", age: 60 }, { gender: "male", age: 60 }, { gender: "female", age: 15 }, { gender: "male", age: 45 }, { gender: "female", age: 15 }]]);
    });

    describe("shrink", function () {
      it("shrinks towards the minimum allowed list", function () {
        expect(generator, "to shrink towards", [{ gender: "female", age: 10 }, { gender: "male", age: 5 }, { gender: "female", age: 46 }]);
      });
    });

    describe("expand", function () {
      it("honors the length constraints", function () {
        var generated = generator.first();

        expect(generator.expand(generated), "to yield items", [[{ gender: "female", age: 60 }, { gender: "male", age: 60 }, { gender: "female", age: 15 }, { gender: "male", age: 45 }, { gender: "female", age: 15 }], [{ gender: "female", age: 5 }, { gender: "male", age: 46 }, { gender: "female", age: 87 }, { gender: "male", age: 33 }, { gender: "female", age: 60 }], [{ gender: "female", age: 71 }, { gender: "male", age: 65 }, { gender: "female", age: 2 }, { gender: "male", age: 5 }, { gender: "female", age: 97 }]]);
      });
    });
  });
});