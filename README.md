# react-tagsinput

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependency Status][dep-image]][dep-url]
[![Size][size-image]][size-url]
[![Download Count][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Highly customizable [React](http://facebook.github.io/react/index.html) component for inputing tags.

## Table of Contents

  * [react-tagsinput](#react-tagsinput)
    * [Demo](#demo)
    * [Install](#install)
    * [Example](#example)
    * [FAQ](#faq)
      * [How do I make the input dynamically grow in size?](#how-do-i-make-the-input-dynamically-grow-in-size)
      * [How do I add auto suggestion?](#how-do-i-add-auto-suggestion)
    * [Component Interface](#component-interface)
      * [Props](#props)
        * [value (required)](#value-required)
        * [onChange (required)](#onchange-required)
        * [addKeys](#addkeys)
        * [currentValue](#currentvalue)
        * [onlyUnique](#onlyunique)
        * [validationRegex](#validationregex)
        * [disabled](#disabled)
        * [maxTags](#maxtags)
        * [addOnBlur](#addonblur)
        * [addOnPaste](#addonpaste)
        * [pasteSplit](#pastesplit)
        * [removeKeys](#removekeys)
        * [tagProps](#tagprops)
        * [inputProps](#inputprops)
        * [renderTag](#rendertag)
        * [renderInput](#renderinput)
        * [renderLayout](#renderlayout)
      * [Methods](#methods)
        * [focus()](#focus)
        * [blur()](#blur)
        * [accept()](#accept)
    * [Styling](#styling)
    * [Contributors](#contributors)
    * [Changelog](#changelog)
    * [License](#license)

## Demo

[![Demo](./example/demo.gif)][demo-url]

### [Interactive Demo](https://olahol.github.io/react-tagsinput)

## Install

```bash
npm install react-tagsinput --save
```

```bash
bower install react-tagsinput --save
```

## Example

```javascript
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.

class Example extends React.Component {
  constructor() {
    super()
    this.state = {tags: []}
  }

  handleChange(tags) {
    this.setState({tags})
  }

  render() {
    return <TagsInput value={this.state.tags} onChange={::this.handleChange} />
  }
}
```
## FAQ

##### How do I make the input dynamically grow in size?

Install [`react-input-autosize`](https://github.com/JedWatson/react-input-autosize) and change the `renderInput` prop to:

```js
function autosizingRenderInput (props) {
  let {onChange, value, ...other} = props
  return (
    <AutosizeInput type='text' onChange={onChange} value={value} {...other} />
  )
}
```

##### How do I add auto suggestion?

Use [`react-autosuggest`](https://github.com/moroshko/react-autosuggest) and change the `renderInput` prop to
something like:

```js
function autosuggestRenderInput (props) {
  return (
    <Autosuggest
      ref={props.ref}
      suggestions={suggestions}
      shouldRenderSuggestions={(value) => value && value.trim().length > 0}
      getSuggestionValue={(suggestion) => suggestion.name}
      renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
      inputProps={props}
      onSuggestionSelected={(e, {suggestion}) => {
        this.refs.tagsinput.addTag(suggestion.name)
      }}
    />
  )
}
```

A working example can be found in [`example/index.js`](https://github.com/olahol/react-tagsinput/blob/master/example/index.js#L137).

## Component Interface

### Props

##### value (required)

An array of tags.

##### onChange (required)

Callback when tags change, gets three arguments `tags` which is the new
tag array, `changed` which is an array of the tags that have changed and
`changedIndexes` which is an array of the indexes that have changed.

##### addKeys

An array of key codes that add a tag, default is `[9, 13]` (Tab and Enter).

##### currentValue

A string to set a value on the input.

##### onlyUnique

Allow only unique tags, default is `false`.

##### validationRegex

Allow only tags that pass this regex to be added. Default is `/.*/`.

##### disabled

Passes the disabled prop to `renderInput` and `renderTag`, by default this
will "disable" the component.

##### maxTags

Allow limit number of tags, default is `-1` for infinite.

##### addOnBlur

Add a tag if input blurs. Default false.

##### addOnPaste

Add a tags if HTML5 paste on input. Default false.

##### pasteSplit

Function that splits pasted text. Default is:

```javascript
function defaultPasteSplit (data) {
  return data.split(' ').map(d => d.trim())
}
```

##### removeKeys

An array of key codes that remove a tag, default is `[8]` (Backspace).


##### className

Specify the wrapper className. Default is `react-tagsinput`.


##### focusedClassName

Specify the class to add to the wrapper when the component is focused. Default is `react-tagsinput--focused`.


##### tagProps

Props passed down to every tag component. Defualt is: `{className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove'}`.

##### inputProps

Props passed down to input. Default is:

```javascript
{
  className: 'react-tagsinput-input',
  placeholder: 'Add a tag'
}
```

##### tagDisplayProp

The tags' property to be used when displaying/adding one. Default is: `null` which causes the tags to be an array of strings.

##### renderTag

Render function for every tag. Default is:

```javascript
function defaultRenderTag (props) {
  let {tag, key, onRemove, getTagDisplayValue, ...other} = props
  return (
    <span key={key} {...other}>
      {getTagDisplayValue(tag)}
      <a onClick={(e) => onRemove(key)} />
    </span>
  )
}
```

##### renderInput

Render function for input. Default is:

```javascript
function defaultRenderInput (props) {
  let {onChange, value, addTag, ...other} = props
  return (
    <input type='text' onChange={onChange} value={value} {...other} />
  )
}
```

*Note: renderInput also receives `addTag` as a prop.*

##### renderLayout

Renders the layout of the component. Takes `tagComponents` and `inputComponent` as args. Default is:

```javascript
function defaultRenderLayout (tagComponents, inputComponent) {
  return (
    <span>
      {tagComponents}
      {inputComponent}
    </span>
  )
}
```

### Methods

##### focus()

Focus on input element.

##### blur()

Blur input element.

##### accept()

Try to add whatever value is currently in input element.

##### addTag(tag)

Convenience method that adds a tag.

##### clearInput()

Clears the input value.

## Styling

Look at [react-tagsinput.css](./react-tagsinput.css) for a basic style.

## [Contributors](./CONTRIBUTORS.md)

## [Changelog](./CHANGELOG.md)

## [License](./LICENSE)

---

[MIT Licensed](https://tldrlegal.com/license/mit-license)


[npm-image]: https://img.shields.io/npm/v/react-tagsinput.svg?style=flat-square
[npm-url]: https://npmjs.org/package/react-tagsinput
[downloads-image]: http://img.shields.io/npm/dm/react-tagsinput.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/react-tagsinput
[travis-image]: https://img.shields.io/travis/olahol/react-tagsinput/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/olahol/react-tagsinput
[coverage-image]: https://img.shields.io/coveralls/olahol/react-tagsinput.svg?style=flat-square
[coverage-url]: https://coveralls.io/r/olahol/react-tagsinput
[demo-url]: https://github.com/olahol/react-tagsinput/blob/master/example/index.html
[dep-image]: https://david-dm.org/olahol/react-tagsinput/peer-status.svg?style=flat-square
[dep-url]: https://david-dm.org/olahol/react-tagsinput
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[size-image]: https://badge-size.herokuapp.com/olahol/react-tagsinput/master/src/index.js?style=flat-square
[size-url]: https://github.com/olahol/react-tagsinput/blob/master/src/index.js
