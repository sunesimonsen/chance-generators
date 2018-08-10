# Shape generator

Random shape [generator](../generator/) capable of generating trees of data.

```js#evaluate:false
const {
  age,
  animal,
  array,
  bool,
  city,
  country,
  name,
  natural,
  shape,
  ssn,
  state,
  street,
  zip
} = require("chance-generators");
```

The shape generator take a tree of data as input. The tree can contain other
generators that will each yield the values that sub-tree.

```js
const person = shape({
  name,
  age,
  ssn,
  address: {
    city,
    country,
    state,
    street,
    zip
  },
  animal: pickone([animal, null])
});

expect(person.take(3), "to equal", [
  {
    name: "Seth Tran",
    age: 26,
    ssn: "866-52-1594",
    address: {
      city: "Fopcuewe",
      country: "AF",
      state: "FL",
      street: "Gohrak Avenue",
      zip: "25631"
    },
    animal: "Xiphosura"
  },
  {
    name: "Adam Nguyen",
    age: 22,
    ssn: "724-06-1977",
    address: {
      city: "Naowruj",
      country: "FJ",
      state: "AL",
      street: "Hono Court",
      zip: "64801"
    },
    animal: null
  },
  {
    name: "Kyle Simmons",
    age: 49,
    ssn: "456-66-1098",
    address: {
      city: "Okonokan",
      country: "CX",
      state: "MT",
      street: "Uhlog Parkway",
      zip: "85392"
    },
    animal: null
  }
]);
```

In case you want to create a recursive structure, you can do it the following
way. Just make sure the recursion is bounded.

```js
const smallNumber = natural({ max: 9 });

const tree = shape({
  left: bool.map(leaf => (leaf ? smallNumber : tree)),
  right: bool.map(leaf => (leaf ? smallNumber : tree))
});

expect(tree.take(2), "to equal", [
  {
    left: 7,
    right: {
      left: 7,
      right: {
        left: { left: { left: 4, right: 0 }, right: 4 },
        right: { left: 6, right: 7 }
      }
    }
  },
  {
    left: {
      left: 0,
      right: {
        left: { left: { left: { left: 0, right: 9 }, right: 6 }, right: 6 },
        right: { left: 4, right: 2 }
      }
    },
    right: { left: { left: 1, right: 2 }, right: { left: 2, right: 0 } }
  }
]);
```
