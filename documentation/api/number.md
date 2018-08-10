# Number generator

A random number [generator](../generator/), capable of generating integers, floats, infinite numbers, `-0`, `+0` and `NaN`.

For more controlled number generation see [integer](../integer/),
[natural](../natural/) and [floating](../floating/).

By default it generates integers and floats:

```js#evaluate:false
const { number } = require("chance-generators");
```

```js
expect(number.take(10), "to equal", [
  5930.8597,
  -6332,
  56,
  19,
  -10.8335,
  -80.0051,
  -8.1502,
  -3326,
  -72,
  30
]);
```

You have the following number categories you can enable or disable:

* integer: (true) integer numbers
* floating: (true) floating point numbers
* infinity: (false) `Infinity` and `-Infinity`
* nan: (false) `NaN`

Generate only integers:

```js
expect(number({ floating: false }).take(10), "to equal", [
  60,
  -5702731889115135,
  5594,
  1937,
  -11,
  -80,
  -8,
  -3326,
  -7143,
  3018
]);
```

Generate only floats:

```js
expect(number({ integer: false }).take(10), "to equal", [
  59.3086,
  -570273188911.5135,
  5593.82,
  1937.0032,
  -10.8335,
  -80.0051,
  -8.1502,
  -3325.8278,
  -7142.6638,
  3017.7695
]);
```

You can include `Infinity`, `-Infinity` and `NaN`:

```js
expect(number({ infinity: true, nan: true }).take(2000), "to contain", Infinity, -Infinity, NaN);
```
