'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const { existsSync } = require('fs')
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

test('gitignore', async function (t) {
  await yeoman.run(__dirname)
  t.ok(existsSync('./.gitignore'), 'exists')

  await execa('git', ['init'])
  t.equal(
    await execa.stdout('git', ['check-ignore', 'node_modules']),
    'node_modules',
    'ignores node_modules'
  )
  t.shouldFail(execa.stdout('git', ['check-ignore', 'index.js']))
})

test('npmrc', async function (t) {
  await yeoman.run(__dirname)
  t.ok(existsSync('./.npmrc'), 'exists')

  
  t.equal(
    await execa.stdout('npm', ['config', 'get', 'package-lock']),
    'false',
    'disables package-lock'
  )
})
