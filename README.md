# react-tagsinput

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependency Status][dep-image]][dep-url]
[![Download Count][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

> Simple [React](http://facebook.github.io/react/index.html) component for inputing tags.

### [Demo](https://olahol.github.io/react-tagsinput)

[![Demo](./example/demo.gif)][demo-url]

## Install

```bash
npm install react-tagsinput --save
```

or

```bash
bower install react-tagsinput --save
```

## Example

```javascript
import TagsInput from 'react-tagsinput'

class TestComponent extends React.Component {
  constructor() {
    super()
    this.state = {tags: []}
  }

  handleChange(tags) {
    this.setState({tags})
  }

  render() {
    return <TagsInput value={this.state.tags} onChange={::this.change} />
  }
}
```

## Interface

### Props

##### value (required)

An array of tags.

##### onChange (required)

Callback when tags change.

##### addKeys

An array of key codes that add a tag, default is `[9, 13]` (Tab and Enter).

##### removeKeys

An array of key codes that remove a tag, default is `[8]` (Backspace).

##### tagProps

Props passed down to every tag component. Defualt is: `{className: 'react-tagsinput-tag'}`.

##### inputProps

Props passed down to input. Default is: `{className: 'react-tagsinput-input'}`

##### renderTag

Render function for every tag. Default is:

```javascript
function defaultRenderTag (props) {
  let {tag, key, onRemove, ...other} = props
  return (
    <span key={key} {...other}>
      {tag}
      <a onClick={(e) => onRemove(key)} />
    </span>
  )
}
```

##### renderInput

Render function for input. Default is:

```javascript
function defaultRenderInput (props) {
  let {onChange, value, ...other} = props
  return (
    <input type='text' onChange={onChange} value={value} {...other} />
  )
}
```

## Styling

Look at [react-tagsinput.css](./react-tagsinput.css) for a basic style.

## Contributors

* Ola Holmström (@olahol)
* Dmitri Voronianski (@voronianski)
* Artem Vovsya (@avovsya)
* scott c (@scoarescoare)
* junk (@jedverity)
* Buz Carter (@buzcarter)
* Garbin Huang (@garbin)
* Will Washburn (@willwashburn)
* Kristján Oddsson (@koddsson)
* Vojtěch Bartoš (@VojtechBartos)
* Ming Fang (@mingfang)
* Chris Adams (@thecadams)
* Domenico Matteo (@dmatteo)
* Kevin Smith (@ksmth)
* Gaurav Tiwari (@gauravtiwari)


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
