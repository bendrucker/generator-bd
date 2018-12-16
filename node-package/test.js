'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const path = require('path')
const { existsSync, promises: { readFile } } = require('fs')
const { types: { isAsyncFunction } } = require('util')
const dedent = require('endent')
const execa = require('execa')
const nock = require('nock')

const options = {
  name: 'my-pkg'
}

const prompts = {
  description: 'A great package'
}

process.env.GITHUB_TOKEN = 'gh-token'
nock('https://api.github.com', {
  reqheaders: {
    authorization: 'token gh-token'
  }
})
  .get('/user')
  .reply(200, {
    login: 'bendrucker',
    name: 'Ben Drucker',
    email: 'bvdrucker@gmail.com',
    blog: 'http://bendrucker.me'
  })
  .persist()

test('package', async function (t) {
  await yeoman.run(__dirname)
    .withOptions(options)
    .withPrompts(prompts)

  t.ok(existsSync('./package.json'), 'exists')
  t.deepEqual(JSON.parse(await readFile('./package.json')), {
    name: 'my-pkg',
    main: 'index.js',
    version: '0.0.0',
    description: 'A great package',
    license: 'MIT',
    repository: 'bendrucker/my-pkg',
    author: {
      name: 'Ben Drucker',
      email: 'bvdrucker@gmail.com',
      url: 'http://bendrucker.me'
    },
    files: ['*.js']
  }, 'package written')
})

test('index', async function (t) {
  t.test('sync', async function (t) {
    await yeoman.run(__dirname)
      .withOptions(options)
      .withPrompts(prompts)

    t.ok(existsSync('./index.js'), 'exists')
    const code = await readFile('./index.js', 'utf8')
    const lines = code.split('\n\n')

    t.deepEqual(lines, [
      `'use strict'`,
      'module.exports = myPkg',
      'function myPkg () {',
      '}'
    ], 'renders code')

    const fn = require(path.resolve(process.cwd(), 'index.js'))
    t.equal(typeof fn, 'function', 'is function')
    t.equal(fn.name, 'myPkg', 'named myPkg')
    t.notOk(isAsyncFunction(fn), 'is sync')
  })

  t.test('async', async function (t) {
    await yeoman.run(__dirname)
      .withOptions(Object.assign({ async: true }, options))
      .withPrompts(prompts)

    t.ok(existsSync('./index.js'), 'exists')
    const code = await readFile('./index.js', 'utf8')
    const lines = code.split('\n\n')

    t.deepEqual(lines, [
      `'use strict'`,
      'module.exports = myPkg',
      'async function myPkg () {',
      '}'
    ], 'renders code')

    const fn = require(path.resolve(process.cwd(), 'index.js'))
    t.equal(typeof fn, 'function', 'is function')
    t.equal(fn.name, 'myPkg', 'named myPkg')
    t.ok(isAsyncFunction(fn), 'is async')
  })
})

test('test', async function (t) {
  await yeoman.run(__dirname)
    .withOptions(options)
    .withPrompts(prompts)

  t.ok(existsSync('./test.js'), 'exists')
  const code = await readFile('./test.js', 'utf8')

  t.equal(code, dedent`
    'use strict'

    const test = require('blue-tape')
    const myPkg = require('./')

    test('my-pkg', t => {
      t.end()
    })
  `, 'renders code')

  t.test('running', async function (t) {
    await yeoman.run(__dirname)
      .withOptions(Object.assign({ skipInstall: false }, options))
      .withPrompts(prompts)

    const output = await execa.stdout('node', ['./test.js'])
    t.equal(output, dedent`
      TAP version 13
      # my-pkg
  
      1..0
      # tests 0
      # pass  0
      
      # ok
    ` + '\n', 'prints passing TAP')
  })
})
