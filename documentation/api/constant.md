# Constant generator

A [generator](../generator/) that keeps generating the given value.

```js#evaluate:false
const { constant } = require("chance-generators");
```

```js
expect(constant(6).take(3), "to equal", [6, 6, 6]);

expect(constant("s").take(3), "to equal", ["s", "s", "s"]);
```
