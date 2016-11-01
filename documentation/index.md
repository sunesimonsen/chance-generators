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
const Generators = require('chance-generators')
```

```js
let seed = 42
let { email, pickone } = new Generators(seed)

let emails = email({ domain: pickone(['example.com', 'mail.me']) })

expect(emails(), 'to equal', 'gotsalda@example.com')
expect(emails(), 'to equal', 'satacwuw@example.com')
expect(emails(), 'to equal', 'uf@example.com')
```

When you call any of the functions documented on
[www.chancejs.com](http://www.chancejs.com/)
with one of more arguments a new generator function is returned instead of just
generating the result:

```js
let { integer } = new Generators(42)

let positiveIntegers = integer({ min: 1 })

expect(positiveIntegers, 'to be a function')
expect(positiveIntegers(), 'to be positive')
```

If you call a generator without any arguments it will produce a new value.

```js
let { integer } = new Generators(42)

expect(integer(), 'to be a number')
```

Any generators passed as parameters to other generators will be called to
produce a random value:

```js
let { integer, string } = new Generators(42)

let smallStrings = string({ length: integer({ min: 3, max: 9 }) })

expect(smallStrings(), 'to equal', '(n25S')
expect(smallStrings(), 'to equal', 'GlheH#y')
expect(smallStrings(), 'to equal', '0Wbe)19')
```

The only exception to this rule is the `array`, `n` and `unique` functions, they
don't dereference the generator given as the first argument:

```js
let { n, string, integer } = new Generators(42)

let stringArrays = n(string, integer({ min: 0, max: 10 }))

expect(stringArrays(), 'to equal', [
  '(n25SSlGlheH#ySk0', 'be)19*pan]nTwTM', 'FbvMT', 'kdv[BrHg6To'
])

expect(stringArrays(), 'to equal', [
  '[RId@SYmHea(*', 'P7CwbhrYrGYjTK9cm^Ct', 'X3xFMpO', 'nc)!5H*D%&S1&y'
])

expect(stringArrays(), 'to equal', [])
```

## Additional generators

### constant

Always generates the given value.

```js
let { constant } = new Generators(42)

let constantNumberGenerator = constant(42)

expect(constantNumberGenerator, 'when called', 'to equal', 42)
expect(constantNumberGenerator, 'when called', 'to equal', 42)
```

### array

Same as `n` but defaults to generate arrays between 0-50 items when no count is
supplied.

```js
let { array, natural } = new Generators(42)

expect(
  array(natural({ max: 10 })),
  'when called',
  'to equal', [
    8, 10, 2, 8, 8, 6, 6, 1, 4,
    1, 1, 0, 5, 9, 3, 6, 1, 7, 7
  ]
)
```

### shape

Generates values of the given shape, if the structure contains generators they
will be unwrapped.

```js
let { integer, shape } = new Generators(42)

expect(shape({
  constant: 42,
  point: {
    x: integer,
    y: integer
  }
}), 'when called', 'to satisfy', {
  constant: 42,
  point: {
    x: expect.it('to be a number'),
    y: expect.it('to be a number')
  }
})
```

### sequence

Generates sequences of values by invoking a function, if the returned value
contains generators they will be unwrapped. You will have a context that you can
store information which will be available for later invocations. In addition the
second parameter for the callback is the previous generated value.

The second parameter is specifying the length of the sequences that should be
generated. The length defaults to between 0-50 items.

Here is an example showing a sequence generator that will generate shorter and
shorter random strings:

```js
let { natural, sequence, string } = new Generators(42)

const sequenceGenerator = sequence((context, previous) => {
  const length = previous === undefined
    ? 10
    : Math.max(0, previous.length - 1)

  return string({ length })
}, natural({ max: 10 }))

expect(sequenceGenerator(), 'to equal',
  [ '(n25SSlGlh', 'H#ySk0Wbe', '19*pan]n', 'wTMaFbv' ]
)

expect(sequenceGenerator(), 'to equal',
  [ 'Dkdv[B', 'Hg6To', 'M[RI', '@SY', 'He' ]
)

expect(sequenceGenerator(), 'to equal', [])

expect(sequenceGenerator(), 'to equal',
  [ ')', '', '', '', '', '', '', '', '', '' ]
)
```

## Mapping generators

All generators have a `map` method that can be used to map the stream of
generated values into something else. A mapped generator supports shrinking by
shrinking the original generator.

The first parameter to the mapper function is the value and the second parameter
is the generators instance.

```js
let { email, name, shape } = new Generators(42)

const nameAndEmail = shape({
  email,
  name
}).map(({ email, name }) => `${name} ${email}`)

expect(nameAndEmail, 'when called', 'to equal', 'Manuel Lyons ofosid@daej.co.uk')
expect(nameAndEmail, 'when called', 'to equal', 'Nathaniel Parks ur@gafgohrak.com')
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
