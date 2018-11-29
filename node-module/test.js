'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const path = require('path')
const {existsSync, promises: {readFile}} = require('fs')
const Module = require('module')
const {types: {isAsyncFunction}} = require('util')

const options = {
  name: 'my-pkg',
  description: 'A great package',
  github: {username: 'bendrucker'},
  me: {
    name: 'Ben Drucker',
    email: 'bvdrucker@gmail.com',
    website: 'http://bendrucker.me'
  }
}

test('package', async function (t) {
  await yeoman.run(__dirname).withOptions(options)

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
      website: 'http://bendrucker.me'
    },
    files: ['*.js']
  }, 'package written')
})

test('index', async function (t) {
  t.test('sync', async function (t) {
    await yeoman.run(__dirname).withOptions(options)

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
    await yeoman.run(__dirname).withOptions(Object.assign({async: true}, options))

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
