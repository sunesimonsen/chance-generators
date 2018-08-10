# Text generator

A random text [generator](../generator/), for cases where you just need some
text without any constraints. This generator generates more types of strings
then the [string](../string/) generator, but can't constraint the length.

```js#evaluate:false
const { text } = require("chance-generators");
```

Let's generate some text:

```js
expect(text.take(10), "to equal", [
  "ofo",
  "lGlheH#ySk0Wbe)19*",
  "Goh bibro celel taj sibsof buunu bave dolbaw gokim sab ziwiwwuh gib.",
  "uN9uSOukv7mfb]ovab8o00165Sf&AWi^@!UHy",
  "Kos junla esohogbi dadeip riide rohu jod tuhdulhak retijic ti luh pi hoje fef. Mechug poh ub umi je hodpizhir leg liptemdov pa envewi logumem fojdewire guz regduw ipaje. Ivuzuecu iro lavub ki nozgo pe los vendijjeg ukiipi povivho sataf nuhijoow ru uvake jel re.",
  "&QfhpTX]AksMv#x2!ZkZ0AOvv7",
  "hup",
  "aL",
  "WfZD6d$$zcBQgGQXcyIlO[v!",
  "scc8wANjyM94up)UHg!doNEOZV"
]);
```
