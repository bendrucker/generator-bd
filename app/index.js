'use strict'

const yeoman = require('yeoman-generator')
const paramCase = require('param-case')
const camelCase = require('camel-case')
const normalizeUrl = require('normalize-url')
const humanizeUrl = require('humanize-url')

module.exports = yeoman.generators.Base.extend({
  init: function () {
    const cb = this.async()

    this.prompt([
      {
        name: 'moduleName',
        message: 'What do you want to name your module?',
        default: this.appname.replace(/\s/g, '-'),
        filter: paramCase
      },
      {
        name: 'description',
        message: 'What\'s the module\'s description?'
      },
      {
        name: 'keywords',
        message: 'What are the keywords?',
        default: [],
        filter: function (value) {
          return (value || '').split(',').map(function (keyword) {
            return keyword.trim()
          })
        }
      },
      {
        name: 'githubUsername',
        message: 'What is your GitHub username?',
        store: true,
        validate: function (val) {
          return val.length > 0 ? true : 'You have to provide a username'
        }
      },
      {
        name: 'website',
        message: 'What is the URL of your website?',
        store: true,
        validate: function (val) {
          return val.length > 0 ? true : 'You have to provide a website URL'
        },
        filter: normalizeUrl
      }
    ], function (props) {
      this.moduleName = props.moduleName
      this.description = props.description
      this.keywordString = props.keywords.map(function (keyword) {
        return '"' + keyword + '"'
      })
      .join(',\n    ')
      this.camelModuleName = camelCase(props.moduleName)
      this.githubUsername = props.githubUsername
      this.name = this.user.git.name()
      this.email = this.user.git.email()
      this.website = props.website
      this.humanizedWebsite = humanizeUrl(this.website)

      this.template('editorconfig', '.editorconfig')
      this.template('gitattributes', '.gitattributes')
      this.template('gitignore', '.gitignore')
      this.template('travis.yml', '.travis.yml')
      this.template('src.js', 'src/index.js')
      this.template('license')
      this.template('_package.json', 'package.json')
      this.template('readme.md')
      this.template('test.js', 'test/index.js')

      this.npmInstall()

      cb()
    }.bind(this))
  }
})
