'use strict'

const test = require('blue-tape')
const yeoman = require('yeoman-test')
const { existsSync, promises: { readFile } } = require('fs')

test('license', async function (t) {
  await yeoman.run(__dirname).withOptions({
    name: 'Bob',
    email: 'bob@lob.law',
    website: 'bobloblaw.blog'
  })

  t.ok(existsSync('./license'), 'exists')

  const license = await readFile('./license')
  t.ok(license.includes('MIT'), 'is mit')
  t.ok(license.includes('Bob <bob@lob.law> (bobloblaw.blog)'), 'has name/email/website')
})
