const { JSDOM }= require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html>`);
global.document = dom.window.document;
global.window = dom.window;
Object.defineProperty(global, 'navigator', {configurable: true, value: window.navigator});
global.IS_REACT_ACT_ENVIRONMENT = true;

const TagsInput = require("../src").default;

const React = require("react");
const { act } = React;
const { render, cleanup, fireEvent, createEvent } = require('@testing-library/react/pure');
const assert = require("assert");
const sinon = require('sinon');

afterEach(cleanup);
after(() => dom.window.close());

class TestComponent extends React.Component {
  constructor() {
    super()
    this.state = {tags: []}
    this.change = this.change.bind(this);
    this.input = this.input.bind(this);
    this.tagsinput = this.tagsinput.bind(this);
  }

  input() {
    return this.tagsinputRef.input;
  }

  div() {
    return this.tagsinputRef.div;
  }

  tagsinput() {
    return this.tagsinputRef;
  }

  change(tags, changed, changedIndexes) {
    if (this.props.onChange) {
      this.props.onChange.call(this, tags, changed, changedIndexes);
    }
    this.setState({tags});
  }

  len() {
    return this.state.tags.length;
  }

  tag(i) {
    return this.state.tags[i];
  }

  render() {
    let {onChange, ...other} = this.props;
    return <TagsInput ref={ref => { this.tagsinputRef = ref; }} value={this.state.tags} onChange={this.change} {...other} />
  }
}

function mount(element) {
  let instance;
  render(React.cloneElement(element, {ref: ref => { instance = ref; }}));
  return instance;
}

function randstring() {
  return +new Date() + "";
}

function change(comp, value) {
  fireEvent.change(comp.input(), {target: {value: value}});
}

function paste(comp, value) {
  fireEvent.paste(comp.input(), {
    clipboardData: {
      getData: () => value
    }
  });
}

function keyDown(comp, code, key) {
  fireEvent.keyDown(comp.input(), {keyCode: code, key: key});
}

function blur(comp) {
  fireEvent.focusOut(comp.input());
}

function focus(comp) {
  fireEvent.focusIn(comp.input());
}

function click(comp) {
  fireEvent.click(comp);
}

function add(comp, tag, keyCode) {
  change(comp, tag);
  keyDown(comp, keyCode || 13, 'Enter');
}

function remove(comp) {
  change(comp, "");
  keyDown(comp, 8, 'Backspace');
}

function allTag(comp, tagName) {
  return comp.div().parentElement.getElementsByTagName(tagName);
}

function allClass(comp, className) {
  return comp.div().parentElement.getElementsByClassName(className);
}

describe("TagsInput", () => {
  describe("basic", () => {
    it("should add a tag", () => {
      let comp = mount(<TestComponent />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 13, 'Enter');
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should remove a tag", () => {
      let comp = mount(<TestComponent />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      keyDown(comp, 8, 'Backspace');
      assert.equal(comp.len(), 0, "there should be no tags");
    });

    it("should remove a tag by clicking", () => {
      let comp = mount(<TestComponent />);
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
      let comp = mount(<TestComponent />);
      click(comp.tagsinput().div);
      assert.equal(comp.tagsinput().div.className.includes("react-tagsinput--focused"), true);
    });

    it("should focus on input when clicking on component's child span (which is triggered when input is multi-line)", () => {
      let comp = mount(<TestComponent />);
      click(comp.tagsinput().div.firstChild);
      assert.equal(comp.tagsinput().div.className.includes("react-tagsinput--focused"), true);
    });

    it("should not add empty tag", () => {
      let comp = mount(<TestComponent />);

      change(comp, "");
      keyDown(comp, 13, 'Enter');
      assert.equal(comp.len(), 0, "there should be no tag");
    });

    it("should set a default value for the input", () => {
      let comp = mount(<TestComponent currentValue="Default Value" />);
      assert.equal(comp.input().value, "Default Value", "there should be a default value");
    });
  });

  describe("paste", () => {
    it("should not add a tag", () => {
      let comp = mount(<TestComponent />);
      let tag = randstring();

      paste(comp, tag);
      assert.equal(comp.len(), 0, "there should be one tag");
    });

    it("should add single tag", () => {
      let comp = mount(<TestComponent addOnPaste={true} />);
      let tag = randstring();

      paste(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should add two tags", () => {
      let comp = mount(<TestComponent addOnPaste={true} />);
      let firstTag = randstring();
      let secondTag = firstTag + '2';

      paste(comp, firstTag + ' ' + secondTag);
      assert.equal(comp.len(), 2, "there should be two tags");
      assert.equal(comp.tag(0), firstTag, "it should be the first tag that was added");
      assert.equal(comp.tag(1), secondTag, "it should be the second tag that was added");
    });

    it("should support onlyUnique", () => {
      let comp = mount(<TestComponent addOnPaste={true} onlyUnique={true} />);
      let tag = randstring();

      paste(comp, tag + ' ' + tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should support validation regex", () => {
      let firstTag = 'aaa';
      let secondTag = randstring();
      let thirdTag = randstring();

      let fireCount = 0;
      let onValidationReject = function (tags) {
        assert.deepEqual(tags, [secondTag, thirdTag], "there should be rejected tags in onValidationReject callback");
        fireCount += 1
      }

      let comp = mount(<TestComponent addOnPaste={true} onValidationReject={onValidationReject} validationRegex={/a+/} />);

      paste(comp, firstTag + ' ' + secondTag + ' ' + thirdTag);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), firstTag, "it should be the tag that was added");
      assert.equal(fireCount, 1, "onValidationReject should be fired once");
    });

    it("should support validation callback", () => {
      let firstTag = '10-20';
      let secondTag = '20-20';
      let thirdTag = '20-10';
      let fourthTag = '20-';

      let fireCount = 0;
      let onValidationReject = function (tags) {
        assert.deepEqual(tags, [thirdTag, fourthTag], "there should be rejected tags in onValidationReject callback");
        fireCount += 1
      }

      let validate = function (tag) {
        let matches = /^(\d+)-(\d+)$/.exec(tag);
        if (!matches || matches.length !== 3) {
          return false;
        }

        let min = parseInt(matches[1], 10);
        let max = parseInt(matches[2], 10);
        if (min > max) {
          return false;
        }

        return true;
      }

      let comp = mount(<TestComponent addOnPaste={true} onValidationReject={onValidationReject} validate={validate} />);

      paste(comp, firstTag + ' ' + secondTag + ' ' + thirdTag + ' ' + fourthTag);
      assert.equal(comp.len(), 2, "there should be two tags");
      assert.equal(comp.tag(0), firstTag, "it should allow the first tag");
      assert.equal(comp.tag(1), secondTag, "it should allow the second tag");
      assert.equal(fireCount, 1, "onValidationReject should be fired once");
    });

    it("should respect limit", () => {
      let comp = mount(<TestComponent addOnPaste={true} maxTags={1} />);
      let firstTag = randstring();
      let secondTag = firstTag + '2';

      paste(comp, firstTag + ' ' + secondTag);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), firstTag, "it should be the tag that was added");
    });

    it("should split tags on ,", () => {
      let comp = mount(<TestComponent addOnPaste={true} pasteSplit={(data) => data.split(",")} />);
      let firstTag = randstring();
      let secondTag = firstTag + '2';

      paste(comp, firstTag + ',' + secondTag);
      assert.equal(comp.len(), 2, "there should be two tags");
      assert.equal(comp.tag(0), firstTag, "it should be the tag that was added");
      assert.equal(comp.tag(1), secondTag, "it should be the tag that was added");
    });
  });

  describe("props", () => {
    let defaultClassName;
    let defaultFocusedClassName;

    beforeEach(() => {
      defaultClassName = "react-tagsinput";
      defaultFocusedClassName = "react-tagsinput--focused";
    });

    it("should not add a tag twice if onlyUnique is true", () => {
      let comp = mount(<TestComponent onlyUnique={true} />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 13, 'Enter');
      change(comp, tag);
      keyDown(comp, 13, 'Enter');
      assert.equal(comp.len(), 1, "there should be one tag");
    });

    it("should add a tag twice if onlyUnique is false", () => {
      let comp = mount(<TestComponent onlyUnique={false} />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 13, 'Enter');
      change(comp, tag);
      keyDown(comp, 13, 'Enter');
      assert.equal(comp.len(), 2, "there should be two tags");
    });

    it("should add a tag on key code 44", () => {
      let comp = mount(<TestComponent addKeys={[44]} />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 44, 'Enter');
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should add a tag on key `,`", () => {
      let comp = mount(<TestComponent addKeys={[","]} />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, null, ",");
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should add a tag on blur, if `this.props.addOnBlur` is true", () => {
      let comp = mount(<TestComponent addOnBlur={true} />);
      let tag = randstring();

      change(comp, tag);
      blur(comp);

      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should not add a tag on blur, if `this.props.addOnBlur` is false", () => {
      let comp = mount(<TestComponent addOnBlur={false} />);
      let tag = randstring();

      change(comp, tag);
      blur(comp);

      assert.equal(comp.len(), 0, "there should be no tag");
    });

    it("should not add a tag on blur, if `this.props.addOnBlur` is not defined", () => {
      let comp = mount(<TestComponent />);
      let tag = randstring();

      change(comp, tag);
      blur(comp);

      assert.equal(comp.len(), 0, "there should be no tag");
    });

    it("should remove a tag on key code 44", () => {
      let comp = mount(<TestComponent removeKeys={[44]} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      keyDown(comp, 44);
      assert.equal(comp.len(), 0, "there should be no tags");
    });

    it("should remove a tag on key `,`", () => {
      let comp = mount(<TestComponent removeKeys={[","]} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      keyDown(comp, null, ",");
      assert.equal(comp.len(), 0, "there should be no tags");
    });

    it("should be unlimited tags", () => {
        let comp = mount(<TestComponent maxTags={-1} />);
        let tag = randstring();
        add(comp, tag);
        add(comp, tag);
        assert.equal(comp.len(), 2, "there should be 2 tags");
    });

    it("should limit tags added to 0", () => {
        let comp = mount(<TestComponent maxTags={0} />);
        let tag = randstring();
        add(comp, tag);
        add(comp, tag);
        assert.equal(comp.len(), 0, "there should be 0 tags");
    });

    it("should limit tags added to 1", () => {
        let comp = mount(<TestComponent maxTags={1} />);
        let tag = randstring();
        add(comp, tag);
        add(comp, tag);
        assert.equal(comp.len(), 1, "there should be 1 tags");
    });

    it("should add a default className to host", () => {
      let comp = mount(<TestComponent />);
      assert.equal(allClass(comp, defaultClassName).length, 1);
    });

    it("should add a custom className to host", () => {
      let customClassName = "custom-class";
      let comp = mount(<TestComponent className={customClassName} />);
      assert.equal(allClass(comp, defaultClassName).length, 0);
      assert.equal(allClass(comp, customClassName).length, 1);
    });

    it("should add a default className to host on focus", () => {
      let className = `${defaultClassName} ${defaultFocusedClassName}`;
      let comp = mount(<TestComponent />);

      act(() => comp.tagsinput().focus());
      assert.equal(allClass(comp, className).length, 1, "on focus");

      act(() => comp.tagsinput().blur());
      assert.equal(allClass(comp, className).length, 0, "on blur");
    });

    it("should add a custom className to host on focus", () => {
      let customFocusedClassName = "custom-focus";
      let className = `${defaultClassName} ${customFocusedClassName}`;
      let comp = mount(<TestComponent focusedClassName={customFocusedClassName} />);

      act(() => comp.tagsinput().focus());
      assert.equal(allClass(comp, className).length, 1, "on focus");

      act(() => comp.tagsinput().blur());
      assert.equal(allClass(comp, className).length, 0, "on blur");
    });

    it("should add props to tag", () => {
      let comp = mount(<TestComponent tagProps={{className: "test"}} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      let tags = allClass(comp, "test");
      assert.equal(comp.len(), tags.length, "there should be one tag");
    });

    it("should add props to input", () => {
      let comp = mount(<TestComponent inputProps={{className: "test"}} />);
      let inputs = allTag(comp, "input");

      assert.equal(inputs[0].className, "test", "class name should be test");
    });

    it("should add trigger onFocus and onBlur on input", () => {
      let focused = false;
      let blurred = false;

      function onFocus() {
        focused = true;
      }

      function onBlur() {
        blurred = true;
      }

      let comp = mount(<TestComponent inputProps={{onFocus: onFocus, onBlur: onBlur}}/>);

      focus(comp);
      blur(comp);

      assert.ok(focused, "should have focused");
      assert.ok(blurred, "should have blurred");
    });

    it("should fire onChange on input", (done) => {
      let tag = randstring()
      let onChange = (e) => {
        assert.equal(tag, e.target.value, "input tag should be equal");
        done();
      }

      let comp = mount(<TestComponent inputProps={{onChange: onChange}} />);
      let inputs = allTag(comp, "input");

      change(comp, tag);
    });

    it("should render tags with renderTag", () => {
      let renderTag = (props) => {
        return <div key={props.key} className="test"></div>;
      };

      let comp = mount(<TestComponent renderTag={renderTag} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      let tags = allClass(comp, "test");
      assert.equal(comp.len(), tags.length, "there should be one tag");
    });

    it("should use tagDisplayProp to deal with objects", () => {
      let comp = mount(<TestComponent tagDisplayProp={'name'} />);

      add(comp, 'foo');
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.deepEqual(comp.tag(0), {name:'foo'}, "should be {name: 'foo'}");
    });

    it("should render input with renderInput", () => {
      let renderInput = (props) => {
        return <input key={props.key} className="test" />;
      };
      let comp = mount(<TestComponent renderInput={renderInput} />);
      let inputs = allTag(comp, "input");

      assert.equal(inputs[0].className, "test", "class name should be test");
    });

    it("should accept tags only matching validationRegex", () => {
      let comp = mount(<TestComponent validationRegex={/a+/} />);
      add(comp, 'b');
      assert.equal(comp.len(), 0, "there should be no tags");
      add(comp, 'a');
      assert.equal(comp.len(), 1, "there should be one tag");
    });

    it("should fire onValidationReject when tag is rejected through validation", () => {
      let fireCount = 0;
      let onValidationReject = function (tags) {
        assert.deepEqual(tags, ['b']);
        fireCount += 1
      }
      let comp = mount(<TestComponent validationRegex={/a+/} onValidationReject={onValidationReject} />);
      add(comp, 'b');
      add(comp, 'a');
      assert.equal(fireCount, 1)
    })

    it("should add pass changed value to onChange", () => {
      let onChange = function (tags, changed, changedIndexes) {
        let oldTags = this.state.tags;
        if (oldTags.length < tags.length) {
          let newTags = oldTags.concat(changed)
          assert.deepEqual(newTags, tags, "the old tags plus changed should be the new tags");
          changedIndexes.forEach((i) => {
            assert.equal(newTags[i], changed[i - oldTags.length])
          })
        } else {
          let indexes = [];
          let newTags = oldTags.filter((t, i) => {
            let notRemoved = changed.indexOf(t) === -1;
            if (!notRemoved) {
              indexes.push(i);
            }
            return notRemoved;
          });
          assert.deepEqual(indexes, changedIndexes, "indexes should be the same");
          assert.deepEqual(newTags, tags, "the old tags minus changed should be the new tags");
        }
      }

      let comp = mount(<TestComponent addOnPaste={true} onChange={onChange} />);
      add(comp, 'a');
      add(comp, 'b');
      add(comp, 'c');
      paste(comp, 'd e f');
      remove(comp);
      remove(comp);
      remove(comp);
    });


    it("should disable input when component is disabled", () => {
      let comp = mount(<TestComponent disabled={true} />);
      assert.ok(comp.tagsinput().input.disabled, "input should be disabled");
    });

    describe('preventSubmit', () => {
      function addTagWithEventSpy(comp, tag, key = 'Enter') {
        change(comp, tag);
        const event = createEvent.keyDown(comp.input(), {key});
        const preventDefault = sinon.spy(event, 'preventDefault');

        fireEvent(comp.input(), event);
        return preventDefault;
      }

      describe("when to to true", () => {
        it("should prevent default submit event on enter key when adding a tag ", () => {
          let comp = mount(<TestComponent preventSubmit={true} />);

          const preventDefault = addTagWithEventSpy(comp, "Tag");
          assert.equal(preventDefault.called, true, "preventDefault was not called when it should be");
        });

        it("should prevent default submit on enter key when tag is empty when prop is true", () => {
          let comp = mount(<TestComponent preventSubmit={true} />);

          const preventDefault = addTagWithEventSpy(comp, "");
          assert.equal(preventDefault.called, true, "preventDefault was not called when it should be");
        });

        it("prevent default coverage", () => {
          let comp = mount(<TestComponent preventSubmit={true} />);

          const preventDefault = addTagWithEventSpy(comp, "", 'Tab');
          assert.equal(preventDefault.called, false, "preventDefault was not called when it should be");
        });
      });

      describe("when set to false", () => {
        it("should prevent default submit on enter key when tag is empty", () => {
          let comp = mount(<TestComponent preventSubmit={false} />);

          const preventDefault = addTagWithEventSpy(comp, "");
          assert.equal(preventDefault.called, true, "preventDefault was not called when it should have been");
          assert.deepEqual(comp.state.tags, ['']);
        });

        it("should still prevent default submit on enter key when tag is not empty and added", () => {
          let comp = mount(<TestComponent preventSubmit={false} />);

          const preventDefault = addTagWithEventSpy(comp, "A tag");
          assert.equal(preventDefault.called, true, "preventDefault was not called when it should have been");
        });

        it("should still prevent default submit event if a tag is rejected (unique etc..)", () => {
          let comp = mount(<TestComponent preventSubmit={false} onlyUnique={true} />);

          add(comp, "Tag", 13);
          const preventDefault = addTagWithEventSpy(comp, "Tag");

          assert.equal(preventDefault.called, true, "preventDefault was not called when it should have been");
        });
      });
    });

  });

  describe("methods", () => {
    it("should focus input", () => {
      let comp = mount(<TestComponent />);

      act(() => comp.tagsinput().focus());
    });

    it("should blur input", () => {
      let comp = mount(<TestComponent />);

      act(() => comp.tagsinput().blur());
    });

    it("should clear input", () => {
      let comp = mount(<TestComponent />);

      change(comp, "test");
      act(() => comp.tagsinput().clearInput());
      assert.equal(comp.tagsinput().state.tag, '', "there should be no tag value")
    });

    it("should add a tag with addTag", () => {
      let comp = mount(<TestComponent />);

      act(() => comp.tagsinput().addTag("test"));
      assert.equal(comp.len(), 1, "there should be one tag")
    });

    describe("componentDidUpdate", () => {
      it("updates the state", () => {
        class TestParent extends React.Component {
          constructor() {
            super()
            this.state = {currentValue: "init"};
          }

          render() {
            return <TestComponent ref={ref => { this.testComp = ref; }} currentValue={this.state.currentValue} />
          }
        }

        let parent = mount(<TestParent />);
        act(() => parent.setState({
          currentValue: "test"
        }));

        assert.equal(parent.testComp.props.currentValue, "test", "sets the correct value for currentValue")
      })

      it("does not modify the state", () => {
        class TestParent extends React.Component {
          constructor() {
            super()
            this.state = {currentValue: "init", fake: "fake"};
          }

          render() {
            return <TestComponent ref={ref => { this.testComp = ref; }} fake={this.state.fake} currentValue={this.state.currentValue} />
          }
        }

        let parent = mount(<TestParent />);
        act(() => parent.setState({
          fake: "test"
        }));

        assert.equal(parent.testComp.props.currentValue, "init", "does not modify currentValue")
      })
    });
  });

  describe("coverage", () => {
    it("not remove no existant index", () => {
      let comp = mount(<TestComponent />);

      act(() => comp.tagsinput()._removeTag(1));
    });

    it("should test prevent default", () => {
      let comp = mount(<TestComponent onlyUnique={true} value={["test"]} />);

      add(comp, "test", 9);
    });

    it("should do nothing if default is prevented on input", () => {
      function renderInput (props) {
        let {onChange, value, addTag, onKeyDown, ...other} = props
        let keyDown = (e) => {
          e.preventDefault()
          onKeyDown(e)
        }

        return (
          <input type='text' onChange={onChange} value={value} onKeyDown={keyDown} {...other} />
        )
      }

      let comp = mount(<TestComponent renderInput={renderInput} />);

      add(comp, "test", 13);
    });

    it("should not focus on an input that does not have focus method", () => {
      class Empty extends React.Component {
        render () {
          return (
            <span>
              {this.props.children}
            </span>
          );
        }
      }

      function renderInput (props) {
        let {onChange, value, addTag, ref, ...other} = props

        return (
          <Empty ref={ref}>
            <input type='text' onChange={onChange} value={value} {...other} />
          </Empty>
        )
      }

      let comp = mount(<TestComponent renderInput={renderInput} />);

      act(() => comp.tagsinput().blur());
      act(() => comp.tagsinput().focus());
    });
  });

  describe("controlled", () => {
    it("should control input", () => {
      let comp = mount(<TestComponent inputValue="" onChangeInput={() => {}} />);

      add(comp, '');
      assert.equal(comp.len(), 0, "there should be no tags");
      act(() => comp.tagsinput()._clearInput());
    });
  });

  describe("bugs", () => {
    it("should not add empty tags", () => {
      let comp = mount(<TestComponent />);

      add(comp, '');
      assert.equal(comp.len(), 0, "there should be no tags");
    });

    it("should not override default input props", () => {
      let comp = mount(<TestComponent inputProps={{placeholder: "test"}}/>);

      assert.equal(comp.tagsinput().inputProps().className, "react-tagsinput-input", "should have the default className");
    });

    it("should override default input props", () => {
      let comp = mount(<TestComponent inputProps={{className: "test"}}/>);

      assert.equal(comp.tagsinput().inputProps().className, "test", "should not have the default className");
    });

    it("should be able to add objects to tags", () => {
      let comp = mount(<TestComponent renderTag={({key}) => <span key={key} />} />);

      act(() => comp.tagsinput().addTag({name: "test"}));
    });

    it("should not add a tag on blur if it is empty", () => {
      let comp = mount(<TestComponent addOnBlur />);
      let tag = "";

      change(comp, tag);
      blur(comp);

      assert.equal(comp.len(), 0, "there should be no tag");
    });

    it("should trim unique tags", () => {
      let comp = mount(<TestComponent onlyUnique={true} />);
      let tag = "  " + randstring() + " ";

      change(comp, tag);
      keyDown(comp, 13, 'Enter');
      change(comp, tag);
      keyDown(comp, 13, 'Enter');
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag.trim(), "and it should be trimmed");
    });

    it("should not trim object unique tags", () => {
      let comp = mount(<TestComponent onlyUnique={true} tagDisplayProp="label" />);

      let tag = {
        label: "Test",
        value: "test"
      };

      act(() => comp.tagsinput().addTag(tag));
      act(() => comp.tagsinput().addTag(tag));

      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "and it should be the same object");
    });
  });
});
