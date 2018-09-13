'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const {promises: {readFile}} = require('fs')
const yaml = require('js-yaml')

test('travis', async function (t) {
  await yeoman.run(__dirname).withOptions({
    language: 'node_js',
    versions: ['8', '10']
  })

  t.deepEqual(yaml.safeLoad(await readFile('./.travis.yml')), {
    language: 'node_js',
    node_js: ['8', '10']
  })
})
