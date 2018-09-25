'use strict'

const Generator = require('yeoman-generator')
const merge = require('deep-extend')
const sort = require('sort-package-json')
const camel = require('camel-case')
const dedent = require('endent')

module.exports = class NodeModule extends Generator {
  configuring () {
    this._package()
  }

  writing () {
    this._index()
  }

  installing () {
    this.npmInstall(['standard', 'tape'], {
      'save-dev': true
    })
  }

  _index () {
    const main = camel(this.options.name)

    const declaration = [
      this.options.async && 'async',
      'function',
      main,
      '()'
    ]
    .filter(Boolean)
    .join(' ')

    this.fs.write('index.js', dedent`
      'use strict'

      module.exports = ${main}

      ${declaration} {

      }`)
  }
  
  _package () {
    const {name, description, github, me} = this.options
    
    this.fs.writeJSON('package.json', sort({
      name,
      main: 'index.js',
      version: '0.0.0',
      description,
      license: 'MIT',
      repository: `${github.username}/${name}`,
      author: me,
      files: ['*.js']
    }))
  }
}
