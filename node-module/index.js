'use strict'

const Generator = require('yeoman-generator')
const sort = require('sort-package-json')
const camel = require('camel-case')
const dedent = require('endent')

module.exports = class NodeModule extends Generator {
  initializing () {
    this.composeWith(require.resolve('../travis'), {
      language: 'node_js',
      versions: ['lts/*', 'node']
    })

    this.composeWith(require.resolve('../dotfiles'))
  }

  configuring () {
    this._package()
  }

  writing () {
    this._index()
    this._test()
  }

  installing () {
    this.npmInstall(['standard', 'blue-tape'], {
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

  _test () {
    const { name } = this.options
    const main = camel(name)

    this.fs.write('test.js', dedent`
      'use strict'

      const test = require('blue-tape')
      const ${main} = require('./')

      test('${name}', t => {
        t.end()
      })
    `)
  }

  _package () {
    const { name, description, github, me } = this.options

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
