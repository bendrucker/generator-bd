'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const {existsSync, promises: {readFile}} = require('fs')
const editorconfig = require('editorconfig')
const execa = require('execa')

test('package', async function (t) {
  await yeoman.run(__dirname).withOptions({
    name: 'my-pkg',
    description: 'A great package',
    github: {username: 'bendrucker'},
    me: {
      name: 'Ben Drucker',
      email: 'bvdrucker@gmail.com',
      website: 'http://bendrucker.me'
    }
  })

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