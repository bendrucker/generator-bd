'use strict'

const { basename } = require('path')

const Generator = require('yeoman-generator')
const sort = require('sort-package-json')
const camel = require('camel-case')
const dedent = require('endent')
const octokit = require('@octokit/rest')()

module.exports = class NodeModule extends Generator {
  async initializing () {
    this.composeWith(require.resolve('../travis'), {
      language: 'node_js',
      versions: ['lts/*', 'node']
    })

    this.composeWith(require.resolve('../dotfiles'))

    this.package = {
      name: this.options.name || basename(process.cwd())
    }

    this.github = await this._githubUser()
  }

  async _githubUser () {
    octokit.authenticate({
      type: 'token',
      token: process.env.GITHUB_TOKEN
    })

    return (await octokit.users.getAuthenticated()).data
  }

  async prompting () {
    Object.assign(this.package, await this.prompt([
      {
        name: 'description',
        message: 'Enter a description for the package',
        validate: (description) => description.length
      }
    ]))
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
    const { github, package: pkg } = this

    this.fs.writeJSON('package.json', sort({
      name: pkg.name,
      main: 'index.js',
      version: '0.0.0',
      description: pkg.description,
      license: 'MIT',
      repository: `${github.login}/${pkg.name}`,
      author: {
        name: github.name,
        email: github.email,
        url: github.blog
      },
      files: ['*.js']
    }))
  }
}
