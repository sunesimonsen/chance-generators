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

  let generator;
  beforeEach(() => {
    generator = new SequenceGenerator(previous => {
      return {
        gender: previous && previous.gender === "female" ? "male" : "female",
        age: new IntegerGenerator({ min: 0, max: 100 })
      };
    });
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
      const generated = generator.take(1)[0];
      expect(generator.expand(generated), "to yield items", [
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
          { gender: "female", age: 10 },

          { gender: "male", age: 46 }
        ],
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
          { gender: "female", age: 10 },

          { gender: "male", age: 33 },
          { gender: "female", age: 60 },
          { gender: "male", age: 14 },
          { gender: "female", age: 71 },
          { gender: "male", age: 65 },
          { gender: "female", age: 2 },
          { gender: "male", age: 5 },
          { gender: "female", age: 97 },
          { gender: "male", age: 72 },
          { gender: "female", age: 84 },
          { gender: "male", age: 94 },
          { gender: "female", age: 21 },
          { gender: "male", age: 0 },
          { gender: "female", age: 18 },
          { gender: "male", age: 100 },
          { gender: "female", age: 18 },
          { gender: "male", age: 62 }
        ],
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
          { gender: "female", age: 10 },

          { gender: "male", age: 61 },
          { gender: "female", age: 53 },
          { gender: "male", age: 0 },
          { gender: "female", age: 43 },
          { gender: "male", age: 2 },
          { gender: "female", age: 29 }
        ]
      ]);
    });
  });

  describe("when given a min and max", () => {
    beforeEach(() => {
      generator.options.min = 3;
      generator.options.max = 5;
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
        const generated = generator.take(1)[0];
        expect(generator.expand(generated), "to yield items", [
          [
            { gender: "female", age: 80 },
            { gender: "male", age: 96 },
            { gender: "female", age: 18 },
            { gender: "male", age: 73 },

            { gender: "female", age: 60 }
          ],
          [
            { gender: "female", age: 80 },
            { gender: "male", age: 96 },
            { gender: "female", age: 18 },
            { gender: "male", age: 73 },

            { gender: "female", age: 15 }
          ],
          [
            { gender: "female", age: 80 },
            { gender: "male", age: 96 },
            { gender: "female", age: 18 },
            { gender: "male", age: 73 }
          ],
          [
            { gender: "female", age: 80 },
            { gender: "male", age: 96 },
            { gender: "female", age: 18 },
            { gender: "male", age: 73 }
          ],
          [
            { gender: "female", age: 80 },
            { gender: "male", age: 96 },
            { gender: "female", age: 18 },
            { gender: "male", age: 73 }
          ]
        ]);
      });
    });
  });
});
