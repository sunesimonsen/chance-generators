"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
      var _generator$take = generator.take(1),
          _generator$take2 = _slicedToArray(_generator$take, 1),
          value = _generator$take2[0];

      expect(value, "to equal", 9015);
      expect(generator.shrink(value), "to shrink towards", 0);
    });
  });

  describe("expand", function () {
    it("expands the primitive value", function () {
      var _generator$take3 = generator.take(1),
          _generator$take4 = _slicedToArray(_generator$take3, 1),
          value = _generator$take4[0];

      expect(value, "to equal", 9015);

      expect(generator.expand(value), "to yield items", [56, -6880, "Ej wocu ofaufjom be mabuj do lisib valbuunu bave dolbaw gokim sab.", -1005, 79, 4546, -741306010488.0127, true, "Zeenejom ju bu mahbu wot cujduvtih le votevned esohogbi dadeip riide rohu jod tuhdulhak. Kudlewje bueh pi hoje fef wijug howeju tu caku vapiz soze wu tumit ede waser wi logumem fojdewire. Azpig duw ipaje ewumovecu iro lavub ki nozgo pe los vendijjeg ukiipi povivho. Bop uw juvza kimsuzceh egpa muvona to fejuhera lihakhup patofcok ivbedin kiruen haahra ese tic. Ri tasuz katji cebuc wocafig dof jozwom wibse daj ca ez nazinef tetu cejtu emofoc obututven nuawo. Tufjade do colubet pa lowbokuhi zi usilesev egizosde pitkedeb iva uzoli cicse gozzod puc. Norer fos ecumoce waccezluj huwsojwa lirhu mi mi zadup vigmelcu nubuz kuru cemucite nuwijwaw ocu doja nej jaj.", 9724.215]);
    });
  });
});