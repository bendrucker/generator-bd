'use strict'

const yeoman = require('yeoman')
const paramCase = require('param-case')
const normalizeUrl = require('normalize-url')

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

    })
  }
})
