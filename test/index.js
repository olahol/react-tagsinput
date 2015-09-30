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

  , setValue: function (value) {
    this.setState({ value: value });
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
    return component;
  };

  var changeTag = function (tagsinput, tag) {
    var input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");

    TestUtils.Simulate.change(input, { target: { value: tag } });

    return input;
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
      var tagsinput = createTagsInput().tagsInput();
      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag, "a tag should have been added");
    });

    it("should remove a tag", function () {
      var tagsinput = createTagsInput().tagsInput();
      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag, "a tag should have been added");

      removeTagBS(tagsinput);

      tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "there should now be zero tags");
    });

    it("should remove nth tag", function () {
      var tagsinput = createTagsInput().tagsInput();

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
      var tagsinput = createTagsInput().tagsInput();
      var tag = randomString();

      var input = addTag(tagsinput, tag);
      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 1, "one tag should have been added");

      assert.ok(/invalid/.test(input.props.className), "invalid should be among input classes");
    });

    it("should ignore empty tags", function () {
      var tagsinput = createTagsInput().tagsInput();
      var tag = "";

      var input = addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "no tag should have been added");

      assert.ok(!/invalid/.test(input.props.className), "invalid should not be among input classes");
      assert.ok(!/validating/.test(input.props.className), "validating should not be among input classes");
    });

    it("should add a tag on blur", function () {
      var tagsinput = createTagsInput().tagsInput();
      var tag = randomString();

      addTag(tagsinput, tag, true);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag, "a tag should have been added");
    });

    it("should not add a tag on blur", function () {
      var tagsinput = createTagsInput({
        addOnBlur: false
      }).tagsInput();
      var tag = randomString();

      addTag(tagsinput, tag, true);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "there should be no tags");
    });

    it("should work with non-string tags", function () {
      var tagsinput = createTagsInput({
        transform: function (tag) {
          return React.createElement("b", {}, tag);
        }
      }).tagsInput();

      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 1, "there should be a tags");

      var bolds = TestUtils.scryRenderedDOMComponentsWithTag(tagsinput, "b");

      assert.equal(bolds.length, 1, "there should be one bold tag");
    });

    it("should set css classes", function () {
      var tagsinput = createTagsInput({
        classNames: {
          div: "div-test"
          , input: "input-test"
          , invalid: "invalid-test"
          , validating: "validating-test"
          , tag: "tag-test"
          , remove: "remove-test"
        }
      }).tagsInput();

      var tag = randomString();

      addTag(tagsinput, tag);

      var div = TestUtils.findRenderedDOMComponentWithClass(tagsinput, "div-test");
      var input = TestUtils.findRenderedDOMComponentWithClass(tagsinput, "input-test");
      var tag = TestUtils.findRenderedDOMComponentWithClass(tagsinput, "tag-test");
      var remove = TestUtils.findRenderedDOMComponentWithClass(tagsinput, "remove-test");

      assert.ok(div, "there should be a div with class div-test");
      assert.ok(input, "there should be a div with class input-test");
      assert.ok(tag, "there should be a div with class tag-test");
      assert.ok(remove, "there should be a div with class remove-test");
    });

    it("should do async validation of tags", function (done) {
      var tagsinput = createTagsInput({
        validate: function (tag, cb) {
          setTimeout(function () {
            cb(true);
          }, 50);
        }
      }).tagsInput();

      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "no tags because validation is not done");

      setTimeout(function () {
        var tags = tagsinput.getTags();

        assert.equal(tags[0], tag, "there should be a tag here now");

        done()
      }, 100);
    });

    it("should do async validation of tags with validateAsync", function (done) {
      var tagsinput = createTagsInput({
        validateAsync: function () { } // will never fire.
      }).tagsInput();

      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "no tags because validation is not done");

      setTimeout(function () {
        var tags = tagsinput.getTags();
        assert.equal(tags.length, 0, "no tags because validation is not done");
        done()
      }, 100);
    });

    it("should clear text input", function () {
      var tagsinput = createTagsInput({
      }).tagsInput();

      var tag = randomString();

      var input = changeTag(tagsinput, tag);

      assert.equal(input.props.value, tag);

      tagsinput.clearInput();

      assert.equal(input.props.value, "");
    });

    it("should clear all tags", function () {
      var tagsinput = createTagsInput({
      }).tagsInput();

      var tag = randomString();

      addTag(tagsinput, tag + "1");
      addTag(tagsinput, tag + "2");
      addTag(tagsinput, tag + "3");
      addTag(tagsinput, tag + "4");
      addTag(tagsinput, tag + "5");

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 5, "there should be 5 tags");

      tagsinput.clear();

      tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "there should be no tags");
    });

    it("should focus input", function () {
      var tagsinput = createTagsInput({
      }).tagsInput();

      TestUtils.Simulate.click(tagsinput.getDOMNode());
    });
  });

  describe("props", function () {
    it("should test value and onChange instead of valueLink", function (done) {
      var tagsinput = createTagsInput({
        value: ["test"]
        , onChange: function () {
          done();
        }
        , valueLink: null
      }).tagsInput();

      var tags = tagsinput.getTags();

      assert.equal(tags[0], "test", "there should be one tag");

      var tag = randomString();

      addTag(tagsinput, tag);
    });

    it("should test classNamespace", function () {
      var tagsinput = createTagsInput({
        classNamespace: ""
      }).tagsInput();

      var tag = randomString();

      var input = addTag(tagsinput, tag, true);

      assert.equal(input.props.className.trim(), "tagsinput-input", "there should be no namespace");
    });

    it("should test onClick", function (done) {
      var clicks = 0;
      var tagsinput = createTagsInput({
        onClick: function () {
          clicks++;
          if (clicks === 2) {
            done();
          }
        }
      }).tagsInput();

      var tag = randomString();

      var input = addTag(tagsinput, tag, true);

      TestUtils.Simulate.click(tagsinput.getDOMNode());
      TestUtils.Simulate.click(input.getDOMNode());
    });

    it("should test onFocus", function (done) {
      var tagsinput = createTagsInput({
        onFocus: function () {
          done();
        }
      }).tagsInput();

      var input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");

      TestUtils.Simulate.focus(input.getDOMNode());
    });

    it("should test onBlur", function (done) {
      var tagsinput = createTagsInput({
        onBlur: function () {
          done();
        }
      }).tagsInput();

      var input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");

      TestUtils.Simulate.focus(input.getDOMNode());
      TestUtils.Simulate.blur(input.getDOMNode());
    });

    it("should test transform prop", function () {
      var tagsinput = createTagsInput({
        transform: function (tag) {
          return "test";
        }
      }).tagsInput();
      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], "test", "tag should have been transformed to test");
    });

    it("should test renderTag prop", function() {
      var tagsinput = createTagsInput({
        renderTag: function(key, tag, removeClickHandler) {
          return React.createElement("div", {
            key: key,
            onClick: removeClickHandler,
            className: 'tagClassName'
          }, tag);
        }
      }).tagsInput();

      var tags = [];
      var tag1 = randomString();
      var tag2 = randomString();
      addTag(tagsinput, tag1);
      addTag(tagsinput, tag2);

      tags = TestUtils.scryRenderedDOMComponentsWithClass(tagsinput, 'tagClassName');
      assert.equal(tags.length, 2);
      assert.equal(tags[0].getDOMNode().textContent, tag1)
      assert.equal(tags[1].getDOMNode().textContent, tag2)

      TestUtils.Simulate.click(tags[0].getDOMNode());

      tags = TestUtils.scryRenderedDOMComponentsWithClass(tagsinput, 'tagClassName');
      assert.equal(tags.length, 1);
      assert.equal(tags[0].getDOMNode().textContent, tag2)
    });

    it("should support required", function() {
      var tagsinput = createTagsInput({required: true}).tagsInput();
      var tag = randomString();

      var input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");
      assert(input.props.required);

      addTag(tagsinput, tag);
      input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");
      assert(!input.props.required);
    });

    it("if beforeTagRemove return false, onTagRemove should not fire", function () {
      var tagsinput = createTagsInput({
        valueLink: null,
        onTagAdd: function (tag) {
          assert.ok(true);
        },
        onTagRemove: function (tag) {
          assert.ok(false);
        },
        beforeTagRemove: function (tag) {
          return false;
        }
      }).tagsInput();

      tagsinput.addTag("tag");
      tagsinput.removeTag("tag");
      assert.equal(tagsinput.getTags()[0], 'tag');
    });

    it("if beforeTagAdd return false, onTagAdd should not fire", function () {
      var tagsinput = createTagsInput({
        valueLink: null,
        onTagAdd: function (tag) {
          assert.ok(false);
        },
        beforeTagAdd: function (tag) {
          return false;
        }
      }).tagsInput();

      tagsinput.addTag("tag");
      assert.equal(tagsinput.getTags().length, 0);
    });

    it("should add 'maxlength' attribute to input", function() {
      var tagsinput = createTagsInput({
        maxTagLength: 3
      }).tagsInput();

      var inputNode = React.findDOMNode(tagsinput.refs.input);

      assert(inputNode.hasAttribute('maxlength'));
      assert.equal(inputNode.getAttribute('maxlength'), 3);
    })
  });

  describe("uncontrolled", function () {
    it("should render without any handlers", function () {
      var tag1 = randomString()
        , tag2 = randomString();

      var component = createTagsInput({
        valueLink: null
        , defaultValue: [tag1]
      });

      var tagsinput = component.tagsInput();

      addTag(tagsinput, tag2);

      var tags = tagsinput.getTags();

      assert.equal(tags[0], tag1);
      assert.equal(tags[1], tag2);

      component.setProps({
        value: []
      });

      tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "there shouldn't be any tags");

      component.setProps({
        value: null
      });

      tags = tagsinput.getTags();

      assert.equal(tags[0], tag1);
    });
  });

  describe("coverage", function () {
    it("should test transform prop without returning a string", function () {
      var tagsinput = createTagsInput({
        transform: function (tag) {
          return false;
        }
      }).tagsInput();

      var tag = randomString();

      addTag(tagsinput, tag);

      var tags = tagsinput.getTags();

      assert.equal(tags.length, 0, "there should be no tags");
    });

    it("should focus input", function () {
      var tagsinput = createTagsInput().tagsInput();

      tagsinput.focus();
    });

    it("should blur input", function () {
      var tagsinput = createTagsInput().tagsInput();

      tagsinput.blur();
    });

    it("async validation of tags should block input", function () {
      var tagsinput = createTagsInput({
        validate: function (tag, cb) {
          // blocks forever
        }
      }).tagsInput();

      var tag = randomString();

      addTag(tagsinput, tag);

      addTag(tagsinput, "");
    });

    it("if nothing has changed callbacks should not fire", function () {
      var tagsinput = createTagsInput({
        valueLink: null,
        onTagAdd: function (tag) {
          assert.ok(false);
        },
        onTagRemove: function (tag) {
          assert.ok(false);
        }
      }).tagsInput();

      tagsinput.addTag("");
      tagsinput.removeTag("tag1");
    });

    it("test keyUp and keyDown props", function () {
      var tagsinput = createTagsInput({
        onKeyDown: function (e) {
          assert.equal(e.keyCode, 27);
        }
        , onKeyUp: function (e) {
          assert.equal(e.keyCode, 27);
        }
      }).tagsInput();

      var tag = randomString();

      var input = addTag(tagsinput, tag);

      TestUtils.Simulate.keyDown(input, {keyCode: 27});

      TestUtils.Simulate.keyUp(input, {keyCode: 27});
    });

    it("test keyUp and keyDown props", function () {
      var tagsinput = createTagsInput({
      }).tagsInput();

      var tag = randomString();

      var input = addTag(tagsinput, tag);

      TestUtils.Simulate.keyDown(input, {keyCode: 27});

      TestUtils.Simulate.keyUp(input, {keyCode: 27});
    });
  });

  describe("bugs", function () {
    it("issue #12", function () {
      var tagsinput = createTagsInput({
        valueLink: null,
        onTagAdd: function (tag) {
          var tags = tag.split(/\s+/);

          if (1 < tags.length) {
            tagsinput.removeTag(tag);

            tags.forEach(function (splittedTag) {
              tagsinput.addTag(splittedTag);
            });
          }
        }
      }).tagsInput();

      tagsinput.addTag("aaa bbb ccc");

      var tags = tagsinput.getTags();

      assert.equal(tags[0], "aaa");
      assert.equal(tags[1], "bbb");
      assert.equal(tags[2], "ccc");
    });

    it("issue #15", function () {
      var tagsinput = createTagsInput({
        valueLink: null,
        onTagAdd: function (tag) {
          assert.equal(tagsinput.getTags().length, 1);
        },
        onTagRemove: function (tag) {
          assert.equal(tagsinput.getTags().length, 0);
        }
      }).tagsInput();

      tagsinput.addTag("tag1");
      tagsinput.removeTag("tag1");
    });
  });
});
