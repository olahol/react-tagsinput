import React from 'react'
import PropTypes from 'prop-types'

function trim (value) {
  return typeof value === 'string' ? value.trim() : value
}

function hasValue (value) {
  const trimmed = trim(value)

  return trimmed === 0 || Boolean(trimmed)
}

function matchesKey (keys, keyCode, key) {
  return keys.indexOf(keyCode) !== -1 || keys.indexOf(key) !== -1
}

/* istanbul ignore next */
function clipboardText (event) {
  if (window.clipboardData) {
    return window.clipboardData.getData('Text')
  }

  return event.clipboardData ? event.clipboardData.getData('text/plain') : ''
}

class TagsInput extends React.Component {
  constructor (props) {
    super(props)

    this.state = { tag: this.inputValue(props), isFocused: false }
    this.pendingRemovals = []
    this.pendingAdditions = []
    this.pendingInputClear = false

    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
    this.accept = this.accept.bind(this)
    this.addTag = this.addTag.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this._getTagDisplayValue = this._getTagDisplayValue.bind(this)
  }

  componentDidUpdate (prevProps) {
    this.pendingRemovals = []
    this.pendingAdditions = []

    if (this.hasControlledInput()) {
      return
    }

    const tag = this.inputValue(this.props)

    if (this.hasControlledInput(prevProps) || this.props.currentValue !== prevProps.currentValue || tag !== this.inputValue(prevProps)) {
      this.setState({ tag })
    }
  }

  focus () {
    if (this.props.disabled || this.props.inputProps.disabled) {
      return
    }

    this.handleOnFocus()

    if (this.input && typeof this.input.focus === 'function') {
      this.input.focus()
    }
  }

  blur () {
    this.handleOnBlur()

    if (this.input && typeof this.input.blur === 'function') {
      this.input.blur()
    }
  }

  accept () {
    const tag = this._tag()

    if (tag === '') {
      return false
    }

    return this._addTags([this._makeTag(tag)])
  }

  addTag (tag) {
    return this._addTags([tag])
  }

  clearInput () {
    this._clearInput()
  }

  inputValue (props) {
    return props.currentValue == null ? props.inputValue || '' : props.currentValue
  }

  hasControlledInput (props = this.props) {
    const { inputValue, onChangeInput } = props

    return typeof inputValue === 'string' && typeof onChangeInput === 'function'
  }

  inputProps () {
    const { onChange, onFocus, onBlur, onKeyDown, onPaste, ...props } = this.props.inputProps

    return {
      className: 'react-tagsinput-input',
      placeholder: 'Add a tag',
      ...props,
      ...(this.props.disabled ? { disabled: true } : {})
    }
  }

  _tag () {
    return this.pendingInputClear ? '' : this._inputText()
  }

  _inputText () {
    const { value } = this.props.inputProps

    if (value != null) {
      return value
    }

    return this.hasControlledInput() ? this.props.inputValue : this.state.tag
  }

  _clearInput () {
    this.pendingInputClear = true
    const controlled = this.hasControlledInput()

    if (controlled) {
      this.props.onChangeInput('')
    }

    this.setState(controlled ? {} : { tag: '' }, () => {
      this.pendingInputClear = false
    })
  }

  _getTagDisplayValue (tag) {
    const { tagDisplayProp } = this.props

    return tagDisplayProp && tag != null ? tag[tagDisplayProp] : tag
  }

  _getInputRef (ref) {
    if (this.inputRef && this.inputRef.ref === ref) {
      return this.inputRef.callback
    }

    const callback = input => {
      this.input = input

      if (typeof ref === 'function') {
        const cleanup = ref(input)

        if (typeof cleanup === 'function') {
          return () => {
            this.input = null
            cleanup()
          }
        }
      } else if (ref) {
        ref.current = input
      }
    }

    this.inputRef = { ref, callback }

    return callback
  }

  _makeTag (text) {
    const { tagDisplayProp } = this.props

    return tagDisplayProp ? { [tagDisplayProp]: text } : text
  }

  _keptIndexes () {
    return this.props.value.map((tag, index) => index)
      .filter(index => this.pendingRemovals.indexOf(index) === -1)
  }

  _value () {
    return this._keptIndexes().map(index => this.props.value[index]).concat(this.pendingAdditions)
  }

  _change (value, changed, indexes) {
    this.props.onChange(value, changed, indexes)

    this.setState({})
  }

  _removeTag (index) {
    const value = this._value()

    if (!(index > -1 && index < value.length)) {
      return
    }

    const kept = this._keptIndexes()

    if (index < kept.length) {
      this.pendingRemovals.push(kept[index])
    } else {
      this.pendingAdditions.splice(index - kept.length, 1)
    }

    this._change(value.filter((_tag, i) => i !== index), [value[index]], [index])
  }

  _uniqueTags (tags) {
    const keys = this._value().map(tag => this._getTagDisplayValue(trim(tag)))

    return tags.map(trim).filter(tag => {
      const key = this._getTagDisplayValue(tag)

      if (keys.indexOf(key) !== -1) {
        return false
      }

      keys.push(key)
      return true
    })
  }

  _addTags (tags) {
    const { onlyUnique, maxTags, onValidationReject, validate, validationRegex } = this.props
    const candidates = onlyUnique ? this._uniqueTags(tags) : tags
    const rejected = []

    const accepted = candidates.filter(tag => {
      const value = this._getTagDisplayValue(tag)

      if (!hasValue(value)) {
        return false
      }

      const valid = validate(value) && String(value).search(validationRegex) !== -1

      if (!valid) {
        rejected.push(tag)
      }

      return valid
    })

    if (onValidationReject && rejected.length > 0) {
      onValidationReject(rejected)
    }

    const unique = onlyUnique ? this._uniqueTags(accepted) : accepted
    const value = this._value()
    const added = maxTags < 0 ? unique : unique.slice(0, Math.max(0, maxTags - value.length))

    if (added.length === 0) {
      if (rejected.length === 0) {
        this._clearInput()
      }

      return false
    }

    const indexes = added.map((_tag, index) => value.length + index)

    this.pendingInputClear = true
    this.pendingAdditions = this.pendingAdditions.concat(added)
    this._change(value.concat(added), added, indexes)

    this._clearInput()

    return true
  }

  _forward (name, event) {
    const callback = this.props.inputProps[name]

    if (event != null && callback) {
      callback(event)
    }
  }

  handleChange (event) {
    const { onChangeInput } = this.props
    const tag = event.target.value

    this.pendingInputClear = false
    this._forward('onChange', event)

    if (this.hasControlledInput()) {
      onChangeInput(tag)
      return
    }

    this.setState({ tag })
  }

  handlePaste (event) {
    const { addOnPaste, pasteSplit } = this.props

    this._forward('onPaste', event)

    if (!addOnPaste || event.defaultPrevented) {
      return
    }

    event.preventDefault()
    this._addTags(pasteSplit(clipboardText(event)).map(tag => this._makeTag(tag)))
  }

  handleKeyDown (event) {
    this._forward('onKeyDown', event)

    if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229) {
      return
    }

    const { addKeys, removeKeys, preventSubmit } = this.props
    const value = this._value()
    const empty = this._tag() === ''
    const { keyCode, key } = event
    const add = matchesKey(addKeys, keyCode, key)
    const remove = matchesKey(removeKeys, keyCode, key)

    if (add && (this.accept() || (key === 'Enter' && (preventSubmit || !empty)))) {
      event.preventDefault()
    }

    if (remove && empty && value.length > 0) {
      event.preventDefault()
      this._removeTag(value.length - 1)
    }
  }

  handleOnFocus (event) {
    this.setState({ isFocused: true })
    this._forward('onFocus', event)
  }

  handleOnBlur (event) {
    this.setState({ isFocused: false })
    this._forward('onBlur', event)

    if (event && this.props.addOnBlur && !this.pendingInputClear && event.target.value) {
      this._addTags([this._makeTag(event.target.value)])
    }
  }

  handleClick ({ target }) {
    if (target === this.div || target.parentElement === this.div) {
      this.focus()
    }
  }

  handleRemove (index) {
    if (this.pendingRemovals.indexOf(index) !== -1) {
      return
    }

    const offset = this.pendingRemovals.filter(removed => removed < index).length

    this._removeTag(index - offset)
  }

  render () {
    const { value, tagProps, renderTag, renderInput, renderLayout, disabled } = this.props
    const { className, focusedClassName } = this.props
    const wrapperClassName = className + (this.state.isFocused ? ' ' + focusedClassName : '')

    const tags = value.map((tag, key) => renderTag({
      key,
      tag,
      onRemove: this.handleRemove,
      disabled,
      getTagDisplayValue: this._getTagDisplayValue,
      ...tagProps
    }))

    const { ref, ...inputProps } = this.inputProps()
    const input = renderInput({
      onPaste: this.handlePaste,
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange,
      onFocus: this.handleOnFocus,
      onBlur: this.handleOnBlur,
      addTag: this.addTag,
      ...inputProps,
      value: this._inputText(),
      ref: this._getInputRef(ref)
    })

    return (
      <div className={wrapperClassName} onClick={this.handleClick} ref={div => { this.div = div }}>
        {renderLayout(tags, input)}
      </div>
    )
  }
}

function defaultRenderTag ({ tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...props }) {
  return (
    <span key={key} {...props}>
      {getTagDisplayValue(tag)}
      {!disabled && <a className={classNameRemove} onClick={() => onRemove(key)} />}
    </span>
  )
}

function defaultRenderInput ({ addTag, ...props }) {
  return <input type='text' {...props} />
}

function defaultRenderLayout (tags, input) {
  return <span>{tags}{input}</span>
}

function defaultPasteSplit (text) {
  return text.split(' ').map(tag => tag.trim())
}

TagsInput.propTypes = {
  focusedClassName: PropTypes.string,
  addKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  addOnBlur: PropTypes.bool,
  addOnPaste: PropTypes.bool,
  currentValue: PropTypes.string,
  inputValue: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onChangeInput: PropTypes.func,
  removeKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  renderInput: PropTypes.func,
  renderTag: PropTypes.func,
  renderLayout: PropTypes.func,
  pasteSplit: PropTypes.func,
  tagProps: PropTypes.object,
  onlyUnique: PropTypes.bool,
  value: PropTypes.array.isRequired,
  maxTags: PropTypes.number,
  validate: PropTypes.func,
  validationRegex: PropTypes.instanceOf(RegExp),
  disabled: PropTypes.bool,
  tagDisplayProp: PropTypes.string,
  preventSubmit: PropTypes.bool
}

TagsInput.defaultProps = {
  className: 'react-tagsinput',
  focusedClassName: 'react-tagsinput--focused',
  addKeys: ['Tab', 'Enter'],
  addOnBlur: false,
  addOnPaste: false,
  inputProps: {},
  removeKeys: ['Backspace'],
  renderInput: defaultRenderInput,
  renderTag: defaultRenderTag,
  renderLayout: defaultRenderLayout,
  pasteSplit: defaultPasteSplit,
  tagProps: { className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove' },
  onlyUnique: false,
  maxTags: -1,
  validate: () => true,
  validationRegex: /.*/,
  disabled: false,
  tagDisplayProp: null,
  preventSubmit: true
}

export default TagsInput
