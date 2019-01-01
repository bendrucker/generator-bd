'use strict'

const Generator = require('yeoman-generator')
const mit = require('mit')

module.exports = class Docs extends Generator {
  constructor (args, options) {
    super(args, options)

    this.option('name', { type: String, required: true })
    this.option('email', { type: String, required: true })
    this.option('website', { type: String, required: true })
  }
  
  async configuring () {
    const { options: me } = this
    this.fs.write('./license', mit(
      `${me.name} <${me.email}> (${me.website})`
    ))
  }
}
