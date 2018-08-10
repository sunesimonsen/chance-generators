# Integer generator

Random integer [generator](../generator/).

```js#evaluate:false
const { integer } = require("chance-generators")
```

Without any arguments it generates random integers between

`Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.

```js
expect(integer.take(5), "to equal", [
  -2260084377780223,
  5342043492581377,
  8119347222413313,
  -5702731889115135,
  4179231256870913
]);
```

You can constrain the limits of the generated integers by given it `min` and
`max`.

Notice both limits are inclusive.

```js
const age = integer({ min: 0, max: 122 });

expect(age.take(5), "to equal", [46, 97, 116, 22, 90]);
```

You don't have to specify all the options. The default will be used for the
options you don't specify:

```js
const positive = integer({ min: 0 });

expect(positive.take(5), "to equal", [
  3373557438480384,
  7174621373661184,
  8563273238577152,
  1652233682812928,
  6593215255805952
]);
```
