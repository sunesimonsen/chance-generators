"use strict";

var expect = require("../test/expect");
var PrimitiveGenerator = require("./PrimitiveGenerator");
var chanceCache = require("./chanceCache");

describe("PrimitiveGenerator", function () {
  var generator = void 0;

  beforeEach(function () {
    chanceCache.clear();
    generator = new PrimitiveGenerator();
  });

  it("generates primitive values", function () {
    expect(generator, "to yield items", [9015, 56, "lheH", "fop", 93.982, "an]nTwTMaFbvMTDkdv[BrHg6ToCM[", "sof", -97.3471, undefined, false, "ba", -52]);
  });

  describe("shrink", function () {
    it("shrinks the primitive value", function () {
      var value = generator.first();

      expect(value, "to equal", 9015);
      expect(generator.shrink(value), "to shrink towards", 0);
    });
  });

  describe("expand", function () {
    it("expands the primitive value", function () {
      var value = generator.first();

      expect(value, "to equal", 9015);

      expect(generator.expand(value), "to yield items", [56, -6880, "Ej wocu ofaufjom be mabuj do lisib valbuunu bave dolbaw gokim sab.", -1005, 79, 4546, -741306010488.0127, true, "Zeenejom ju bu mahbu wot cujduvtih le votevned esohogbi dadeip riide rohu jod tuhdulhak. Kudlewje bueh pi hoje fef wijug howeju tu caku vapiz soze wu tumit ede waser wi logumem fojdewire. Azpig duw ipaje ewumovecu iro lavub ki nozgo pe los vendijjeg ukiipi povivho. Bop uw juvza kimsuzceh egpa muvona to fejuhera lihakhup patofcok ivbedin kiruen haahra ese tic. Ri tasuz katji cebuc wocafig dof jozwom wibse daj ca ez nazinef tetu cejtu emofoc obututven nuawo. Tufjade do colubet pa lowbokuhi zi usilesev egizosde pitkedeb iva uzoli cicse gozzod puc. Norer fos ecumoce waccezluj huwsojwa lirhu mi mi zadup vigmelcu nubuz kuru cemucite nuwijwaw ocu doja nej jaj.", 9724.215]);
    });
  });
});