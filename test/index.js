const jsdom = require("jsdom");
global.document = jsdom.jsdom("");
global.window = document.defaultView;
global.navigator = window.navigator;

const TagsInput = require("../src");

const React = require("react");
const TestUtils = require("react-addons-test-utils");
const assert = require("assert");

class TestComponent extends React.Component {
  constructor() {
    super()
    this.state = {tags: []}
    this.change = this.change.bind(this);
    this.input = this.input.bind(this);
    this.tagsinput = this.tagsinput.bind(this);
  }

  input() {
    return this.refs.tagsinput.refs.input;
  }

  tagsinput() {
    return this.refs.tagsinput;
  }

  change(tags) {
    this.setState({tags});
  }

  len() {
    return this.state.tags.length;
  }

  tag(i) {
    return this.state.tags[i];
  }

  render() {
    return <TagsInput ref="tagsinput" value={this.state.tags} onChange={this.change} {...this.props} />
  }
}

function randstring() {
  return +new Date() + "";
}

function change(comp, value) {
  TestUtils.Simulate.change(comp.input(), {target: {value: value}});
}

function keyDown(comp, code) {
  TestUtils.Simulate.keyDown(comp.input(), {keyCode: code});
}

function click(comp) {
  TestUtils.Simulate.click(comp);
}

function add(comp, tag) {
  change(comp, tag);
  keyDown(comp, 13);
}

function remove(comp) {
  change(comp, "");
  keyDown(comp, 8);
}

function allTag(comp, tagName) {
  return TestUtils.scryRenderedDOMComponentsWithTag(comp, tagName);
}

function allClass(comp, className) {
  return TestUtils.scryRenderedDOMComponentsWithClass(comp, className);
}

describe("TagsInput", () => {
  describe("basic", () => {
    it("should add a tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 13);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should remove a tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      keyDown(comp, 8);
      assert.equal(comp.len(), 0, "there should be no tags");
    });

    it("should remove a tag by clicking", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      let tag = randstring();

      add(comp, tag + "1");
      add(comp, tag + "2");
      assert.equal(comp.len(), 2, "there should be two tags");

      let removes = allTag(comp, "a");
      assert.equal(removes.length, 2, "there should be two remove buttons");
      click(removes[0]);
      assert.equal(comp.len(), 1, "there should be one tag");
    });

    it("should focus on input when clicking on component div", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      click(comp.tagsinput().refs.div);
    });

    it("should not add empty tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);

      change(comp, "");
      keyDown(comp, 13);
      assert.equal(comp.len(), 0, "there should be no tag");
    });
  });

  describe("props", () => {
    it("should add a tag on key code 44", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addKeys={[44]} />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 44);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should remove a tag on key code 44", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent removeKeys={[44]} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      keyDown(comp, 44);
      assert.equal(comp.len(), 0, "there should be no tags");
    });

    it("should add props to tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent tagProps={{className: "test"}} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      let tags = allClass(comp, "test");
      assert.equal(comp.len(), tags.length, "there should be one tag");
    });

    it("should add props to input", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent inputProps={{className: "test"}} />);
      let inputs = allTag(comp, "input");

      assert.equal(inputs[0].className, "test", "class name should be test");
    });

    it("should render tags with renderTag", () => {
      let renderTag = (props) => {
        return <div key={props.key} className="test"></div>;
      };

      let comp = TestUtils.renderIntoDocument(<TestComponent renderTag={renderTag} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      let tags = allClass(comp, "test");
      assert.equal(comp.len(), tags.length, "there should be one tag");
    });

    it("should render input with renderInput", () => {
      let renderInput = (props) => {
        return <input key={props.key} className="test" />;
      };
      let comp = TestUtils.renderIntoDocument(<TestComponent renderInput={renderInput} />);
      let inputs = allTag(comp, "input");

      assert.equal(inputs[0].className, "test", "class name should be test");
    });
  });

  describe("methods", () => {
    it("should focus input", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);

      comp.tagsinput().focus();
    });

    it("should blur input", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);

      comp.tagsinput().blur();
    });
  });

  describe("coverage", () => {
    it("not remove no existant index", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);

      comp.tagsinput()._removeTag(1);
    });
  });
});
