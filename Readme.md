# chance-generators

This module is thin wrapper around the excellent [chance](http://chancejs.com/)
library for doing composable generators.

## Installation

```
npm install --save chance-generators
```

## Usage

```js
var g = require('./lib/chance-generators')(42)
var emails = g.email({ domain: g.pick(['example.com', 'mail.me']) })
expect(emails(), 'to equal', 'hiapli@example.com')
expect(emails(), 'to equal', 'cuval@mail.me')
expect(emails(), 'to equal', 'ozi@example.com')
```

When you call any of the functions documented on
[www.chancejs.com](http://www.chancejs.com/)
with one of more arguments a new generator function is returned instead of just
generating the result:

```js
var positiveIntegers = g.integer({ min: 0 })
expect(positiveIntegers, 'to be a function')
expect(positiveIntegers(), 'to be a number')
```

If you call a generator without any arguments it will produce a new value.

```js
expect(g.integer(), 'to be a number')
```

Any generators passed as parameters to other generators will be called to
produce a random value:

```js
var g = require('./lib/chance-generators')(42)
var smallStrings = g.string({ length: g.integer({ min: 3, max: 9 }) })
expect(smallStrings(), 'to equal', '(n25S')
expect(smallStrings(), 'to equal', 'GlheH#y')
expect(smallStrings(), 'to equal', '0Wbe)19')
```

The only exception to this rule is the `n` and `unique` functions, they don't
dereference the generator given as the first argument:

```js
var g = require('./lib/chance-generators')(42)
var stringArrays = g.n(g.string, g.integer({ min: 0, max: 10 }))

expect(stringArrays(), 'to equal', [
  '(n25SSlGlheH#ySk0', 'be)19*pan]nTwTM', 'FbvMT', 'kdv[BrHg6To'
])

expect(stringArrays(), 'to equal', [
  '[RId@SYmHea(*', 'P7CwbhrYrGYjTK9cm^Ct', 'X3xFMpO', 'nc)!5H*D%&S1&y'
])

expect(stringArrays(), 'to equal', [])
```

## Additional generators

### identity

Always generates the given value.

```js
var g = require('./lib/chance-generators')(42)

expect(g.identity(42), 'to equal', 42)
```

### shape

Generates values of the given shape, if the structure contains generators they
will be unwrapped.

```js
expect(chance.shape({
  constant: 42,
  point: {
    x: chance.integer,
    y: chance.integer
  }
}), 'when called', 'to satisfy', {
  constant: 42,
  point: {
    x: expect.it('to be a number'),
    y: expect.it('to be a number')
  }
})
```

## MIT License

Copyright (c) 2016 Sune Simonsen <sune@we-knowhow.dk>

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
