'use strict'

const Generator = require('yeoman-generator')
const { promises: { readdir } } = require('fs')

module.exports = class Dotfiles extends Generator {
  async configuring () {
    const templates = await readdir(this.sourceRoot())

    return Promise.all(templates.map(template => {
      this.fs.copy(
        this.templatePath(template),
        this.destinationPath('.' + template)
      )
    }))
  }
}
