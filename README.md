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

```javascript
var TagsInput = require('./react-tagsinput');

var App = React.createClass({
  saveTags: function () {
    console.log('tags: ', this.refs.tags.getTags().join(', '));
  },

  render: function () {
    return (
      <div>
        <TagsInput ref="tags" tags={["tag1", "tag2"]} />
        <button onClick={this.saveTags}>Save</button>
      </div>
    );
  }
});
```

## API

### Props

##### tags

Tags to preloaded, default is `[]`.

##### placeholder

Placeholder text for the add a tag input, default is "Add a tag".

##### classNamespace

Namespace for CSS classes, default is `react` i.e CSS classes are `react-tagsinput`.

##### addOnBlur

Boolean whether a tag should be added when the input field blurs, default
is `true`.

##### validate

A function which returns true if a tag is valid, default function returns
true for every string but the empty string.

##### addKeys

An array of key codes that add a tag, default is `[9, 13]` (Tab and Enter).

##### onChange

Callback when the tag input changes, the argument is an array of the current tags.

##### onBlur

Callback when input field blurs, the argument is an array of the current tags.

##### onChangeInput

Callback when the input changes, the argument is the value of the input.

##### onTagAdd

Callback when a tag is added, argument is the added tag.

##### onBeforeTagAdd

Callback before a tag is added, if it returns a `string` the tag is
transformed if it returns a falsy value the tag is not added.

##### onTagRemove

Callback when a tag is removed, argument is the removed tag.

##### onBeforeTagRemove

Callback before a tag removed, if it returns a falsy value the tag
is not removed.

### Methods

##### getTags()

Returns an array of the current tags.

##### addTag(tag)

Adds a tag.

##### inputFocus()

Focus on the tag input.

## Styles

Look at `react-tagsinput.css` for an idea on how to style this component.

## Addendum: Input completion

An example of how to add input completion to the `TagsInput` component can
be found in `examples/completion.html`.

[![Completion Demo](https://cdn.rawgit.com/olahol/react-tagsinput/master/example/demo_completion.gif "Completion Demo")](https://github.com/olahol/react-tagsinput/blob/master/example/completion.html)

## Contributors

* Ola Holmström (@olahol)
* Dmitri Voronianski (@voronianski)
* Artem Vovsya (@avovsya)

---

MIT Licensed


