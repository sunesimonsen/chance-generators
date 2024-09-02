# Custom value generator

A [generator](../generator/) capable of generating values from a given function.

This is one the most advanced and custom generators we offer. You should only
use this generator if non of the other generators as capable of doing the job.

```js#evaluate:false
const { age, date, name, producer, shape } = require("chance-generators");
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
    updateAt: includeDate
      ? date({
          string: true,
          min: new Date("2018-01-01T00:00:00Z"),
          max: new Date("2024-01-01T00:00:00Z")
        })
      : null,
    updateBy: includeDate ? name : null
  };
});

expect(customGenerator.take(6), "to equal", [
  {
    name: "Violet Simmons",
    age: 53,
    updateAt: "9/5/2022",
    updateBy: "Winifred Barnes"
  },
  {
    name: "Kevin King",
    age: 40,
    updateAt: "3/13/2023",
    updateBy: "Elijah Watson"
  },
  {
    name: "Ida Hernandez",
    age: 64,
    updateAt: null,
    updateBy: null
  },
  { name: "Ophelia Woods", age: 18, updateAt: null, updateBy: null },
  {
    name: "Pearl Norris",
    age: 32,
    updateAt: "9/2/2021",
    updateBy: "Emma Meyer"
  },
  {
    name: "Nathaniel Parks",
    age: 37,
    updateAt: "11/2/2018",
    updateBy: "Harry Bryan"
  }
]);
```
