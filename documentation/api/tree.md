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
  [[[5, 1], [0, [6, 7], 0], 9, 8], [1, [3, 5]]],
  [],
  [2, [[2, [4, 7]], [[5, 0], [1, 0]]], 9, [[3, 0], 6, 4]],
  [
    [8, 1, 3],
    [[4, [5, 0], 8], [3, 9]],
    [[5, [9, 8], [5, [9, 6, 2]], [1, 0], [3, 2]], 0]
  ],
  [
    [[[0, 3], 1], [6, 3]],
    [3, [7, 6]],
    [[[7, 7], [7, 4]], 5, [0, 1]],
    [[[5, 9], 2, 4], 7],
    [[[1, 9], [6, 8]], 8]
  ]
]);
```

You can constrain the size of generated trees by providing a `min` and `max`.

Notice both limits are inclusive.

```js
expect(tree(smallNumbers, { min: 4, max: 8 }).take(5), "to equal", [
  [[7, [[1, 0], 8]], 6],
  [[0, [9, 0]], 9],
  [[5, 4], 2, 6],
  [0, [2, 0], [3, 9]],
  [[[1, 0], 9], [[3, 0], 6]]
]);
```

You don't have to specify all the options. The default will be used for the
options you don't specify:

```js
expect(tree(smallNumbers, { max: 4 }).take(10), "to equal", [
  [9],
  [],
  [[1, 1], 0],
  [3, 1],
  [[9, 8], 2],
  [],
  [],
  [6, 6, [0, 5]],
  [1, 2, 3],
  [0]
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
    value: 0,
    children: [
      {
        value: 4,
        children: [
          { value: 0, children: [5, 1] },
          { value: 2, children: [0, { value: 5, children: [6, 7] }, 0] },
          9,
          8
        ]
      },
      { value: 6, children: [1, { value: 3, children: [3, 5] }] }
    ]
  }
]);
```
