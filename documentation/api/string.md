# String generator

Random string [generator](../generator/).

```js#evaluate:false
const { string } = require("chance-generators")
```

Without any arguments it generates random strings with a length between `0` and
`30`. It chooses characters from the following pool:
`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]`.

```js
expect(string.take(5), "to equal", [
  "(n25SSlGlhe",
  "ySk0Wbe)19*pan",
  "TwTMaFbvMTDkdv[BrHg6ToCM[RId@S",
  "Hea(*)P7CwbhrYrGYjTK9",
  "^"
]);
```

You can constrain the limits of the generated strings by providing `min`, `max` and `pool`:

```js
expect(string({ min: 5, max: 10, pool: "abcde" }).take(5), "to equal", [
  "eaddcca",
  "aacebda",
  "aaedeebaa",
  "dbdcacabcd",
  "abebbca"
]);
```

You don't have to specify all the options. The default will be used for the
options you don't specify:

```js
expect(string({ max: 10, pool: "A" }).take(5), "to equal", [
  "AAAA",
  "AAAAAA",
  "AAAAAAAAA",
  "AAAAAAAAAA",
  ""
]);
```
