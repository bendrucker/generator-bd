'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const {existsSync} = require('fs')
const editorconfig = require('editorconfig')

test('editorconfig', async function (t) {
  await yeoman.run(__dirname)
  t.ok(existsSync('./.editorconfig'), 'exists')
  t.equal(typeof await editorconfig.parse('./index.js'), 'object', 'parseable')
})