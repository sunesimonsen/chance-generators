# Tree generator

Random tree [generator](../generator/).

```js#evaluate:false
const { tree } = require("chance-generators");
```

When only given a generator, it generates random trees with leafs containing
items produced with the given generator. The number of leafs is between 0 to 30.

```js
const smallNumbers = natural({ max: 9 });

expect(tree(smallNumbers).take(5), "to equal", [
  [[7, [[[0, 8], 6, 7], [9, 8], 2], 1], 1, 3],
  [[[5, 3, 0, 9], [0, 6, 3], 9, 4], 8, [4, 0, 9], [3, 0, 2], 2, 6],
  [[0, 9], 2],
  [[4, 2, 5], 0, 8],
  [
    [[5, 9, 0, 1], [3, 3, 2, 8, 3, 2], 5],
    [[0, 9], [1, 0], 8, 7],
    [7, 0, 3],
    1,
    8,
    6,
    3
  ]
]);
```

You can constrain the size of generated trees by providing a `min` and `max`.

Notice both limits are inclusive.

```js
expect(tree(smallNumbers, { min: 4, max: 8 }).take(5), "to equal", [
  [[7, 5, 1, 1], 0],
  [3, [[0, 7, 9], 0], 9],
  [[[4, 2], 6], 1],
  [9, 2, 0, 6],
  [5, 5, 0, 6]
]);
```

You don't have to specify all the options. The default will be used for the
options you don't specify:

```js
expect(tree(smallNumbers, { max: 4 }).take(10), "to equal", [
  [9],
  [],
  [5, 1, 1],
  [],
  [],
  [3, 1],
  [[9, 8], 2],
  [],
  [],
  [6, 6, 0, 0]
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
  mapBranches(tree, children => ({ value: smallNumbers, children }))
);

expect(extendedTree.take(1), "to equal", [
  {
    value: 6,
    children: [
      {
        value: 5,
        children: [
          7,
          {
            value: 0,
            children: [
              { value: 4, children: [{ value: 0, children: [0, 8] }, 6, 7] },
              { value: 2, children: [9, 8] },
              2
            ]
          },
          1
        ]
      },
      1,
      3
    ]
  }
]);
```
