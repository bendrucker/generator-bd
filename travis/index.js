'use strict'

const Generator = require('yeoman-generator')
const {promises: {readdir}} = require('fs')
const array = require('cast-array')

module.exports = class Travis extends Generator {
  constructor (args, options) {
    super(args, options)

    this.option('language', {
      type: String,
      required: true
    })

    this.option('versions', {
      type: array,
      required: true
    })
  }
  configuring () {
    this.fs.copyTpl(
      this.templatePath('.travis.yml.ejs'),
      this.destinationPath('.travis.yml'),
      this.options
    )
  }
}