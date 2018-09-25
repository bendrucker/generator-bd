'use strict'

const Generator = require('yeoman-generator')
const merge = require('deep-extend')
const sort = require('sort-package-json')

module.exports = class NodeModule extends Generator {
  configuring () {
    this._package()
  }
  
  _package () {
    const {name, description, github, me} = this.options

    const existing = this.fs.readJSON(this.destinationPath('package.json'))
    
    const result = merge(existing || {}, {
      name,
      main: 'index.js',
      version: '0.0.0',
      description: this.options.description,
      license: 'MIT',
      repository: `${github.username}/${name}`,
      author: me,
      files: ['*.js']
    })

    this.fs.writeJSON('package.json', sort(result))
  }
}
