"use strict";

var expect = require("../test/expect");
var MagicStringGenerator = require("./MagicStringGenerator");
var chanceCache = require("./chanceCache");

describe("MagicStringGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;
  describe("without magic strings available", function () {
    beforeEach(function () {
      generator = new MagicStringGenerator();
    });

    it("just generates random strings", function () {
      expect(generator, "to yield items", ["(n25SSlGlhe", "ySk0Wbe)19*pan", "TwTMaFbvMTDkdv[BrHg6ToCM[RId@S", "Hea(*)P7CwbhrYrGYjTK9", "^", "nX3xFMpOQnc)", "H*D%&S1&ygQoMd)y!C3uN9RA)u", "ukv7mfb]F5Dovab8o0", "65Sf&AWi^@!UHyheBxXyX1", "u$PICi)0!41Pr5sKcM"]);
    });
  });

  describe("with magic strings available", function () {
    beforeEach(function () {
      global.recordLocation = {};
      global.recordLocation.magicValues = [42, 666, "foo", "bar", "baz", "one", "two", "three"];

      generator = new MagicStringGenerator();
    });

    afterEach(function () {
      global.recordLocation = null;
    });

    it("randomly pick between the magic strings", function () {
      expect(generator, "to yield items", ["baz", "two", "three", "bar", "two", "two", "one", "one", "foo", "baz"]);
    });
  });
});