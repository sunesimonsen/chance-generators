const SequenceGenerator = require("./SequenceGenerator");
const expect = require("../test/expect");
const IntegerGenerator = require("./IntegerGenerator");
const chanceCache = require("./chanceCache");

describe("SequenceGenerator", () => {
  beforeEach(() => {
    chanceCache.clear();
  });

  describe("when given no arguments", () => {
    it("fails", () => {
      expect(
        () => {
          new SequenceGenerator(); // eslint-disable-line no-new
        },
        "to throw",
        "The sequence generator requires a producer function as first argument"
      );
    });
  });

  const producer = previous => ({
    gender: previous && previous.gender === "female" ? "male" : "female",
    age: new IntegerGenerator({ min: 0, max: 100 })
  });

  let generator;
  beforeEach(() => {
    generator = new SequenceGenerator(producer);
  });

  it("uses the function to generate a sequence of values", () => {
    expect(generator, "to yield items", [
      [
        { gender: "female", age: 80 },
        { gender: "male", age: 96 },
        { gender: "female", age: 18 },
        { gender: "male", age: 73 },
        { gender: "female", age: 78 },
        { gender: "male", age: 60 },
        { gender: "female", age: 60 },
        { gender: "male", age: 15 },
        { gender: "female", age: 45 },
        { gender: "male", age: 15 },
        { gender: "female", age: 10 }
      ],
      [{ gender: "female", age: 46 }]
    ]);
  });

  describe("shrink", () => {
    it("shrinks towards the empty array", () => {
      expect(generator, "to shrink towards", []);
    });
  });

  describe("expand", () => {
    it("expands the given sequence", () => {
      const generated = generator.first();
      expect(generator.expand(generated), "to yield items", [
        [
          { gender: "female", age: 46 },
          { gender: "male", age: 87 },
          { gender: "female", age: 33 },
          { gender: "male", age: 60 },
          { gender: "female", age: 14 },
          { gender: "male", age: 71 },
          { gender: "female", age: 65 },
          { gender: "male", age: 2 },
          { gender: "female", age: 5 },
          { gender: "male", age: 97 },
          { gender: "female", age: 72 },
          { gender: "male", age: 84 },
          { gender: "female", age: 94 }
        ],
        [
          { gender: "female", age: 0 },
          { gender: "male", age: 18 },
          { gender: "female", age: 100 },
          { gender: "male", age: 18 },
          { gender: "female", age: 62 },
          { gender: "male", age: 30 },
          { gender: "female", age: 61 },
          { gender: "male", age: 53 },
          { gender: "female", age: 0 },
          { gender: "male", age: 43 },
          { gender: "female", age: 2 },
          { gender: "male", age: 29 },
          { gender: "female", age: 53 },
          { gender: "male", age: 61 },
          { gender: "female", age: 40 },
          { gender: "male", age: 14 }
        ],
        [
          { gender: "female", age: 29 },
          { gender: "male", age: 98 },
          { gender: "female", age: 37 },
          { gender: "male", age: 23 },
          { gender: "female", age: 46 },
          { gender: "male", age: 9 },
          { gender: "female", age: 79 },
          { gender: "male", age: 62 },
          { gender: "female", age: 20 },
          { gender: "male", age: 38 },
          { gender: "female", age: 51 },
          { gender: "male", age: 99 }
        ]
      ]);
    });
  });

  describe("when given a min and max", () => {
    beforeEach(() => {
      generator = new SequenceGenerator(producer, { min: 3, max: 5 });
    });

    it("generates arrays between the limits", () => {
      expect(generator, "to yield items", [
        [
          { gender: "female", age: 80 },
          { gender: "male", age: 96 },
          { gender: "female", age: 18 },
          { gender: "male", age: 73 }
        ],
        [
          { gender: "female", age: 60 },
          { gender: "male", age: 60 },
          { gender: "female", age: 15 },
          { gender: "male", age: 45 },
          { gender: "female", age: 15 }
        ]
      ]);
    });

    describe("shrink", () => {
      it("shrinks towards the minimum allowed list", () => {
        expect(generator, "to shrink towards", [
          { gender: "female", age: 10 },
          { gender: "male", age: 5 },
          { gender: "female", age: 46 }
        ]);
      });
    });

    describe("expand", () => {
      it("honors the length constraints", () => {
        const generated = generator.first();

        expect(generator.expand(generated), "to yield items", [
          [
            { gender: "female", age: 60 },
            { gender: "male", age: 60 },
            { gender: "female", age: 15 },
            { gender: "male", age: 45 },
            { gender: "female", age: 15 }
          ],
          [
            { gender: "female", age: 5 },
            { gender: "male", age: 46 },
            { gender: "female", age: 87 },
            { gender: "male", age: 33 },
            { gender: "female", age: 60 }
          ],
          [
            { gender: "female", age: 71 },
            { gender: "male", age: 65 },
            { gender: "female", age: 2 },
            { gender: "male", age: 5 },
            { gender: "female", age: 97 }
          ]
        ]);
      });
    });
  });
});
