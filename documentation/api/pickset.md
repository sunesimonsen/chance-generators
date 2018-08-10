# Pick-set generator

A [generator](../generator/) that will pick random subsets from an array of
possible items.

```js#evaluate:false
const { natural, pickset, string } = require("chance-generators");
```

When given only an array of items it picks subsets from that array.

```js
const palettes = pickset([
  "#78a300",
  "#37b8af",
  "#30aabc",
  "#eb4962",
  "#ff6d5a",
  "#eb6651",
  "#f79a3e",
  "#efc93d"
]);

expect(palettes.take(5), "to equal", [
  ["#f79a3e", "#efc93d", "#37b8af"],
  ["#37b8af", "#78a300", "#f79a3e", "#30aabc"],
  ["#eb6651", "#78a300", "#f79a3e", "#ff6d5a", "#30aabc", "#eb4962"],
  [],
  ["#efc93d"]
]);
```

You can constrain the length of the generated sets using `min` and `max` (both are inclusive):

If you don't specify both limits, then `min` defaults to 0 and `max` defaults to
the length of the item array:

```js
const luckyNumbers = pickset([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
  min: 3,
  max: 4
});

expect(luckyNumbers.take(5), "to equal", [
  [7, 8, 1],
  [0, 4, 6],
  [7, 9, 8, 1],
  [5, 0, 3, 8],
  [9, 3, 1]
]);
```

If you use generators as items, they will be used to produce a value when they
are picked:

```js
const stuff = pickset([string, 666, natural({ max: 10 })], { min: 2, max: 2 });

expect(stuff.take(10), "to equal", [
  [8, 666],
  [666, 4],
  ["Sk0Wbe)19*pan]nTwTMaFbvMTD", 1],
  ["g6ToCM[", 666],
  [666, "mHea(*)P7CwbhrYrGY"],
  [666, "^"],
  ["FMpOQnc)!5H*D%&S1&ygQoM", 0],
  ["N9RA)uSOukv7mfb]F5Dovab", 666],
  ["5Sf&AWi^@!UHyheBxXyX1R", 666],
  ["i)0!41Pr5sKcM0", 666]
]);
```
