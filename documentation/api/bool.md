# Boolean generator

Random boolean [generator](../generator/).

```js#evaluate:false
const { bool } = require("chance-generators");
```

Without any arguments it generates random booleans:

```js
expect(bool.take(5), "to equal", [true, false, false, true, false]);
```

You can control the likelihood of returning `true`:

```js
expect(bool({ likelihood: 30 }).take(5), "to equal", [false, false, false, true, false]);
```
