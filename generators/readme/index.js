'use strict'

const Generator = require('yeoman-generator')
const dedent = require('endent')
const remark = require('remark')
const behead = require('remark-behead')
const travis = require('../travis')

module.exports = class Readme extends Generator {
  constructor (args, options) {
    super(args, options)

    this.option('name', { type: String, required: true })
    this.option('description', { type: String, required: true })
    this.option('user', { type: String, required: true })

    this.option('language', { type: String, required: true })
    this.option('install', { type: String, required: true })
    this.option('usage', { type: String, required: true })
    this.option('api', { type: String, required: true })

    this.option('author', { type: String, required: true })
    this.option('homepage', { type: String, required: true })
  }

  writing () {
    this.fs.write('readme.md', this._render())
  }

  _render () {
    const {
      name,
      user,
      description,

      language,
      install,
      usage,
      api,

      author,
      homepage
    } = this.options

    return dedent`
      # ${name} ${travis.badge({ user, name })}

      > ${description}

      ## Installing

      ${block(install, 'sh')}

      ## Usage

      ${block(usage, language)}

      ## API

      ${reindent(api, 3)}

      ## License

      MIT © [${author}](${homepage})
    `
  }
}

function block (content, syntax) {
  return [
    '```' + syntax,
    content,
    '```'
  ].join('\n')
}

function reindent (content, depth) {
  return remark()
    .use(behead, { depth })
    .processSync(content)
    .toString()
    .trim()
}
