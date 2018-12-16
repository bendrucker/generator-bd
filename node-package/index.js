'use strict'

const { basename } = require('path')

const Generator = require('yeoman-generator')
const camel = require('camel-case')
const dedent = require('endent')
const octokit = require('@octokit/rest')()

module.exports = class NodeModule extends Generator {
  constructor (args, options) {
    super(args, options)

    this.argument('name', {
      type: String,
      default: basename(process.cwd())
    })
  }

  async initializing () {
    this.composeWith(require.resolve('../travis'), {
      language: 'node_js',
      versions: ['lts/*', 'node']
    })

    this.composeWith(require.resolve('../dotfiles'))

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
    const { description } = this.fs.readJSON('package.json', {})

    Object.assign(this.options, await this.prompt([
      {
        name: 'description',
        message: 'Enter a description for the package',
        validate: (description) => Boolean(description.length),
        when: () => !description
      }
    ]))
  }

  configuring () {
    this._package()
    this._npmrc()
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
    const { github, options: { name, description } } = this
    const existing = this.fs.readJSON('package.json')
    const defaults = {
      main: 'index.js',
      version: '0.0.0',
      description,
      license: 'MIT',
      files: ['*.js']
    }

    this.fs.writeJSON('package.json', Object.assign({}, defaults, existing, {
      name,
      description,
      repository: `${github.login}/${name}`,
      author: {
        name: github.name,
        email: github.email,
        url: github.blog
      }
    }))
  }

  _npmrc () {
    this.fs.write('.npmrc', 'package-lock=false')
  }
}
