const { JSDOM }= require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html>`);
global.document = dom.window.document;
global.window = dom.window;
Object.defineProperty(global, 'navigator', {configurable: true, value: window.navigator});
global.IS_REACT_ACT_ENVIRONMENT = true;

const TagsInput = require("../src").default;

const React = require("react");
const { act } = React;
const { flushSync } = require('react-dom');
const { renderToStaticMarkup } = require('react-dom/server');
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

    it("should trigger onPaste on input", () => {
      let pasted = false;

      let comp = mount(<TestComponent inputProps={{onPaste: () => { pasted = true; }}} />);

      paste(comp, randstring());

      assert.ok(pasted, "should have pasted");
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
        it("should allow submission when the input is empty", () => {
          let comp = mount(<TestComponent preventSubmit={false} />);

          const preventDefault = addTagWithEventSpy(comp, "");
          assert.equal(preventDefault.called, false);
          assert.deepEqual(comp.state.tags, []);
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
    [false, true].forEach(controlled => {
      [
        {name: "invalid", props: {validationRegex: /^valid$/}, tag: "draft", clear: false},
        {name: "duplicate", props: {onlyUnique: true, value: ["draft"]}, tag: "draft", clear: true},
        {name: "over-limit", props: {maxTags: 0}, tag: "draft", clear: true},
        {name: "blank", props: {}, tag: "   ", clear: true}
      ].forEach(({name, props, tag, clear}) => {
        it(`should ${clear ? "clear" : "retain"} ${name} ${controlled ? "controlled" : "uncontrolled"} input`, () => {
          const onChange = sinon.spy();
          const onChangeInput = sinon.spy();
          const comp = mount(<TagsInput
            value={[]}
            onChange={onChange}
            currentValue={tag}
            {...props}
            {...(controlled ? {inputValue: tag, onChangeInput} : {})}
          />);

          act(() => assert.strictEqual(comp.accept(), false));

          assert.equal(onChange.called, false);
          assert.equal(comp.input.value, controlled || !clear ? tag : "");
          assert.deepStrictEqual(onChangeInput.args, controlled && clear ? [[""]] : []);
        });
      });
    });

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

  describe("compatibility", () => {
    it("should preserve validation and change callback order", () => {
      const calls = [];
      const comp = mount(<TestComponent
        value={["duplicate"]}
        inputValue="draft"
        onChangeInput={value => calls.push(["input", value])}
        onChange={(...args) => calls.push(["change", ...args])}
        onlyUnique
        addOnPaste
        pasteSplit={text => text.split(",")}
        validate={tag => {
          calls.push(["validate", tag]);
          return tag !== "invalid";
        }}
        onValidationReject={tags => calls.push(["reject", tags])}
      />);

      paste(comp, "duplicate, ,invalid, valid ,valid");

      assert.deepStrictEqual(calls, [
        ["validate", "invalid"],
        ["validate", "valid"],
        ["reject", ["invalid"]],
        ["change", ["duplicate", "valid"], ["valid"], [1]],
        ["input", ""]
      ]);
    });

    it("should preserve whitespace when onlyUnique is false", () => {
      const comp = mount(<TestComponent />);

      add(comp, " alpha ");

      assert.deepStrictEqual(comp.state.tags, [" alpha "]);
    });

    it("should keep subclass methods bound", () => {
      class CustomTagsInput extends TagsInput {
        addTag(tag) {
          return super.addTag(tag.toUpperCase());
        }
      }

      const onChange = sinon.spy();
      const comp = mount(<CustomTagsInput value={[]} onChange={onChange} />);
      const {addTag} = comp;

      act(() => assert.strictEqual(addTag("alpha"), true));

      assert.deepStrictEqual(onChange.firstCall.args, [["ALPHA"], ["ALPHA"], [0]]);
    });

    it("should release replaced and unmounted callback refs", () => {
      const firstRef = sinon.spy();
      const secondRef = sinon.spy();
      const onChange = () => {};
      const view = render(<TagsInput value={[]} onChange={onChange} inputProps={{ref: firstRef}} />);
      const input = view.container.querySelector("input");

      assert.ok(firstRef.lastCall.args[0] === input);

      view.rerender(<TagsInput value={[]} onChange={onChange} inputProps={{ref: secondRef}} />);

      assert.strictEqual(firstRef.lastCall.args[0], null);
      assert.ok(secondRef.lastCall.args[0] === input);

      view.unmount();

      assert.strictEqual(secondRef.lastCall.args[0], null);
    });

    it("should preserve renderer prop overrides", () => {
      const onRemove = sinon.spy();
      const comp = mount(<TestComponent
        value={["alpha"]}
        disabled
        currentValue="draft"
        tagProps={{disabled: false, onRemove, className: "custom-tag"}}
        inputProps={{disabled: false, value: "visible", type: "search"}}
      />);

      assert.equal(comp.input().value, "visible");
      assert.equal(comp.input().type, "search");
      assert.equal(comp.input().disabled, true);

      click(allTag(comp, "a")[0]);

      assert.deepStrictEqual(onRemove.args, [[0]]);
      assert.equal(allClass(comp, "custom-tag").length, 1);
    });

    it("should use inputValue as an editable default without onChangeInput", () => {
      const comp = mount(<TestComponent inputValue="default" />);

      assert.equal(comp.input().value, "default");

      add(comp, "edited");

      assert.deepStrictEqual(comp.state.tags, ["edited"]);
      assert.equal(comp.input().value, "");
    });

    it("should prioritize currentValue for uncontrolled input", () => {
      const comp = mount(<TestComponent currentValue="current" inputValue="input" />);

      assert.equal(comp.input().value, "current");
    });

    it("should prioritize inputValue for controlled input", () => {
      const comp = mount(<TestComponent currentValue="current" inputValue="input" onChangeInput={() => {}} />);

      assert.equal(comp.input().value, "input");
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

    it("should not add a whitespace-only tag", () => {
      let comp = mount(<TestComponent />);

      add(comp, "   ");
      assert.equal(comp.len(), 0, "there should be no tags, whitespace-only tags should be rejected like empty ones");
    });

    it("should dedupe unique object tags within the same batch", () => {
      let comp = mount(<TestComponent addOnPaste={true} onlyUnique={true} tagDisplayProp="label" />);

      paste(comp, "a a");
      assert.equal(comp.len(), 1, "there should be one tag, duplicates pasted together should be deduped too");
    });

    it("should dedupe unique tags that differ only in whitespace", () => {
      let comp = mount(<TestComponent addOnPaste={true} onlyUnique={true} pasteSplit={(data) => data.split(",")} />);

      paste(comp, "a ,a");
      assert.equal(comp.len(), 1, "there should be one tag, tags are trimmed after they are deduped");
    });

    it("should add a tag that matches a global validationRegex", () => {
      let rejected = [];
      let comp = mount(<TestComponent validationRegex={/a+/g} onValidationReject={(tags) => rejected.push(tags)} />);

      add(comp, "a");
      assert.equal(comp.len(), 1, "the tag is valid, but the regex is tested twice and lastIndex is not reset");
      assert.equal(rejected.length, 0, "no tag should be rejected");
    });

    it("should not call inputProps.onFocus without an event", () => {
      let events = [];
      let comp = mount(<TestComponent inputProps={{onFocus: (e) => events.push(e)}} />);

      act(() => comp.tagsinput().focus());

      assert.ok(events.length > 0, "onFocus should be called");
      assert.ok(events.every(e => e != null), "onFocus should never be called without an event");
    });

    it("should clear the input when currentValue changes to empty", () => {
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
      act(() => parent.setState({currentValue: ""}));

      assert.equal(parent.testComp.input().value, "", "the input should be empty");
    });

    it("should still add tags when inputProps has an onKeyDown", () => {
      let called = false;
      let comp = mount(<TestComponent inputProps={{onKeyDown: () => { called = true; }}} />);

      add(comp, "a");
      assert.ok(called, "the onKeyDown of inputProps should be called");
      assert.equal(comp.len(), 1, "the onKeyDown of inputProps should not replace the handler of the component");
    });

    it("should reject whitespace-only unique tags", () => {
      const comp = mount(<TestComponent onlyUnique />);

      add(comp, "   ");

      assert.deepStrictEqual(comp.state.tags, []);
    });

    it("should skip empty paste fragments before applying maxTags", () => {
      const comp = mount(<TestComponent addOnPaste maxTags={2} />);

      paste(comp, " alpha  beta ");

      assert.deepStrictEqual(comp.state.tags, ["alpha", "beta"]);
    });

    it("should respect paste cancellation", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent
        addOnPaste
        onChange={onChange}
        inputProps={{onPaste: e => e.preventDefault()}}
      />);

      change(comp, "draft");
      paste(comp, "alpha beta");

      assert.equal(onChange.called, false);
      assert.equal(comp.input().value, "draft");
    });

    it("should allow Enter to submit after adding a tag when preventSubmit is false", () => {
      const comp = mount(<TestComponent preventSubmit={false} />);

      add(comp, "alpha");
      const event = createEvent.keyDown(comp.input(), {key: "Enter", keyCode: 13});
      fireEvent(comp.input(), event);

      assert.equal(event.defaultPrevented, false);
      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
    });

    it("should leave Enter to the IME during composition", () => {
      const comp = mount(<TestComponent />);

      fireEvent.compositionStart(comp.input());
      change(comp, "日本");
      const event = createEvent.keyDown(comp.input(), {
        key: "Enter", keyCode: 13, isComposing: true
      });
      fireEvent(comp.input(), event);

      assert.deepStrictEqual(comp.state.tags, []);
      assert.equal(comp.input().value, "日本");
      assert.equal(event.defaultPrevented, false);
    });

    it("should leave Backspace to the IME during composition", () => {
      const comp = mount(<TestComponent />);

      add(comp, "alpha");
      fireEvent.compositionStart(comp.input());
      const event = createEvent.keyDown(comp.input(), {
        key: "Backspace", keyCode: 8, isComposing: true
      });
      fireEvent(comp.input(), event);

      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
      assert.equal(event.defaultPrevented, false);
    });

    it("should leave key code 229 to the IME", () => {
      const comp = mount(<TestComponent />);

      change(comp, "日本");
      const event = createEvent.keyDown(comp.input(), {key: "Enter", keyCode: 229});
      fireEvent(comp.input(), event);

      assert.deepStrictEqual(comp.state.tags, []);
      assert.equal(comp.input().value, "日本");
      assert.equal(event.defaultPrevented, false);
    });

    it("should accept an object tag displaying zero", () => {
      const comp = mount(<TestComponent tagDisplayProp="label" />);
      const tag = {label: 0};

      act(() => comp.tagsinput().addTag(tag));

      assert.deepStrictEqual(comp.state.tags, [tag]);
    });

    it("should not mark a disabled input focused when clicked", () => {
      const comp = mount(<TestComponent disabled />);

      click(comp.div());

      assert.notStrictEqual(document.activeElement, comp.input());
      assert.equal(comp.div().classList.contains("react-tagsinput--focused"), false);
    });

    [null, undefined].forEach(label => {
      it(`should ignore an object tag displaying ${label}`, () => {
        const onChange = sinon.spy();
        const comp = mount(<TestComponent tagDisplayProp="label" onChange={onChange} />);
        let added;

        act(() => { added = comp.tagsinput().addTag({label}); });

        assert.strictEqual(added, false);
        assert.deepStrictEqual(comp.state.tags, []);
        assert.equal(onChange.called, false);
      });
    });

    it("should retain tags added before React flushes updates", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent onChange={onChange} />);

      act(() => {
        comp.tagsinput().addTag("alpha");
        comp.tagsinput().addTag("beta");
      });

      assert.deepStrictEqual(comp.state.tags, ["alpha", "beta"]);
      assert.deepStrictEqual(onChange.args, [
        [["alpha"], ["alpha"], [0]],
        [["alpha", "beta"], ["beta"], [1]]
      ]);
    });

    it("should enforce onlyUnique across batched additions", () => {
      const comp = mount(<TestComponent onlyUnique />);

      act(() => {
        comp.tagsinput().addTag("alpha");
        assert.strictEqual(comp.tagsinput().addTag("alpha"), false);
        comp.tagsinput().addTag("beta");
      });

      assert.deepStrictEqual(comp.state.tags, ["alpha", "beta"]);
    });

    it("should enforce maxTags across batched additions", () => {
      const comp = mount(<TestComponent maxTags={1} />);

      act(() => {
        comp.tagsinput().addTag("alpha");
        assert.strictEqual(comp.tagsinput().addTag("beta"), false);
      });

      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
    });

    it("should retain removals when adding within the same batch", () => {
      const comp = mount(<TestComponent />);
      add(comp, "alpha");

      act(() => {
        comp.tagsinput().handleRemove(0);
        comp.tagsinput().addTag("beta");
      });

      assert.deepStrictEqual(comp.state.tags, ["beta"]);
    });

    it("should discard pending changes when the parent keeps its value", () => {
      const onChange = sinon.spy();
      const comp = mount(<TagsInput
        value={[]}
        onChange={onChange}
        inputValue=""
        onChangeInput={() => {}}
      />);

      act(() => comp.addTag("alpha"));
      act(() => comp.addTag("beta"));

      assert.deepStrictEqual(onChange.lastCall.args, [["beta"], ["beta"], [0]]);
    });

    it("should render currentValue on the server", () => {
      const markup = renderToStaticMarkup(<TestComponent currentValue="draft" />);
      const container = document.createElement("div");
      container.innerHTML = markup;

      assert.equal(container.querySelector("input").value, "draft");
    });

    it("should accept the input only once within a batch", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent onChange={onChange} />);
      const accepted = [];

      change(comp, "alpha");
      act(() => {
        accepted.push(comp.tagsinput().accept());
        accepted.push(comp.tagsinput().accept());
      });

      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
      assert.deepStrictEqual(accepted, [true, false]);
      assert.equal(onChange.callCount, 1);
      assert.equal(comp.input().value, "");
    });

    it("should dedupe against existing tags with surrounding whitespace", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent onlyUnique onChange={onChange} />);

      act(() => comp.setState({tags: [" alpha "]}));
      add(comp, " alpha ");

      assert.deepStrictEqual(comp.state.tags, [" alpha "]);
      assert.equal(onChange.called, false);
    });

    it("should reconcile pending clears when the controlled input stays unchanged", () => {
      const onChangeInput = sinon.spy();
      const comp = mount(<TestComponent inputValue="alpha" onChangeInput={onChangeInput} />);
      const accepted = [];

      act(() => comp.tagsinput().clearInput());
      act(() => {
        accepted.push(comp.tagsinput().accept());
        accepted.push(comp.tagsinput().accept());
      });

      assert.deepStrictEqual(accepted, [true, false]);
      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
      assert.equal(comp.input().value, "alpha");
      assert.deepStrictEqual(onChangeInput.args, [[""], [""]]);

      act(() => comp.tagsinput().accept());

      assert.deepStrictEqual(comp.state.tags, ["alpha", "alpha"]);
    });

    it("should enforce maxTags after onValidationReject adds a fallback", () => {
      const comp = mount(<TestComponent
        addOnPaste
        maxTags={1}
        validate={tag => tag !== "invalid"}
        onValidationReject={() => comp.tagsinput().addTag("fallback")}
      />);

      paste(comp, "invalid alpha");

      assert.deepStrictEqual(comp.state.tags, ["fallback"]);
    });

    it("should enforce onlyUnique after onValidationReject adds a tag", () => {
      const comp = mount(<TestComponent
        addOnPaste
        onlyUnique
        validate={tag => tag !== "invalid"}
        onValidationReject={() => comp.tagsinput().addTag("alpha")}
      />);

      paste(comp, "invalid alpha");

      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
    });

    it("should report indexes after onValidationReject adds a tag", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent
        addOnPaste
        onChange={onChange}
        validate={tag => tag !== "invalid"}
        onValidationReject={() => comp.tagsinput().addTag("fallback")}
      />);

      paste(comp, "invalid alpha");

      assert.deepStrictEqual(comp.state.tags, ["fallback", "alpha"]);
      assert.deepStrictEqual(onChange.args, [
        [["fallback"], ["fallback"], [0]],
        [["fallback", "alpha"], ["alpha"], [1]]
      ]);
    });

    it("should not add an accepted tag again on blur within a batch", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent addOnBlur onChange={onChange} />);

      change(comp, "alpha");
      act(() => comp.tagsinput().focus());

      act(() => {
        comp.tagsinput().accept();
        comp.tagsinput().blur();
      });

      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
      assert.equal(onChange.callCount, 1);
      assert.equal(comp.input().value, "");
    });

    it("should not add a tag twice when onChange blurs the input", () => {
      const onChange = sinon.spy(() => comp.tagsinput().blur());
      const comp = mount(<TestComponent addOnBlur onChange={onChange} />);

      act(() => comp.tagsinput().focus());
      add(comp, "alpha");

      assert.deepStrictEqual(onChange.args, [
        [["alpha"], ["alpha"], [0]]
      ]);
      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
      assert.equal(comp.input().value, "");
    });

    it("should not add a cleared input on blur within a batch", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent addOnBlur onChange={onChange} />);

      change(comp, "alpha");
      act(() => comp.tagsinput().focus());

      act(() => {
        comp.tagsinput().clearInput();
        comp.tagsinput().blur();
      });

      assert.deepStrictEqual(comp.state.tags, []);
      assert.equal(onChange.called, false);
      assert.equal(comp.input().value, "");
    });

    it("should remain unfocused when onFocus blurs the input", () => {
      const comp = mount(<TestComponent
        inputProps={{onFocus: e => e.target.blur()}}
      />);

      act(() => comp.tagsinput().focus());

      assert.notStrictEqual(document.activeElement, comp.input());
      assert.equal(comp.div().classList.contains("react-tagsinput--focused"), false);
    });

    it("should remain focused when onBlur refocuses the input", () => {
      const comp = mount(<TestComponent
        inputProps={{onBlur: e => e.target.focus()}}
      />);

      act(() => comp.tagsinput().focus());
      act(() => comp.tagsinput().blur());

      assert.strictEqual(document.activeElement, comp.input());
      assert.equal(comp.div().classList.contains("react-tagsinput--focused"), true);
    });

    [null, undefined].forEach(label => {
      it(`should skip validation for an object tag displaying ${label}`, () => {
        const validate = sinon.spy(tag => tag.trim().length > 0);
        const comp = mount(<TestComponent tagDisplayProp="label" validate={validate} />);
        let added;

        act(() => { added = comp.tagsinput().addTag({label}); });

        assert.strictEqual(added, false);
        assert.deepStrictEqual(comp.state.tags, []);
        assert.equal(validate.called, false);
      });
    });

    it("should not reject empty paste fragments", () => {
      const onValidationReject = sinon.spy();
      const comp = mount(<TestComponent
        addOnPaste
        validationRegex={/^[a-z]+$/}
        onValidationReject={onValidationReject}
      />);

      paste(comp, " alpha  beta ");

      assert.deepStrictEqual(comp.state.tags, ["alpha", "beta"]);
      assert.equal(onValidationReject.called, false);
    });

    it("should not duplicate a tag when onChange flushes updates before blur", () => {
      const onChange = sinon.spy(function (tags) {
        flushSync(() => this.setState({tags}));
        this.tagsinput().blur();
      });
      const comp = mount(<TestComponent addOnBlur onChange={onChange} />);

      act(() => comp.tagsinput().focus());
      add(comp, "alpha");

      assert.deepStrictEqual(onChange.args, [
        [["alpha"], ["alpha"], [0]]
      ]);
      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
      assert.equal(comp.input().value, "");
    });

    it("should remove the clicked tags before React flushes updates", () => {
      const comp = mount(<TestComponent addOnPaste />);

      paste(comp, "alpha beta gamma");
      const removes = Array.from(allTag(comp, "a"));

      act(() => {
        click(removes[0]);
        click(removes[1]);
      });

      assert.deepStrictEqual(comp.state.tags, ["gamma"]);
    });

    it("should focus the input when inputProps supplies a ref", () => {
      const ref = React.createRef();
      const comp = mount(<TestComponent inputProps={{ref}} />);

      // Never pass DOM nodes to strictEqual, the failure message exhausts memory.
      assert.ok(ref.current === comp.div().querySelector("input"));

      act(() => comp.tagsinput().focus());

      assert.ok(document.activeElement === ref.current);
    });

    it("should enforce onlyUnique after validate adds a tag", () => {
      let added = false;
      const comp = mount(<TestComponent
        onlyUnique
        validate={tag => {
          if (!added) {
            added = true;
            comp.tagsinput().addTag(tag);
          }

          return true;
        }}
      />);

      add(comp, "alpha");

      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
    });

    it("should remove a clicked tag only once within a batch", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent addOnPaste onChange={onChange} />);

      paste(comp, "alpha beta gamma");
      onChange.resetHistory();
      const remove = allTag(comp, "a")[0];

      act(() => {
        click(remove);
        click(remove);
      });

      assert.deepStrictEqual(comp.state.tags, ["beta", "gamma"]);
      assert.deepStrictEqual(onChange.args, [
        [["beta", "gamma"], ["alpha"], [0]]
      ]);
    });

    it("should reset a global validationRegex after validate adds a tag", () => {
      const onValidationReject = sinon.spy();
      const comp = mount(<TestComponent
        validationRegex={/^[a-z]+$/g}
        onValidationReject={onValidationReject}
        validate={tag => {
          if (tag === "alpha") {
            comp.tagsinput().addTag("beta");
          }

          return true;
        }}
      />);

      add(comp, "alpha");

      assert.deepStrictEqual(comp.state.tags, ["beta", "alpha"]);
      assert.equal(onValidationReject.called, false);
    });

    it("should clear currentValue when an uncontrolled inputValue is present", () => {
      const onChange = sinon.spy();
      const view = render(<TagsInput
        value={[]}
        onChange={onChange}
        currentValue="draft"
        inputValue="default"
      />);

      view.rerender(<TagsInput
        value={[]}
        onChange={onChange}
        currentValue=""
        inputValue="default"
      />);

      assert.equal(view.container.querySelector("input").value, "");
      assert.equal(onChange.called, false);
    });

    it("should apply a new currentValue matching the original inputValue", () => {
      const onChange = sinon.spy();
      const view = render(<TagsInput value={[]} onChange={onChange} inputValue="alpha" />);
      const input = view.container.querySelector("input");

      fireEvent.change(input, {target: {value: "draft"}});
      assert.equal(input.value, "draft");

      view.rerender(<TagsInput
        value={[]}
        onChange={onChange}
        inputValue="alpha"
        currentValue="alpha"
      />);

      assert.equal(input.value, "alpha");
      assert.equal(onChange.called, false);
    });

    it("should run input ref cleanup on unmount", () => {
      const cleanupRef = sinon.spy();
      const ref = sinon.spy(input => input ? cleanupRef : undefined);
      const componentRef = React.createRef();
      const view = render(<TagsInput ref={componentRef} value={[]} onChange={() => {}} inputProps={{ref}} />);
      const comp = componentRef.current;

      assert.equal(ref.callCount, 1);
      assert.ok(ref.firstCall.args[0] === view.container.querySelector("input"));

      view.unmount();

      assert.equal(cleanupRef.callCount, 1);
      assert.equal(ref.callCount, 1);
      assert.strictEqual(comp.input, null);
    });

    it("should not remove a replacement tag through a stale click after Backspace", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent addOnPaste onChange={onChange} />);

      paste(comp, "alpha beta");
      onChange.resetHistory();
      const removeBeta = allTag(comp, "a")[1];

      act(() => {
        keyDown(comp, 8, "Backspace");
        comp.tagsinput().addTag("gamma");
        click(removeBeta);
      });

      assert.deepStrictEqual(comp.state.tags, ["alpha", "gamma"]);
      assert.deepStrictEqual(onChange.args, [
        [["alpha"], ["beta"], [1]],
        [["alpha", "gamma"], ["gamma"], [1]]
      ]);
    });

    it("should clean up a replaced input ref", () => {
      const cleanupRef = sinon.spy();
      const firstRef = sinon.spy(input => input ? cleanupRef : undefined);
      const secondRef = React.createRef();
      const componentRef = React.createRef();
      const onChange = () => {};
      const view = render(<TagsInput
        ref={componentRef} value={[]} onChange={onChange} inputProps={{ref: firstRef}}
      />);
      const input = view.container.querySelector("input");

      view.rerender(<TagsInput
        ref={componentRef} value={[]} onChange={onChange} inputProps={{ref: secondRef}}
      />);

      assert.equal(cleanupRef.callCount, 1);
      assert.equal(firstRef.callCount, 1);
      assert.ok(secondRef.current === input);
      assert.ok(componentRef.current.input === input);
    });

    it("should track clicked and keyboard removals across pending additions", () => {
      const comp = mount(<TestComponent addOnPaste />);

      paste(comp, "alpha beta gamma");
      const removes = Array.from(allTag(comp, "a"));

      act(() => {
        click(removes[0]);
        comp.tagsinput().addTag("delta");
        keyDown(comp, 8, "Backspace");
        keyDown(comp, 8, "Backspace");
        comp.tagsinput().addTag("epsilon");
        click(removes[2]);
        click(removes[1]);
      });

      assert.deepStrictEqual(comp.state.tags, ["epsilon"]);
    });

    it("should keep a stable input ref attached while typing", () => {
      const cleanupRef = sinon.spy();
      const ref = sinon.spy(input => input ? cleanupRef : undefined);
      const comp = mount(<TestComponent inputProps={{ref}} />);
      const input = comp.input();

      change(comp, "alpha");

      assert.ok(comp.input() === input);
      assert.equal(cleanupRef.callCount, 0);
      assert.equal(ref.callCount, 1);
    });

    [null, undefined].forEach(tag => {
      it(`should ignore ${tag} when tagDisplayProp is set`, () => {
        const onChange = sinon.spy();
        const comp = mount(<TestComponent tagDisplayProp="label" onChange={onChange} />);
        let added;

        act(() => { added = comp.tagsinput().addTag(tag); });

        assert.strictEqual(added, false);
        assert.deepStrictEqual(comp.state.tags, []);
        assert.equal(onChange.called, false);
      });
    });

    it("should retain the latest inputValue when onChangeInput is removed", () => {
      const onChange = sinon.spy();
      const onChangeInput = sinon.spy();
      const view = render(<TagsInput
        value={[]} onChange={onChange} inputValue="alpha" onChangeInput={onChangeInput}
      />);

      view.rerender(<TagsInput
        value={[]} onChange={onChange} inputValue="beta" onChangeInput={onChangeInput}
      />);
      assert.equal(view.container.querySelector("input").value, "beta");

      view.rerender(<TagsInput value={[]} onChange={onChange} inputValue="beta" />);

      assert.equal(view.container.querySelector("input").value, "beta");
      assert.equal(onChange.called, false);
    });

    it("should accept the visible inputProps value", () => {
      const comp = mount(<TestComponent inputProps={{value: "alpha"}} />);

      assert.equal(comp.input().value, "alpha");

      act(() => comp.tagsinput().accept());

      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
    });

    it("should not remove tags while inputProps.value is nonempty", () => {
      const comp = mount(<TestComponent inputProps={{value: "draft"}} />);

      act(() => comp.tagsinput().addTag("alpha"));
      keyDown(comp, 8, "Backspace");

      assert.deepStrictEqual(comp.state.tags, ["alpha"]);
      assert.equal(comp.input().value, "draft");
    });

    it("should not accept hidden inputValue when inputProps.value is empty", () => {
      const comp = mount(<TestComponent
        inputValue="hidden" onChangeInput={() => {}} inputProps={{value: ""}}
      />);

      act(() => assert.strictEqual(comp.tagsinput().accept(), false));

      assert.deepStrictEqual(comp.state.tags, []);
      assert.equal(comp.input().value, "");
    });

    it("should allow Enter to submit after clearing within a batch", () => {
      const comp = mount(<TestComponent preventSubmit={false} />);

      change(comp, "draft");
      const event = createEvent.keyDown(comp.input(), {key: "Enter", keyCode: 13});

      act(() => {
        comp.tagsinput().clearInput();
        fireEvent(comp.input(), event);
      });

      assert.equal(comp.input().value, "");
      assert.deepStrictEqual(comp.state.tags, []);
      assert.equal(event.defaultPrevented, false);
    });

    it("should remove the last tag after clearing within a batch", () => {
      const onChange = sinon.spy();
      const comp = mount(<TestComponent onChange={onChange} />);

      add(comp, "alpha");
      change(comp, "draft");
      onChange.resetHistory();

      act(() => {
        comp.tagsinput().clearInput();
        keyDown(comp, 8, "Backspace");
      });

      assert.equal(comp.input().value, "");
      assert.deepStrictEqual(comp.state.tags, []);
      assert.deepStrictEqual(onChange.args, [[[], ["alpha"], [0]]]);
    });

    it("should use currentValue when inputProps.value is undefined", () => {
      const comp = mount(<TestComponent currentValue="draft" inputProps={{value: undefined}} />);

      assert.equal(comp.input().value, "draft");
    });
  });
});
