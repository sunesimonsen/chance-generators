# Generator

Base class for all generators.

Here we will use the [integer](../integer/) generator as an example:

```js#evaluate:false
const { integer } = require("chance-generators")
```

## API

### map(mapper)

Returns a new generator where all values generated from the original will be
mapped with the given `mapper` function.

```js
expect(
  integer({ min: 0, max: 100 })
    .map(v => `${v} kr`)
    .take(3),
  "to equal",
  ["37 kr", "80 kr", "96 kr"]
);
```

All generators in the mapped value will be unwrapped:

```js
const ranges = integer({ min: 0, max: 100 }).map(to => ({
  from: integer({ min: 0, max: to }),
  to
}));

expect(ranges.take(5), "to equal", [
  { from: 30, to: 37 },
  { from: 17, to: 96 },
  { from: 57, to: 73 },
  { from: 36, to: 60 },
  { from: 7, to: 15 }
]);
```

### take(n, [options])

Calls `values` and takes the `n` first items from the iterator:

```js
expect(integer.take(3), "to equal", [-2260084377780223, 5342043492581377, 8119347222413313]);
```

Any options will be forwarded to the `values` method:

```js
expect(integer.take(3, { seed: 666 }), "to equal", [
  3610754225799169,
  -7158602909351935,
  6200315372109825
]);
```

### values([options])

Returns an iterator for the generator with a default seed:

```js
const iterator = integer.values();

expect([iterator.next(), iterator.next(), iterator.next()], "to equal", [
  -2260084377780223,
  5342043492581377,
  8119347222413313
]);
```

You can optionally also provide a seed for the random generator:

```js
const seededIterator = integer.values({ seed: 666 });

expect([seededIterator.next(), seededIterator.next(), seededIterator.next()], "to equal", [
  3610754225799169,
  -7158602909351935,
  6200315372109825
]);
```

It is also possible to make the generated values completely random by using a
random seed:

```js
const randomIterator = integer.values({ seed: null });

expect(
  [randomIterator.next(), randomIterator.next(), randomIterator.next()],
  "to have items satisfying",
  "to be a number"
);
```
