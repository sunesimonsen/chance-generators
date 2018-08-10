# Unique value generator

An array [generator](../generator/) that random picks unique items from another generator.

When only given a generator, it generates arrays containing items produced with
the given generator of length 0 to 20. It uses the identity function to decide
if items are unique.

```js#evaluate:false
const { age, name, natural, shape, unique } = require("chance-generators");
```

```js
const smallNumbers = natural({ max: 20 });

expect(unique(smallNumbers).take(5), "to equal", [
  [16, 19, 3, 15, 12, 9, 2],
  [9],
  [7, 12, 3, 14, 13, 0, 1, 20, 15, 17, 19, 4, 6, 11, 9, 8, 2, 16],
  [4, 8, 10, 20, 12, 9, 0, 18, 14, 3, 1, 19],
  [20, 11, 16, 8, 6, 0, 2, 4, 14, 5, 9, 12, 10, 17, 3, 19, 13, 15, 18]
]);
```

You can constrain the size of generated arrays by providing a `min` and `max`.

Notice both limits are inclusive.

```js
expect(unique(smallNumbers, { min: 3, max: 5 }).take(5), "to equal", [
  [16, 19, 3, 15],
  [12, 3, 9, 2, 1],
  [18, 7, 12, 3],
  [13, 0, 1, 20, 15],
  [19, 4, 0, 3, 20]
]);
```

You don't have to specify all the options. The default will be used for the
options you don't specify:

```js
expect(unique(smallNumbers, { max: 3 }).take(5), "to equal", [[16], [3, 15, 16], [12, 3], [3], []]);
```

You can override the comparator if you want to take control of the comparison of
the items.

Let's says we want arrays of persons containing only persons with unique ages.
If you just use the unique generator without a comparator, we might get persons
we the same age:

```js
const person = shape({
  name,
  age
});

expect(unique(person, { max: 10 }).take(3), "to equal", [
  [
    { name: "Violet Simmons", age: 53 },
    { name: "Alta Beck", age: 25 },
    { name: "Scott Collins", age: 20 },
    { name: "Derrick Pierce", age: 46 }
  ],
  [{ name: "Isabelle Anderson", age: 20 }],
  [
    { name: "Gussie Lloyd", age: 28 },
    { name: "Patrick Wilkerson", age: 26 },
    { name: "Lydia Parks", age: 43 },
    { name: "Travis Thomas", age: 31 },
    { name: "Beatrice Lawson", age: 24 },
    { name: "Harry Bryan", age: 35 },
    { name: "Todd Campbell", age: 55 },
    { name: "Dora Lawrence", age: 42 },
    { name: "Ruby Fuller", age: 20 },
    { name: "Christine Hubbard", age: 26 }
  ]
]);
```

As you can see Patrick Wilkerson and Christine Hubbard has the same age.

Now let's try to provide a comparator:

```js
expect(
  unique(person, {
    max: 10,
    comparator: (persons, { age }) => persons.some(p => p.age === age)
  }).take(3),
  "to equal",
  [
    [
      { name: "Violet Simmons", age: 53 },
      { name: "Alta Beck", age: 25 },
      { name: "Scott Collins", age: 20 },
      { name: "Derrick Pierce", age: 46 }
    ],
    [{ name: "Isabelle Anderson", age: 20 }],
    [
      { name: "Gussie Lloyd", age: 28 },
      { name: "Patrick Wilkerson", age: 26 },
      { name: "Lydia Parks", age: 43 },
      { name: "Travis Thomas", age: 31 },
      { name: "Beatrice Lawson", age: 24 },
      { name: "Harry Bryan", age: 35 },
      { name: "Todd Campbell", age: 55 },
      { name: "Dora Lawrence", age: 42 },
      { name: "Ruby Fuller", age: 20 },
      { name: "Paul Miller", age: 63 }
    ]
  ]
);
```
