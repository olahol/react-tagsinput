# react-tagsinput

[![npm version](https://badge.fury.io/js/react-tagsinput.svg)](http://badge.fury.io/js/react-tagsinput)
[![Build Status](https://travis-ci.org/olahol/react-tagsinput.svg)](https://travis-ci.org/olahol/react-tagsinput)
[![Coverage Status](https://img.shields.io/coveralls/olahol/react-tagsinput.svg?style=flat)](https://coveralls.io/r/olahol/react-tagsinput)
[![Dependency Status](https://david-dm.org/olahol/react-tagsinput.svg)](https://david-dm.org/olahol/react-tagsinput)
[![Download Count](https://img.shields.io/npm/dm/react-tagsinput.svg?style=flat)](https://www.npmjs.com/package/react-tagsinput)

> Simple [React](http://facebook.github.io/react/index.html) component for inputing tags.

### [Demo](https://olahol.github.io/react-tagsinput)

[![Demo](https://cdn.rawgit.com/olahol/react-tagsinput/master/example/demo.gif "Demo")](https://github.com/olahol/react-tagsinput/blob/master/example/index.html)

## Install

```bash
npm install react-tagsinput --save
```

or

```bash
bower install react-tagsinput --save
```

## Example

Controlled usage:

```javascript
var TagsInput = require('react-tagsinput');

var App = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return { tags: [] };
  },

  saveTags: function () {
    console.log('tags: ', this.refs.tags.getTags().join(', '));
  },

  render: function () {
    return (
      <div>
        <TagsInput ref='tags' valueLink={this.linkState('tags')} />
        <button onClick={this.saveTags}>Save</button>
      </div>
    );
  }
});
```

Uncontrolled usage:

```javascript
var TagsInput = require('react-tagsinput');

var App = React.createClass({
  saveTags: function () {
    console.log('tags: ', this.refs.tags.getTags().join(', '));
  },

  render: function () {
    return (
      <div>
        <TagsInput ref='tags' />
        <button onClick={this.saveTags}>Save</button>
      </div>
    );
  }
});
```

More examples in `example/`.

## API

### Props

##### value

An array of tags. This prop or `valueLink` is required.

##### valueLink

A ReactLink object.

##### defaultValue

Initialize the component with a value. This is only used when `value` is `null`
(i.e when the component is uncontrolled.)

##### placeholder

Placeholder text for the add a tag input, default is "Add a tag".

##### classNamespace

Namespace for CSS classes, default is `react` i.e CSS classes are `react-tagsinput`.

##### addOnBlur

Boolean whether a tag should be added when the input field blurs, default
is `true`.

##### validate or validateAsync

A function which returns true if a tag is valid, default function returns
true for non-empty strings and unique tags. The validation is asynchronous
if the `validate` function takes two arguments `tag` and a callback `cb` or if
the prop `validateAsync` is set. `validateAsync` is always asynchronous and
takes two arguments `tag` and `cb`.

##### transform

A function which transforms a tag before it is added, the default
function trims the tag of whitespaces.

##### addKeys

An array of key codes that add a tag, default is `[9, 13]` (Tab and Enter).

##### removeKeys

An array of key codes that remove a tag, default is `[8]` (Backspace).

##### onChange

Callback when the tag input changes, the argument is an array of the
current tags and the tag which was added or removed.

##### onChangeInput

Callback when the input changes, the argument is the value of the input.

##### onBlur

Callback when input field blurs.

##### onKeyDown

Callback when a key down event is triggered on the tag input which is not
in the removeKeys or addKeys.

##### onKeyUp

Callback when a key up event is triggered on the tag input.

##### onTagAdd

Callback when a tag is added, argument is the added tag.

##### onTagRemove

Callback when a tag is removed, argument is the removed tag.

### Methods

##### focus()

Focus on the tag input.

##### clear()

Clear the tag input.

##### getTags()

Returns an array of the current tags.

##### addTag(tag)

Adds a tag.

##### removeTag(tag)

Removes a tag.

## Styles

Look at [react-tagsinput.css](https://github.com/olahol/react-tagsinput/blob/master/react-tagsinput.css) for an idea on how to style this component.

## Addendum: Input completion

An example of how to add input completion to the `TagsInput` component can be found in [examples/completion.html](https://github.com/olahol/react-tagsinput/blob/master/example/completion.html).

[![Completion Demo](https://cdn.rawgit.com/olahol/react-tagsinput/master/example/demo_completion.gif "Completion Demo")](https://github.com/olahol/react-tagsinput/blob/master/example/completion.html)

## Addendum: Components instead of strings as tags

An example of how to use React components instead of strings as tags can be found in [examples/component.html](https://github.com/olahol/react-tagsinput/blob/master/example/component.html).

## Contributors

* Ola Holmström (@olahol)
* Dmitri Voronianski (@voronianski)
* Artem Vovsya (@avovsya)
* scott c (@scoarescoare)
* junk (@jedverity)
* Buz Carter (@buzcarter)

---

MIT Licensed


