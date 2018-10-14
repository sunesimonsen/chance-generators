# Sequence generator

This is most advanced [generator](../generator/) we offer.
It produces sequences of items using a given producer function that have
knowledge of the previous generated item as well as running context.

Let's create an event producer that uses a state machine to only generate valid
sequences of events:

```js#evaluate:false
const { pickone, sequence } = require("chance-generators");
```

```js
const StateMachine = require("javascript-state-machine");

const createStateMachine = () =>
  StateMachine.create({
    initial: "green",
    events: [
      { name: "warn", from: "green", to: "yellow" },
      { name: "panic", from: "yellow", to: "red" },
      { name: "calm", from: "red", to: "yellow" },
      { name: "clear", from: "yellow", to: "green" }
    ]
  });

const eventProducer = (previous, context) => {
  if (context.fsm) {
    // transition the state machine with the previously generated event
    context.fsm[previous]();
  } else {
    context.fsm = createStateMachine();
  }
  // find the possible transtions
  const transitions = context.fsm.transitions();
  // pick a random one.
  return pickone(transitions);
};
```

Now we have a producer we can use for generating sequences with a length between
5 and 10:

```js
const eventSequence = sequence(eventProducer, { min: 5, max: 10 });

expect(eventSequence.take(3), "to equal", [
  ["warn", "clear", "warn", "clear", "warn", "clear", "warn"],
  ["warn", "panic", "calm", "panic", "calm"],
  ["warn", "clear", "warn", "clear", "warn", "panic", "calm", "clear", "warn", "clear"]
]);
```

If you don't provide a `min` or `max` the sequence generator will produce
sequences with lengths between 0 and 30.

It can sometimes be useful to provide in initial value, that otherwise defaults
to `null`.

Let's try to generate increasing integer sequences starting from 0:

```js
const increasingIntegers = sequence(previous => previous + 1, {
  initialValue: -1,
  max: 10
});

expect(increasingIntegers.take(3), "to equal", [
  [0, 1, 2, 3],
  [0, 1, 2, 3, 4, 5, 6, 7],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
]);
```
