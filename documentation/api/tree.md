# Tree generator

Random tree [generator](../generator/).

```js#evaluate:false
const { natural, tree, word } = require("chance-generators");
```

When only given a generator, it generates random trees with leaves containing
items produced with the given generator. The number of leaves is between 0 to 30.

```js
const smallNumbers = natural({ max: 9 });

expect(tree(smallNumbers).take(5), "to equal", [
  [7, [9, [1, 7], 7, 5], [[5, 1], 4], 1, 0],
  [
    [[8, 9], [2, 0, 1, 9], 1, 6],
    [[[3, 6], 5, 0, 4], 0, 2, 5],
    6,
    3,
    1,
    0,
    2,
    9
  ],
  [
    [[3, 3, [0, 0], [2, 6, 2], 4], 6, [[1, 6], 4], 8, 0],
    [1, 9],
    [3, [2, 1, 6], 7],
    [3, 4],
    5,
    2
  ],
  [[[8, 5, 3, 9, 2], [6, 5], [[2, 1], 2], [8, 1], 0], 0, 9, 4],
  [[[6, 1], 9], [[[[8, 8], 6], 4, 3], 0, 0], 3]
]);
```

You can constrain the size of generated trees by providing a `min` and `max`.

Notice both limits are inclusive.

```js
expect(tree(smallNumbers, { min: 4, max: 8 }).take(5), "to equal", [
  [[[7, 9], 1], 7, 7],
  [[0, 4, 8], 3],
  [9, 7, 8, 9],
  [6, [3, 6], 5],
  [5, 6, [3, 1], 0]
]);
```

You don't have to specify all the options. The default will be used for the
options you don't specify:

```js
expect(tree(smallNumbers, { max: 4 }).take(10), "to equal", [
  [7],
  [[1, 7], 7, 5],
  [],
  [],
  [],
  [8, 3],
  [1, 7, 6],
  [8, 9, 2],
  [],
  [3, 6, 5]
]);
```

In case you want the tree to have a different structure, you an easily map over
it.

```js
const mapBranches = (tree, mapper) =>
  Array.isArray(tree)
    ? mapper(tree.map(child => mapBranches(child, mapper)))
    : tree;

const extendedTree = tree(smallNumbers).map(tree =>
  mapBranches(tree, children => ({ value: word, children }))
);

expect(extendedTree.first(), "to equal", {
  value: "ofaufjom",
  children: [
    7,
    {
      value: "be",
      children: [9, { value: "mabuj", children: [1, 7] }, 7, 5]
    },
    { value: "do", children: [{ value: "lisib", children: [5, 1] }, 4] },
    1,
    0
  ]
});
```
