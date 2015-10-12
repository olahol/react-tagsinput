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
