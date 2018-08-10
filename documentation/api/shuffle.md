# Shuffle generator

An array [generator](../generator/) that randomly shuffles items from a given
array.

```js#evaluate:false
const { age, letter, shuffle } = require("chance-generators");
```

```js
expect(shuffle(["a", "b", "c"]).take(5), "to equal", [
  ["b", "c", "a"],
  ["a", "b", "c"],
  ["b", "c", "a"],
  ["b", "a", "c"],
  ["a", "c", "b"]
]);
```

If the items are generators, they will be used to generate the items:

```js
expect(shuffle([age, letter, "wat"]).take(5), "to equal", [
  ["e", "wat", 53],
  ["wat", "e", 39],
  [40, "wat", "w"],
  ["s", "wat", 49],
  [52, "wat", "v"]
]);
```
