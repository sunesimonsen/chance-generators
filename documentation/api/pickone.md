# Pick-one generator

A [generator](../generator/) that will randomly pick items from an array of
possible items.

```js#evaluate:false
const { natural, pickone, string } = require("chance-generators");
```

```js
const traficLight = pickone(["red", "yellow", "green"]);

expect(traficLight.take(5), "to equal", ["yellow", "green", "green", "red", "green"]);
```

If you use generators as items, they will be used to produce a value when they
are picked:

```js
const stuff = pickone([string, 666, natural({ max: 10 })]);

expect(stuff.take(10), "to equal", [
  666,
  10,
  "SSlGlheH#ySk0Wbe)19*pa",
  "TwTMaFbvMTDkdv[BrHg6ToCM[RId@S",
  1,
  666,
  "",
  10,
  666,
  4
]);
```
