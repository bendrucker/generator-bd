'use strict'

const Generator = require('yeoman-generator')
const {promises: {readdir}} = require('fs')
const array = require('cast-array')
const yaml = require('js-yaml')

module.exports = class Travis extends Generator {
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
    const {language, versions} = this.options

    this.fs.write('.travis.yml', yaml.safeDump({
      language,
      [language]: versions
    }))
  }
}