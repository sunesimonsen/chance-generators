# Iterator

The iterator that is returned when calling `values` on a [generator](../generator/).

Here we will use the [integer](../integer/) generator as an example:

```js#evaluate:false
const { integer } = require("chance-generators")
```

## API

### isExpandable

Is true if the iterator can be expanded.

### isShrinkable

Is true if the iterator can be shrunken.

### expand(value)

Expands the current generator around the given value while still honoring the
constraints of the original generator. The given value should be the last value
the generator has produced.

You can use this method when a generator produces an interesting input and you
want to search around that value.

```js
const iterator = integer({ min: -10000, max: 10000 }).values();

iterator.expand(100);

expect(iterator.take(10), "to equal", [100, 9015, 100, 5594, 119, 100, 31, 100, 100, 174]);
```

As you can see the expanded iterator will produce values around `100` as that is
our expansion value.

### next()

Produces a new value based on the [generator](../generator/) that this iterator
was created from.

```js
const integerIterator = integer.values();

expect([integerIterator.next(), integerIterator.next(), integerIterator.next()], "to equal", [
  -2260084377780223,
  5342043492581377,
  8119347222413313
]);
```

### shrink(value)

Returns a new generator that is shunken around the given value while still
honoring the constraints of the original generator.

```js
integerIterator.shrink(1000);
```

This will shrink the iterator to produce values between `0` and `1000`.

```js
expect(integerIterator.take(5), "to equal", [183, 732, 780, 599, 597]);
```

If we shrink the iterator again with the smallest produces value from the last
run. It will produce values been `0` and `183`.

```js
integerIterator.shrink(183);

expect(integerIterator.take(5), "to equal", [28, 82, 28, 18, 10]);
```

The idea is that every time you find interesting input, you can try to search
for a smaller input by shrinking the iterator.

### take(n)

Produces `n` items with the generator and return them as an array:

```js
expect(integer.values().take(3), "to equal", [
  -2260084377780223,
  5342043492581377,
  8119347222413313
]);
```
