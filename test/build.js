const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

describe('Build exports', () => {
  const code = fs.readFileSync(path.join(__dirname, '../react-tagsinput.js'), 'utf8')

  function checkComponent (Component) {
    assert.equal(typeof Component, 'function')

    const html = renderToStaticMarkup(React.createElement(Component, {
      value: ['test'],
      onChange () {}
    }))

    assert.match(html, /react-tagsinput-tag/)
    assert.match(html, />test</)
  }

  it('exports the component directly in CommonJS', () => {
    const module = { exports: {} }
    vm.runInNewContext(code, { module, exports: module.exports, require })

    checkComponent(module.exports)
  })

  it('exposes ReactTagsInput.default in browsers', () => {
    const browser = { React }
    vm.runInNewContext(code, browser)

    checkComponent(browser.ReactTagsInput.default)
  })

  it('registers the ReactTagsInput AMD module', () => {
    const exports = {}
    const define = (name, dependencies, factory) => {
      assert.equal(name, 'ReactTagsInput')
      factory(...dependencies.map(name => name === 'exports' ? exports : require(name)))
    }
    define.amd = {}

    vm.runInNewContext(code, { define })
    checkComponent(exports.default)
  })
})
