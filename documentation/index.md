---
template: default.ejs
theme: dark
title: chance-generators
repository: https://github.com/sunesimonsen/chance-generators
---

# chance-generators

This module is thin wrapper around the excellent [chance](http://chancejs.com/)
library for doing composable generators.

## Installation

```
npm install --save chance-generators
```

## Usage

```js#evaluate:false
const { email, guid, name, pickone, shape } = require("chance-generators")
```

```js
const users = shape({
  id: guid,
  name,
  email: email({ domain: pickone(["example.com", "mail.me"]) })
});

expect(users.take(3), "to equal", [
  {
    id: "70c6744c-cba2-5f4c-8a06-0dac0c4e43a1",
    name: "Terry Hopkins",
    email: "celel@mail.me"
  },
  {
    id: "74d13042-845c-5ba0-971e-bd5d25b428ac",
    name: "Virginia Hunter",
    email: "kimri@example.com"
  },
  {
    id: "a0872019-469f-54d3-9816-384f0e43ece7",
    name: "Edward Wilson",
    email: "mahbu@mail.me"
  }
]);
```

All generators supports [mapping](api/generator/#map-mapper-) over the generated
values.

You have more than hundred generators available:

[address](./api/chance/)
[age](./api/chance/)
[altitude](./api/chance/)
[ampm](./api/chance/)
[android_id](./api/chance/)
[animal](./api/chance/)
[apple_token](./api/chance/)
[areacode](./api/chance/)
[arraySplicer](./api/arraySplicer/)
[array](./api/array/)
[avatar](./api/chance/)
[bb_pin](./api/chance/)
[birthday](./api/chance/)
[bool](./api/bool/)
[cc](./api/chance/)
[cc_type](./api/chance/)
[cf](./api/chance/)
[character](./api/character/)
[city](./api/chance/)
[coin](./api/chance/)
[color](./api/chance/)
[company](./api/chance/)
[constant](./api/constant/)
[coordinates](./api/chance/)
[country](./api/chance/)
[cpf](./api/chance/)
[currency](./api/chance/)
[currency_pair](./api/chance/)
[date](./api/chance/)
[depth](./api/chance/)
[dice](./api/chance/)
[dollar](./api/chance/)
[domain](./api/chance/)
[email](./api/chance/)
[euro](./api/chance/)
[exp](./api/chance/)
[exp_month](./api/chance/)
[exp_year](./api/chance/)
[fbid](./api/chance/)
[first](./api/chance/)
[floating](./api/floating/)
[gender](./api/chance/)
[geohash](./api/chance/)
[google_analytics](./api/chance/)
[guid](./api/chance/)
[hammertime](./api/chance/)
[hash](./api/chance/)
[hashtag](./api/chance/)
[hour](./api/chance/)
[integer](./api/integer/)
[ip](./api/chance/)
[ipv6](./api/chance/)
[klout](./api/chance/)
[last](./api/chance/)
[latitude](./api/chance/)
[letter](./api/chance/)
[longitude](./api/chance/)
[magicFloating](./api/magicFloating/)
[magicInteger](./api/magicInteger/)
[magicString](./api/magicString/)
[millisecond](./api/chance/)
[minute](./api/chance/)
[month](./api/chance/)
[name](./api/chance/)
[natural](./api/natural/)
[number](./api/number/)
[paragraph](./api/chance/)
[phone](./api/chance/)
[pickone](./api/pickone/)
[pickset](./api/pickset/)
[postal](./api/chance/)
[prefix](./api/chance/)
[prime](./api/chance/)
[profession](./api/chance/)
[province](./api/chance/)
[radio](./api/chance/)
[rpg](./api/chance/)
[second](./api/chance/)
[sentence](./api/chance/)
[sequence](./api/sequence/)
[shape](./api/shape/)
[shuffle](./api/shuffle/)
[ssn](./api/chance/)
[state](./api/chance/)
[street](./api/chance/)
[stringSplicer](./api/stringSplicer/)
[string](./api/string/)
[suffix](./api/chance/)
[syllable](./api/chance/)
[text](./api/text/)
[timestamp](./api/chance/)
[timezone](./api/chance/)
[tld](./api/chance/)
[tv](./api/chance/)
[twitter](./api/chance/)
[unique](./api/unique/)
[url](./api/chance/)
[weekday](./api/chance/)
[weighted](./api/weighted/)
[word](./api/chance/)
[wp7_anid](./api/chance/)
[wp8_anid2](./api/chance/)
[year](./api/chance/)
[zip](./api/chance/)

All important generators supports [shrinking](./api/iterator/#expand-value-) and
[expansion](./api/iterator/#shrink-value-).

## MIT License

Copyright (c) 2016 Sune Simonsen <mailto:sune@we-knowhow.dk>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
