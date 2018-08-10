# Array generator

Random array [generator](../generator/).

```js#evaluate:false
const { array, natural } = require("chance-generators");
```

When only given a generator, it generates arrays containing items produced with
the given generator of length 0 to 30.

```js
const smallNumbers = natural({ max: 9 });

expect(array(smallNumbers).take(5), "to equal", [
  [7, 9, 1, 7, 7, 5, 5, 1, 4, 1, 0],
  [4],
  [3, 6, 1, 7, 6, 0, 0, 9, 7, 8, 9, 2, 0, 1, 9, 1, 6, 3, 6, 5, 0, 4, 0, 2, 5, 6],
  [1, 0, 2, 9, 3, 2, 4, 0, 7, 6, 1, 3],
  [9, 5, 4, 0, 8, 6, 6, 1, 4, 0, 0, 9, 9, 9, 5]
]);
```

You can constrain the size of generated arrays by providing a `min` and `max`.

Notice both limits are inclusive.

```js
expect(array(smallNumbers, { min: 3, max: 5 }).take(5), "to equal", [
  [7, 9, 1, 7],
  [5, 5, 1, 4, 1],
  [0, 4, 8],
  [6, 1, 7, 6],
  [0, 9, 7]
]);
```

You don't have to specify all the options. The default will be used for the
options you don't specify:

```js
expect(array(smallNumbers, { max: 3 }).take(5), "to equal", [[7], [1, 7, 7], [5, 1], [1], []]);
```

You can compose generators however you like:

```js
const triples = array(smallNumbers, { min: 3, max: 3 });

expect(array(triples, { min: 3, max: 3 }).take(3), "to equal", [
  [[9, 1, 7], [5, 5, 1], [1, 0, 0]],
  [[3, 6, 1], [6, 0, 0], [7, 8, 9]],
  [[1, 9, 1], [3, 6, 5], [4, 0, 2]]
]);
```

This generator can also be useful for generating random arrays from a predefined
list of items:

```js
const commands = pickone(["left", "right", "continue", "stop"]);

expect(array(commands, { max: 10 }).take(3), "to equal", [
  ["stop", "stop", "left", "continue"],
  ["continue", "continue", "left", "right", "left", "left", "left", "right"],
  ["right", "continue", "left", "continue", "continue", "left", "left", "stop", "continue"]
]);
```
