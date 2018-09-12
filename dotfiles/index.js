'use strict'

const Generator = require('yeoman-generator')
const fs = require('fs').promises

module.exports = class Dotfiles extends Generator {
  async configuring () {
    const templates = await fs.readdir(this.sourceRoot())
    
    return Promise.all(templates.map(template => {
      this.fs.copy(
        this.templatePath(template),
        this.destinationPath(template)
      )
    }))
  }
}