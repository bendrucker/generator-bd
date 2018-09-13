'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const {existsSync} = require('fs')
const editorconfig = require('editorconfig')
const execa = require('execa')

test('editorconfig', async function (t) {
  await yeoman.run(__dirname)
  t.ok(existsSync('./.editorconfig'), 'exists')
  t.equal(typeof await editorconfig.parse('./index.js'), 'object', 'parseable')
})

test('gitattributes', async function (t) {
  await yeoman.run(__dirname)
  t.ok(existsSync('./.gitattributes'), 'exists')

  await execa('git', ['init'])
  t.equal(
    await execa.stdout('git', ['check-attr', '--all', 'index.js']),
    'index.js: text: auto',
    'sets text=auto for all files'
  )
})