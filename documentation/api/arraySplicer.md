# Array splicing generator

A [generator](../generator/) that given an array generates new arrays by
cutting out a random part of the original array.

```js#evaluate:false
const { arraySplicer } = require("chance-generators");
```

Let's generate some sorted arrays based on a sorted array of increasing integers:

```js
expect(arraySplicer([0, 1, 2, 3, 4, 5, 6, 7, 9]).take(5), "to equal", [
  [0, 1, 2, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 9],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 7, 9],
  [0, 5, 6, 7, 9]
]);
```

You can constrain the length of the generated arrays by providing a `min` option:

```js
expect(arraySplicer([0, 1, 2, 3, 4, 5, 6, 7, 9], { min: 6 }).take(5), "to equal", [
  [0, 1, 2, 6, 7, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 9],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 7, 9],
  [0, 2, 3, 4, 5, 6, 7, 9]
]);
```
