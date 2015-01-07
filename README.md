# react-tagsinput

> Simple react component for inputing tags.

## Demo

A demonstration can be found here: https://olahol.github.io/react-tagsinput

## Install

```bash
npm install react-tagsinput --save
```

or 

```bash
bower install react-tagsinput --save
```

## Example

```js
var TagsInput = require("./react-tagsinput");

var App = React.createClass({
  saveTags: function () {
    console.log("tags: ", this.refs.tags.getTags().join(", "));
  }

  , render: function () {
    return (
      <div>
        <TagsInput ref="tags" tags={["tag1", "tag2"]} />
        <button onClick={this.saveTags}>Save</button>
      </div>
    );
  }
});
```

## Props

### tags

Tags to preloaded, default is `[]`.

### placeholder

Placeholder text for the add a tag input, default is "Add a tag".

### validate

A function which returns true if a tag is valid, default function returns
true for every string but the empty string.

### addKeys

An array of key codes that add a tag, default is `[9, 13]` (Tab and Enter.)

### onChange

Callback when the tag input changes, the argument is an array of the current tags.

### onTagAdd

Callback when a tag is added, argument is the added tag.

### onTagRemove

Callback when a tag is removed, argument is the removed tag.

## Methods

### getTags()

Returns an array of the current tags.

## Styling

Look at `react-tagsinput.css` for an idea on how to style this component.

## CHANGELOG

### 2014-10-16

* `validate` prop which is a function that returns true if a tag is valid.
* Add tag when input is blurred.
* `addKeys` prop which defines key code that add a tag, default is Tab (9) and Enter (13.)
