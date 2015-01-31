global.document = require("jsdom").jsdom("");
global.window = document.parentWindow;
global.navigator = window.navigator;

var assert = require("assert");

var React = require("react/addons")
  , TestUtils = React.addons.TestUtils;

var TagsInput = require("../react-tagsinput");

describe("TagsInput", function () {
  var createTagsInput = function (props) {
    return TestUtils.renderIntoDocument(React.createElement(TagsInput, props));
  };

  var addTag = function (tagsinput, tag) {
    var input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");

    TestUtils.Simulate.change(input, { target: { value: tag } });
    TestUtils.Simulate.keyDown(input, { keyCode: 13 });

    return input;
  };

  describe("main functionality", function () {
    it("should add a tag on enter", function () {
      var tagsinput = createTagsInput();
      var input = addTag(tagsinput, "test");

      assert.equal(tagsinput.getTags().length, 1);
      assert.equal(tagsinput.getTags()[0], "test");
      assert.equal(input.props.value, "");
    });

    it("should not add a duplicate tag", function () {
      var tagsinput = createTagsInput();
      var input = addTag(tagsinput, "");

      assert.equal(tagsinput.getTags().length, 0);
      assert.equal(input.props.value, "");
      assert.ok(/invalid/.test(input.props.className));
    });

    it("should remove a tag on backspace", function () {
      var tagsinput = createTagsInput();
      var input = addTag(tagsinput, "tag1");
      addTag(tagsinput, "tag2");

      assert.equal(tagsinput.getTags().length, 2);

      TestUtils.Simulate.keyDown(input, { keyCode: 8 });

      assert.equal(tagsinput.getTags().length, 1);
      assert.equal(tagsinput.getTags()[0], "tag1");
    });

    it("should remove a tag on click", function () {
      var tagsinput = createTagsInput();
      addTag(tagsinput, "tag1");
      addTag(tagsinput, "tag2");

      assert.equal(tagsinput.getTags().length, 2);

      var removeNodes = TestUtils.scryRenderedDOMComponentsWithClass(tagsinput, "react-tagsinput-remove");

      TestUtils.Simulate.click(removeNodes[0]);

      assert.equal(tagsinput.getTags().length, 1);
      assert.equal(tagsinput.getTags()[0], "tag2");
    });

    it("should add a tag on blur", function () {
      var tagsinput = createTagsInput();
      var input = TestUtils.findRenderedDOMComponentWithTag(tagsinput, "input");

      TestUtils.Simulate.change(input, { target: { value: "test" } });
      TestUtils.Simulate.blur(input);

      assert.equal(tagsinput.getTags().length, 1);
      assert.equal(tagsinput.getTags()[0], "test");
    });
  });

  describe("props and methods", function () {
    it("should test onBeforeAddTag validation", function () {
      var tagsinput = createTagsInput({ onBeforeTagAdd: function () { return false; } });
      var input = addTag(tagsinput, "test");

      assert.equal(tagsinput.getTags().length, 0);
      assert.equal(input.props.value, "test");
    });

    it("should test onBeforeAddTag transformation", function () {
      var tagsinput = createTagsInput({ onBeforeTagAdd: function () { return "test1"; } });
      var input = addTag(tagsinput, "test");

      assert.equal(tagsinput.getTags().length, 1);
      assert.equal(tagsinput.getTags()[0], "test1");
    });

    it("should test onChangeInput", function () {
      var value = "";
      var tagsinput = createTagsInput({
        onChangeInput: function (v) { value = v; }
        , onBeforeTagAdd: function () { return false; }
      });
      var input = addTag(tagsinput, "test");

      assert.equal(tagsinput.getTags().length, 0);
      assert.equal(input.props.value, value);
    });

    it("should add a tag with addTag", function () {
      var tagsinput = createTagsInput();
      tagsinput.addTag("test");

      assert.equal(tagsinput.getTags().length, 1);
      assert.equal(tagsinput.getTags()[0], "test");
    });
  });
});
