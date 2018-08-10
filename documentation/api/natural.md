# Natural generator

Random natural number [generator](../generator/).

```js#evaluate:false
const { natural } = require("chance-generators")
```

Without any arguments it generates random natural numbers between `0` and
`Number.MAX_SAFE_INTEGER`.

```js
expect(natural.take(5), "to equal", [
  3373557438480384,
  7174621373661184,
  8563273238577152,
  1652233682812928,
  6593215255805952
]);
```

You can constrain the limits of the generated integers by given it `min` and
`max`.

Notice both limits are inclusive.

```js
expect(natural({ min: 5, max: 10 }).take(5), "to equal", [7, 9, 10, 6, 9]);
```

You don't have to specify all the options. The default will be used for the
options you don't specify:

```js
const age = natural({ max: 122 });

expect(age.take(5), "to equal", [46, 97, 116, 22, 90]);
```
