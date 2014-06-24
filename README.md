# react-tagsinput

A simple react component for inputing tags.

## Demo

A demonstration can be found here: https://olahol.github.io/react-tagsinput

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

### onChange

Callback when the tag input changes, the argument is an array of the current tags.

### onTagAdd

Callback when a tag is added, argument is the added tag.

### onTagAdd

Callback when a tag is removed, argument is the removed tag.

## Methods

### getTags()

Returns an array of the current tags in the input.

## Styling

Look at `react-tagsinput.css` for an idea on how to style this component.
