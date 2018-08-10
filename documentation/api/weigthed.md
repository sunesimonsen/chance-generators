# Weighted generator

A [generator](../generator/) that randomly picks items based on weights.

```js#evaluate:false
const { string, natural, weighted } = require("chance-generators");
```

You give the `weighted` generator a list of pairs, where each pair consist of
the item and its associated weight.

The weights are all relative, it will ensure that all items are generated
relative to all of the weights.

```js
const ab = weighted([["a", 10], ["b", 1]]);

expect(ab.take(10), "to equal", ["a", "a", "b", "a", "a", "a", "a", "a", "a", "a"]);
```

The above code will generate `a` 10 times more often than `a`.

Below you can an example of generating sums eyes when tossing two dices.

```js
const twoDiceSum = weighted([
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 4],
  [6, 5],
  [7, 6],
  [8, 5],
  [9, 4],
  [10, 3],
  [11, 2],
  [12, 1]
]);

const frequecies = twoDiceSum.take(1000).reduce(
  (result, sum) => ({
    ...result,
    [sum]: (result[sum] || 0) + 1
  }),
  {}
);

expect(frequecies, "to equal", {
  2: 30,
  3: 60,
  4: 77,
  5: 111,
  6: 146,
  7: 161,
  8: 148,
  9: 91,
  10: 82,
  11: 64,
  12: 30
});
```

You can also use generators as items. The item generators will be picked using
the weight described above. When an item generator has been picked, that is used
to generate the next value.

```js
const stringsAndNumbers = weighted([[natural({ max: 9 }), 3], [string({ max: 3 }), 1]]);

expect(stringsAndNumbers.take(10), "to equal", [7, "", "lG", 0, 4, "k", 6, 0, "*p", 1]);
```
