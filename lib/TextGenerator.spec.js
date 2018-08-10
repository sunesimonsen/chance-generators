"use strict";

var expect = require("../test/expect");
var TextGenerator = require("./TextGenerator");
var chanceCache = require("./chanceCache");

describe("TextGenerator", function () {
  beforeEach(function () {
    chanceCache.clear();
  });

  var generator = void 0;

  beforeEach(function () {
    generator = new TextGenerator();
  });

  it("generates random text", function () {
    expect(generator, "to yield items", ["ofo", "lGlheH#ySk0Wbe)19*", "Goh bibro celel taj sibsof buunu bave dolbaw gokim sab ziwiwwuh gib.", "uN9uSOukv7mfb]ovab8o00165Sf&AWi^@!UHy", "Kos junla esohogbi dadeip riide rohu jod tuhdulhak retijic ti luh pi hoje fef. Mechug poh ub umi je hodpizhir leg liptemdov pa envewi logumem fojdewire guz regduw ipaje. Ivuzuecu iro lavub ki nozgo pe los vendijjeg ukiipi povivho sataf nuhijoow ru uvake jel re.", "&QfhpTX]AksMv#x2!ZkZ0AOvv7", "hup", "aL", "WfZD6d$$zcBQgGQXcyIlO[v!", "scc8wANjyM94up)UHg!doNEOZV"]);
  });

  describe("shrink", function () {
    it("shrinks towards the empty string", function () {
      expect(generator, "to shrink towards", "");
    });
  });

  describe("expand", function () {
    it("expands the given string", function () {
      expect(generator.expand("foobar"), "to yield items", ["foobar", "0Wfoobar", "foobar", "foobaS", "CfoobarG"]);
    });
  });

  describe("with magic strings available", function () {
    beforeEach(function () {
      global.recordLocation = {};
      global.recordLocation.magicValues = [42, 666, "foo", "bar", "baz", "one", "two", "three"];

      generator = new TextGenerator();
    });

    afterEach(function () {
      global.recordLocation = null;
    });

    it("uses the magic strings", function () {
      expect(generator, "to yield items", ["ofo", "one", "lheH", "baz", "Wbe)", "pan]nTwTMaFbvMTDkdv[BrHg6", "M[RId@", "Hea(*)P7CwbhrYrGYjTK9", "Gokim sab ziwiwwuh gib ejjitluh jahfab zejaaf woscujduv neclekos junla esohogbi dadeip riide rohu jod tuhdulhak retijic ti. Ehfimif jeofhi mechug poh ub umi je hodpizhir leg liptemdov pa envewi. Ta vej edowa rur va rimhuuw ipaje ewumovecu iro lavub ki nozgo pe los vendijjeg ukiipi povivho.", "bop"]);
    });
  });
});