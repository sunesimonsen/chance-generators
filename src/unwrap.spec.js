const expect = require("../test/expect");
const unwrap = require("./unwrap");
const NumberGenerator = require("./NumberGenerator");
const Chance = require("chance");

describe("unwrap", () => {
  it("should let undefined through", () => {
    expect(unwrap(undefined), "to be undefined");
  });

  it("should let null through", () => {
    expect(unwrap(null), "to be null");
  });

  it("should unwrap a generator", () => {
    expect(
      unwrap(
        new NumberGenerator({
          integer: true
        }),
        new Chance(42)
      ),
      "to equal",
      5930.8597
    );
  });

  describe("with an array", () => {
    it("should clone an array of primitives", () => {
      const original = [1, 2, 3];
      const unwrapped = unwrap(original);
      expect(unwrapped, "to equal", original).and("not to be", original);
    });

    it("should unwrap generators in the array", () => {
      expect(
        unwrap(
          [
            new NumberGenerator({
              integer: true
            })
          ],
          new Chance(42)
        ),
        "to equal",
        [5930.8597]
      );
    });
  });

  describe("with a plain object", () => {
    it("with primitive values", () => {
      it("should clone the object", () => {
        const original = { a: 1, b: 2 };
        const unwrapped = unwrap(original);
        expect(unwrapped, "to equal", original).and("not to be", original);
      });
    });

    it("should unwrap a generator in an object value", () => {
      expect(
        unwrap(
          {
            a: new NumberGenerator({
              integer: true
            })
          },
          new Chance(42)
        ),
        "to equal",
        { a: 5930.8597 }
      );
    });
  });

  it("should let a non-plain object through", () => {
    function Person(name) {
      this.name = name;
    }
    const original = new Person("Ejner");
    const unwrapped = unwrap(original);
    expect(unwrapped, "to be", original);
  });
});
