'use strict'

const path = require('path')

const Generator = require('yeoman-generator')
const camel = require('camel-case')
const dedent = require('endent')
const sortPackage = require('sort-package-json')
const octokit = require('@octokit/rest')()

module.exports = class NodeModule extends Generator {
  constructor (args, options) {
    super(args, options)

    this.argument('name', {
      type: String,
      default: path.basename(process.cwd())
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
    const { description } = this.fs.readJSON('./package.json', {})

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
    this._sortPackage()
  }

  installing () {
    this.npmInstall(['standard', 'blue-tape'], {
      'save-dev': true
    })
  }

  _index () {
    const file = 'index.js'
    const pkg = this._readPackage()

    if (pkg.main && path.basename(pkg.main) !== file) return
    if (this.fs.exists(file)) return

    const main = camel(this.options.name)

    const declaration = [
      this.options.async && 'async',
      'function',
      main,
      '()'
    ]
      .filter(Boolean)
      .join(' ')

    this.fs.write(file, dedent`
      'use strict'

      module.exports = ${main}

      ${declaration} {

      }`)
  }

  _test () {
    const file = 'test.js'
    const { scripts = {} } = this._readPackage()

    if (!(scripts.test && hasPathArg(scripts.test, file))) return
    if (this.fs.exists(file)) return

    const { name } = this.options
    const main = camel(name)

    this.fs.write(file, dedent`
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
    const existing = this._readPackage()
    const defaults = {
      main: 'index.js',
      version: '0.0.0',
      license: 'MIT',
      files: ['*.js'],
      scripts: {
        test: 'standard && tape test.js'
      }
    }

    this.fs.writeJSON('package.json', {
      ...defaults,
      ...existing,
      ...defined({
        name,
        description,
        repository: `${github.login}/${name}`,
        author: {
          name: github.name,
          email: github.email,
          url: github.blog
        }
      })
    })
  }

  _readPackage () {
    return this.fs.readJSON('package.json', {})
  }

  _sortPackage () {
    this.fs.writeJSON('package.json', sortPackage(this._readPackage()))
  }

  _npmrc () {
    this.fs.write('.npmrc', 'package-lock=false')
  }
}

function defined (object) {
  return Object.entries(object)
    .filter(([key, value]) => typeof value !== 'undefined')
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {})
}

function hasPathArg (command, filePath) {
  debugger
  return command
    .split(' ')
    .map(arg => path.normalize(arg))
    .some(arg => arg === filePath)
}