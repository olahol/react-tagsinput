global.document = require("jsdom").jsdom("");
global.window = document.parentWindow;
global.navigator = window.navigator;

var assert = require("assert");

var React = require("react/addons")
  , TestUtils = React.addons.TestUtils;

var TagsInput = require("../react-tagsinput");


var randomString = function () {
  return Math.random().toString(36).substring(7);
};

var TestComponent = React.createClass({
  mixins: [React.addons.LinkedStateMixin]

  , getInitialState: function () {
    return { tags: [] }
  }

  , tagsInput: function () {
    return this.refs.tagsinput;
  }

  , render: function () {
    return React.createElement(TagsInput, React.__spread({}, {
      ref: "tagsinput"
      , valueLink: this.linkState("tags")
    }, this.props));
  }
});

describe("TagsInput", function () {
  var createTagsInput = function (props) {
    var component = TestUtils.renderIntoDocument(React.createElement(TestComponent, props));
    return component.tagsInput();
  };

  var addTag = function (tagsinput, tag, blur) {
    var input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");

    TestUtils.Simulate.change(input, { target: { value: tag } });

    if (blur) {
      TestUtils.Simulate.blur(input);
    } else {
      TestUtils.Simulate.keyDown(input, { keyCode: 13 });
    }

    return input;
  };

  var removeTagBS = function (tagsinput) {
    var input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");

    TestUtils.Simulate.change(input, { target: { value: "" } });
    TestUtils.Simulate.keyDown(input, { keyCode: 8 });

    return input;
  };

  var removeTagIndex = function (tagsinput, index) {
    var className = tagsinput.props.classNamespace + "-tagsinput-remove";
    var tags = TestUtils.scryRenderedDOMComponentsWithClass(tagsinput, className);
    var tag = tags[index];

    if (tag) {
      TestUtils.Simulate.click(tag.getDOMNode());

      return tag;
    }
  };

  describe("basic", function () {
    it("should add a tag", function () {
      var tagsinput = createTagsInput();
      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag, "a tag should have been added");
    });

    it("should remove a tag", function () {
      var tagsinput = createTagsInput();
      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag, "a tag should have been added");

      removeTagBS(tagsinput);

      tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "there should now be zero tags");
    });

    it("should remove nth tag", function () {
      var tagsinput = createTagsInput();

      var tag1 = randomString()
        , tag2 = randomString()
        , tag3 = randomString();

      addTag(tagsinput, tag1);
      addTag(tagsinput, tag2);
      addTag(tagsinput, tag3);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag1);
      assert.equal(tags[1], tag2);
      assert.equal(tags[2], tag3);
      assert.equal(tags.length, 3);

      removeTagIndex(tagsinput, 1);

      tags = tagsinput.getTags();

      assert.equal(tags[0], tag1);
      assert.equal(tags[1], tag3);
      assert.equal(tags.length, 2);
    });

    it("should add invalid class to invalid tag", function () {
      var tagsinput = createTagsInput();
      var tag = "";

      var input = addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "a tag should not have been added");

      assert.ok(/invalid/.test(input.props.className), "invalid should be among input classes");
    });

    it("should add a tag on blur", function () {
      var tagsinput = createTagsInput();
      var tag = randomString();

      addTag(tagsinput, tag, true);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag, "a tag should have been added");
    });

    it("should not add a tag on blur", function () {
      var tagsinput = createTagsInput({
        addOnBlur: false
      });
      var tag = randomString();

      addTag(tagsinput, tag, true);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "there should be no tags");
    });
  });

  describe("props", function (done) {
    it("should test value and onChange instead of valueLink", function () {
      var tagsinput = createTagsInput({
        value: ["test"]
        , onChange: done
        , valueLink: null
      });

      var tags = tagsinput.getTags();

      assert.equal(tags[0], "test", "there should be one tag");

      addTag(tagsinput, "test");
    });

    it("should test classNamespace", function () {
      var tagsinput = createTagsInput({
        classNamespace: ""
      });

      var tag = randomString();

      var input = addTag(tagsinput, tag, true);

      assert.equal(input.props.className.trim(), "tagsinput-input", "there should be no namespace");
    });

    it("should test transform prop", function () {
      var tagsinput = createTagsInput({
        transform: function (tag) {
          return "test";
        }
      });
      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], "test", "tag should have been transformed to test");
    });
  });

  describe("coverage", function (done) {
    it("should test transform prop without returning a string", function () {
      var tagsinput = createTagsInput({
        transform: function (tag) {
          return false;
        }
      });

      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag, "tag should not have been transformed to test");
    });

    it("should render without any handlers", function () {
      var tagsinput = createTagsInput({
        valueLink: null
      });

      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "there should be no tags");
    });

    it("should focus input", function () {
      var tagsinput = createTagsInput();

      tagsinput.focus();
    });
  });
});
