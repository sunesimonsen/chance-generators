# Primitive generator

Random primitive value [generator](../generator/).

```js#evaluate:false
const { primitive } = require("chance-generators");
```

It generates primitive values (strings, numbers, booleans, null and undefined).

```js
expect(primitive.take(10), "to equal", [
  9015,
  56,
  "lheH",
  "fop",
  93.982,
  "an]nTwTMaFbvMTDkdv[BrHg6ToCM[",
  "sof",
  -97.3471,
  undefined,
  false
]);
```
