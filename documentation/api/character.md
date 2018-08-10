# Character generator

Random character [generator](../generator/).

```js#evaluate:false
const { character } = require("chance-generators")
```

Without any arguments it generates random characters from the following pool:
`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]`.

```js
expect(character.take(5), "to equal", ["B", "6", "(", "n", "2"]);
```

You can limit the generated characters to only be alphanumeric:

```js
expect(character({ alpha: true }).take(5), "to equal", ["t", "P", "X", "j", "M"]);
```

You can generate only lower-case or upper case letters:

```js
expect(character({ casing: "lower" }).take(5), "to equal", ["r", "#", ")", "i", "9"]);
```

```js
expect(character({ casing: "upper" }).take(5), "to equal", ["R", "#", ")", "I", "9"]);
```

You can also chose to only generate symbols:

```js
expect(character({ symbols: true }).take(5), "to equal", ["%", ")", "]", "#", "("]);
```

You can specify the pool the characters are generated from:

```js
expect(character({ pool: "abc" }).take(5), "to equal", ["b", "c", "c", "a", "c"]);
```
