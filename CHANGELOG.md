### 3.18.0 (2017-09-16)

* Match on key as well as keyCode.

### 3.17.0 (2017-06-07)

* Ensure input is not cleared when input fails regex validation.

### 3.16.0 (2017-04-09)

* Add `preventSubmit`.

### 3.15.0 (2017-02-12)

* Add `onValidationReject`.

### 3.14.1 (2017-02-11)

* Update README and fix examples.

### 3.14.0 (2016-12-07)

* Add `inputValue` and `onChangeInput` which allows control of input.

### 3.13.6 (2016-10-11)

* Fix input focusing error.

### 3.13.5 (2016-09-20)

* README fix.

### 3.13.4 (2016-08-25)

* Returned back ability to add non-string entities as tags.

### 3.13.3 (2016-08-22)

* Add guards to focus and blur methods so they are not called on elements that do not have them.

### 3.13.2 (2016-08-22)

* Fix auto suggest behaviour.

### 3.13.1 (2016-08-02)

* Fix for `currentValue`.

### 3.13.0 (2016-07-31)

* Add `currentValue`.

### 3.12.0 (2016-07-19)

* Add `tagDisplayProp`.

### 3.11.0 (2016-07-14)

* Add `addTag` to inputProps.
* Prevent enter key down on input submitting forms.

### 3.10.0 (2016-07-06)

* Add `disabled` prop.
* Fix warnings in React 15.2.x.

### 3.9.1 (2016-06-30)

* Fix clipboardData on IE.

### 3.9.0 (2016-06-23)

* Add methods `addTag` and `clearInput` methods.

### 3.8.2 (2016-06-20)

* Fix tab behaviour, only prevent default if `onChange` was called.

### 3.8.1 (2016-06-10)

* Retain the default `inputProps`.

### 3.8.0 (2016-06-08)

* Add `focusedClassName` prop.

### 3.7.0 (2016-05-18)

* Add `accept` method.

### 3.6.2 (2016-05-12)

* Add `changed` and `changedIndexes` argument to `onChange`.

### 3.6.1 (2016-05-06)

* Regression from 1.4.6 when blocking tab.

### 3.6.0 (2016-04-23)

* Paste support.

### 3.5.0 (2016-04-11)

* React version 15.0

### 3.3.0 (2016-02-21)

* add `maxTags` prop.

### 3.2.0 (2016-02-15)

* add `onlyUnique` prop.

### 3.1.0 (2016-01-16)

* add `addOnBlur` prop.

### 3.0.3 (2015-11-24)

* add `renderLayout` prop.

### 3.0.2 (2015-11-09)

* Handle `inputProps` `onChange` correctly.

### 3.0.1 (2015-11-07)

* Add `classNameRemove` to `tagProps`.

### 3.0.0 (2015-10-31)

* Drop support for uncontrolled mode.
* Refactor code.

### 2.0.1 (2015-10-28)

* Add dipslay name.

### 2.0.0 (2015-10-13)

* Update to use React 0.14 by default.

### 1.4.7 (2015-10-12)

* Add name property to the input.

### 1.4.6 (2015-09-30)

* Should not block tab on empty.

### 1.4.5 (2015-09-30)

* Add `onFocus` prop.

### 1.4.4 (2015-09-24)

* Add `maxLength` prop.

### 1.4.3 (2015-08-18)

* `blur` method for tag input.

### 1.4.2 (2015-08-18)

* `required` prop for input.

### 1.4.1 (2015-08-09)

* `style` prop for styling top div.

### 1.4.0 (2015-07-23)

* `renderTag` prop for custom rendering of tags.

### 1.3.9 (2015-07-09)

* Define React as a peer dependency.

### 1.3.8 (2015-07-08)

* Add `classNames` prop for setting all classes on elements.
* Rename `clear` to `clearInput` and use `clear` for clearing entire component of tags.

### 1.3.7 (2015-06-19)

* Add onClick to component.

### 1.3.6 (2015-06-23)

* Add beforeTagAdd and beforeTagRemove props.

### 1.3.5 (2015-05-30)

* Add clear method.
* Add onKeyDown and onKeyUp props.
* When clicking on the component focus on the input.

### 1.3.2 (2015-04-29)

* Ignore falsey values from `transform`.

### 1.3.1 (2015-04-28)

* Added prop `validateAsync` to fix bugs in async validation.

### 1.3.0 (2015-04-26)

* Added option for async `validate`.

### 1.2.0 (2015-04-21)

* Allow for non-strings as tags.
* Move space from component to css.

### 1.1.0 (2015-04-17)

* Add uncontrolled usage.
* Add defaultValue prop.

### 1.0.0 (2015-04-15)

* Remove tags from internal state, TagsInput now behaves as other react
  input elements taking its value from a prop.
* Remove onBeforeTagAdd, onBeforeTagRemove.
* Rename method `inputFocus` to `focus`.
* Rename prop `tags` to `value`.
* Add transform.

### 0.3.1 (2015-01-20)

* Add `onBlur` event

### 0.2.3 (2015-01-20)

* Add prop `classNamespace`, for namespacing CSS classes.

### 0.2.0 (2015-01-07)

* Add [UMD](https://github.com/umdjs/umd) support
* Get rid of warnings `"Something is calling a React component directly. Use a factory or JSX instead"`
* Get rid of deprecated `transferPropsTo`
* Update CSS styles
* Add usage example

### 0.1.1 (2014-10-16)

* `validate` prop which is a function that returns true if a tag is valid.
* Add tag when input is blurred.
* `addKeys` prop which defines key code that add a tag, default is Tab (9) and Enter (13)
