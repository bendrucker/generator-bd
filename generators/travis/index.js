'use strict'

const Generator = require('yeoman-generator')
const array = require('cast-array')
const yaml = require('js-yaml')
const assert = require('assert')

module.exports = class Travis extends Generator {
  static badge ({ user, name }) {
    assert(user, 'user is required')
    assert(name, 'repo name is required')

    const url = `https://travis-ci.org/${user}/${name}`
    return `[![Build Status](${url}.svg?branch=master)](${url})`
  }

  constructor (args, options) {
    super(args, options)

    this.option('language', {
      type: String,
      required: true
    })

    this.option('versions', {
      type: (versions) => array(versions).map(String),
      required: true
    })
  }

  configuring () {
    const { language, versions } = this.options

    this.fs.write('.travis.yml', yaml.safeDump({
      language,
      [language]: versions
    }))
  }
}
