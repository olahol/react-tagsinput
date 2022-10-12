# react-tagsinput

[![NPM version][npm-image]][npm-url]
[![Size][size-image]][size-url]
[![Code coverage][codecov-image]][codecov-url]
[![Download count][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Highly customizable [React](http://facebook.github.io/react/index.html) component for inputing tags.

![Demo](./example/demo.gif)

## Example

```javascript
import React from 'react'
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'

class Example extends React.Component {
  constructor() {
    super()
    this.state = {tags: []}
  }

  handleChange = (tags) => {
    this.setState({tags})
  }

  render() {
    return <TagsInput value={this.state.tags} onChange={this.handleChange} />
  }
}
```

## Table of Contents

  * [Example](#example)
  * [Styling](#styling)
  * [Component Interface](#component-interface)
    * [Props](#props)
      * [value (required)](#value-required)
      * [onChange (required)](#onchange-required)
      * [onChangeInput](#onchangeinput)
      * [addKeys](#addkeys)
      * [currentValue](#currentvalue)
      * [inputValue](#inputvalue)
      * [onlyUnique](#onlyunique)
      * [validate](#validate)
      * [validationRegex](#validationregex)
      * [onValidationReject](#onvalidationreject)
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
      * [preventSubmit](#preventSubmit)
    * [Methods](#methods)
      * [focus()](#focus)
      * [blur()](#blur)
      * [accept()](#accept)
      * [addTag()](#addTag)
      * [clearInput()](#clearInput)
  * [Contributors](#contributors)
  * [Changelog](#changelog)
  * [License](#license)

## Styling

Look at [react-tagsinput.css](./react-tagsinput.css) for a basic style.

## Component Interface

### Props

##### value (required)

An array of tags.

##### onChange (required)

Callback when tags change, gets three arguments `tags` which is the new
tag array, `changed` which is an array of the tags that have changed and
`changedIndexes` which is an array of the indexes that have changed.

##### onChangeInput

Callback from the input box, gets one argument `value` which is the content of the input box.
(onChangeInput is only called if the input box is [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components), for this to happen both inputValue and onChangeInput need to be set)

##### addKeys

An array of [keys](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) or [key codes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which) that add a tag, default is `[9, 13]` (Tab and Enter).

##### currentValue

A string to set a value on the input.

##### inputValue

Similar to `currentValue` but needed for controlling the input box. (inputValue is only useful if you use it together with onChangeInput)

##### onlyUnique

Allow only unique tags, default is `false`.

##### validate

Allow only tags that pass this validation function. Gets one argument `tag` which is the tag to validate. Default is `() => true`.

##### validationRegex

Allow only tags that pass this regex to be added. Default is `/.*/`.

##### onValidationReject

Callback when tags are rejected through validationRegex, passing array of tags as the argument.

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

Props passed down to every tag component. Default is:
```javascript
{
  className: 'react-tagsinput-tag',
  classNameRemove: 'react-tagsinput-remove'
}
```

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
  let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
  return (
    <span key={key} {...other}>
      {getTagDisplayValue(tag)}
      {!disabled &&
        <a className={classNameRemove} onClick={(e) => onRemove(key)} />
      }
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

Renders the layout of the component. Takes `tagElements` and `inputElement` as args. Default is:

```javascript
function defaultRenderLayout (tagElements, inputElement) {
  return (
    <span>
      {tagElements}
      {inputElement}
    </span>
  )
}
```

##### preventSubmit

A `boolean` to prevent the default submit event when adding an 'empty' tag.
Default: `true`

Set to `false` if you want the default submit to fire when pressing enter again after adding a tag.

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

## Contributors

<a href="https://github.com/olahol/react-tagsinput/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=olahol/react-tagsinput" />
</a>


## [Changelog](./CHANGELOG.md)

## [License](./LICENSE)

---

[MIT Licensed](https://tldrlegal.com/license/mit-license)


[npm-image]: https://img.shields.io/npm/v/react-tagsinput.svg?style=flat-square
[npm-url]: https://npmjs.org/package/react-tagsinput
[downloads-image]: http://img.shields.io/npm/dm/react-tagsinput.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/react-tagsinput
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[size-image]: https://badge-size.herokuapp.com/olahol/react-tagsinput/master/react-tagsinput.js?style=flat-square
[size-url]: https://github.com/olahol/react-tagsinput/blob/master/react-tagsinput.js
[codecov-image]: https://img.shields.io/codecov/c/github/olahol/react-tagsinput?style=flat-square
[codecov-url]: https://app.codecov.io/github/olahol/react-tagsinput
