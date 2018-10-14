# Custom value generator

A [generator](../generator/) capable of generating values from a given function.

This is one the most advanced and custom generators we offer. You should only
use this generator if non of the other generators as capable of doing the job.

```js#evaluate:false
const { age, date, name, producer, shape } = require("chance-generators")
```

You can use the previous value to compute the next. The second argument is an
optional first value to start the sequence with:

```js
const increasingNumber = producer(previous => previous + 1, 0);

expect(increasingNumber.take(5), "to equal", [0, 1, 2, 3, 4]);
```

You have an iteration context available where you can store information while
producing values:

```js
const color = producer((previous, context) => {
  const index = context.colorIndex || 0;
  context.colorIndex = index + 1;

  const colors = ["green", "yellow", "red"];
  return colors[index % colors.length];
});

expect(color.take(10), "to equal", [
  "green",
  "yellow",
  "red",
  "green",
  "yellow",
  "red",
  "green",
  "yellow",
  "red",
  "green"
]);
```

All generators in the returned value will be unwrapped:

```js
const user = producer(last => ({
  id: last ? last.id + 1 : 0,
  name,
  age
}));

expect(user.take(3), "to equal", [
  { id: 0, name: "Seth Tran", age: 26 },
  { id: 1, name: "Roxie Newman", age: 46 },
  { id: 2, name: "Gabriel Wood", age: 22 }
]);
```

You have a [chance](http://chancejs.com/) instance available when that is
needed:

```js
const customGenerator = producer((previous, context, chance) => {
  const includeDate = chance.bool();

  return {
    name,
    age,
    updateAt: includeDate ? date({ string: true }) : null,
    updateBy: includeDate ? name : null
  };
});

expect(customGenerator.take(6), "to equal", [
  {
    name: "Violet Simmons",
    age: 53,
    updateAt: "10/19/2078",
    updateBy: "Todd Houston"
  },
  {
    name: "Louise Dennis",
    age: 49,
    updateAt: "1/31/2023",
    updateBy: "Patrick Wilkerson"
  },
  {
    name: "Lydia Parks",
    age: 43,
    updateAt: "1/1/2061",
    updateBy: "Daniel Robertson"
  },
  { name: "Adam Nguyen", age: 22, updateAt: null, updateBy: null },
  { name: "Dora Lawrence", age: 42, updateAt: null, updateBy: null },
  { name: "Sophia Lee", age: 59, updateAt: null, updateBy: null }
]);
```
