# Custom value generator

A [generator](../generator/) capable of generating values from a given function.

You should only use this generator if non of the other generators as capable of
doing the job.

```js#evaluate:false
const { producer } = require("chance-generators")
```

```js
const increasingNumbers = producer(result => result + 1, 0);

expect(increasingNumbers.take(5), "to equal", [
  0, 1, 2, 3, 4
]);
```

```js
const customGenerator = producer((last, chance) => (
  chance.natural({ max: 10 }) * chance.natural({ max: 10 })
));

expect(customGenerator.take(6), "to equal", [32, 20, 64, 36, 4, 1]);
```
