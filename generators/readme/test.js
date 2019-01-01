'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const { existsSync, promises: { readFile } } = require('fs')
const dedent = require('dedent')

test('readme', async function (t) {
  await yeoman.run(__dirname).withOptions({
    name: 'my-pkg',
    user: 'fred',
    description: 'A great package',
    language: 'js',
    install: 'npm install --save my-pkg',
    usage: 'const myPkg = require(\'my-pkg\')',
    api: dedent`
      # myPkg(foo) -> bar

      Turns foo into bar.

      ## foo

      An arg.
    `,
    author: 'Fred',
    homepage: 'http://fred.web'
  })

  t.ok(existsSync('./readme.md'), 'exists')

  const readme = await readFile('./readme.md', 'utf8')

  t.equal(readme, dedent`
    # my-pkg [![Build Status](https://travis-ci.org/fred/my-pkg.svg?branch=master)](https://travis-ci.org/fred/my-pkg)

    > A great package

    ## Installing

    ${'```sh'}
    npm install --save my-pkg
    ${'```'}

    ## Usage

    ${'```js'}
    const myPkg = require('my-pkg')
    ${'```'}

    ## API

    #### myPkg(foo) -> bar

    Turns foo into bar.

    ##### foo

    An arg.

    ## License

    MIT © [Fred](http://fred.web)
  `)
})
