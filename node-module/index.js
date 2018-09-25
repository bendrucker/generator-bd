'use strict'

const Generator = require('yeoman-generator')
const merge = require('deep-extend')
const sort = require('sort-package-json')

module.exports = class NodeModule extends Generator {
  configuring () {
    this._package()
  }

  installing () {
    this.npmInstall(['standard', 'tape'], {
      'save-dev': true
    })
  }
  
  _package () {
    const {name, description, github, me} = this.options
    
    this.fs.writeJSON('package.json', sort({
      name,
      main: 'index.js',
      version: '0.0.0',
      description: this.options.description,
      license: 'MIT',
      repository: `${github.username}/${name}`,
      author: me,
      files: ['*.js']
    }))
  }
}
