import React from 'react'

function uniq (arr) {
  let out = []

  for (let i = 0; i < arr.length; i++) {
    if (out.indexOf(arr[i]) === -1) {
      out.push(arr[i])
    }
  }

  return out
}

/* istanbul ignore next */
function getClipboardData (e) {
  if (window.clipboardData) {
    return window.clipboardData.getData('Text')
  }

  if (e.clipboardData) {
    return e.clipboardData.getData('text/plain')
  }

  return ''
}

class Tag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEdited: false,
      displayValue: props.getTagDisplayValue(props.tag)
    }
  }

  static propTypes = {
    index: React.PropTypes.number,
    tag: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
    onEdit: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    classNameRemove: React.PropTypes.string,
    getTagDisplayValue: React.PropTypes.func
  }

  handleDoubleClick () {
    this.setState({isEdited: true}, () => {
      this.input.focus()
      this.input.select()
    })
  }

  handleChange (e) {
    this.setState({displayValue: e.target.value})
  }

  handleKeyDown (e) {
    const save = e.keyCode === 13
    const cancel = e.keyCode === 27

    if (!save && !cancel) return

    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    this.setState({isEdited: false})

    const {index, tag, tagDisplayProp, onEdit, getTagDisplayValue} = this.props
    const {displayValue} = this.state

    if (save && displayValue !== '') {
      onEdit(index, tagDisplayProp ? {...tag, [tagDisplayProp]: displayValue} : displayValue)
    }

    if (cancel || displayValue === '') {
      this.setState({displayValue: getTagDisplayValue(tag)})
    }
  }

  render () {
    let {isEdited, displayValue} = this.state
    let {index, disabled, onRemove, className, classNameRemove} = this.props

    return (
      <span className={className} onDoubleClick={::this.handleDoubleClick}>
        {!isEdited && displayValue}
        {isEdited &&
          <input
            type='text'
            className={`${className}-input`}
            ref={input => (this.input = input)}
            value={displayValue}
            onChange={::this.handleChange}
            onKeyDown={::this.handleKeyDown}
          />
        }
        {!disabled &&
          <a className={classNameRemove} onClick={(e) => onRemove(index)} />
        }
      </span>
    )
  }
}

function defaultRenderTag (props) {
  let {key, ...other} = props
  return (
    <Tag index={key} key={key} {...other} />
  )
}

defaultRenderTag.propTypes = {
  key: React.PropTypes.number,
  tag: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
  onEdit: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  classNameRemove: React.PropTypes.string,
  getTagDisplayValue: React.PropTypes.func
}

function defaultRenderInput (props) {
  // eslint-disable-next-line
  let {onChange, value, addTag, ...other} = props
  return (
    <input type='text' onChange={onChange} value={value} {...other} />
  )
}

defaultRenderInput.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  addTag: React.PropTypes.func
}

function defaultRenderLayout (tagComponents, inputComponent) {
  return (
    <span>
      {tagComponents}
      {inputComponent}
    </span>
  )
}

function defaultPasteSplit (data) {
  return data.split(' ').map(d => d.trim())
}

const defaultInputProps = {
  className: 'react-tagsinput-input',
  placeholder: 'Add a tag'
}

class TagsInput extends React.Component {
  constructor () {
    super()
    this.state = {tag: '', isFocused: false}
    this.focus = ::this.focus
    this.blur = ::this.blur
  }

  static propTypes = {
    focusedClassName: React.PropTypes.string,
    addKeys: React.PropTypes.array,
    addOnBlur: React.PropTypes.bool,
    addOnPaste: React.PropTypes.bool,
    currentValue: React.PropTypes.string,
    inputProps: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    removeKeys: React.PropTypes.array,
    renderInput: React.PropTypes.func,
    renderTag: React.PropTypes.func,
    renderLayout: React.PropTypes.func,
    pasteSplit: React.PropTypes.func,
    tagProps: React.PropTypes.object,
    onlyUnique: React.PropTypes.bool,
    value: React.PropTypes.array.isRequired,
    maxTags: React.PropTypes.number,
    validationRegex: React.PropTypes.instanceOf(RegExp),
    disabled: React.PropTypes.bool,
    tagDisplayProp: React.PropTypes.string
  }

  static defaultProps = {
    className: 'react-tagsinput',
    focusedClassName: 'react-tagsinput--focused',
    currentValue: '',
    addKeys: [9, 13],
    addOnBlur: false,
    addOnPaste: false,
    inputProps: {},
    removeKeys: [8],
    renderInput: defaultRenderInput,
    renderTag: defaultRenderTag,
    renderLayout: defaultRenderLayout,
    pasteSplit: defaultPasteSplit,
    tagProps: {className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove'},
    onlyUnique: false,
    maxTags: -1,
    validationRegex: /.*/,
    disabled: false,
    tagDisplayProp: null
  }

  _getTagDisplayValue (tag) {
    const {tagDisplayProp} = this.props

    if (tagDisplayProp) {
      return tag[tagDisplayProp]
    }

    return tag
  }

  _makeTag (tag) {
    const {tagDisplayProp} = this.props

    if (tagDisplayProp) {
      return {
        [tagDisplayProp]: tag
      }
    }

    return tag
  }

  _editTag (index, tag) {
    const { value } = this.props
    value[index] = tag
    this.props.onChange(value, [tag], [index])
  }

  _removeTag (index) {
    let value = this.props.value.concat([])
    if (index > -1 && index < value.length) {
      let changed = value.splice(index, 1)
      this.props.onChange(value, changed, [index])
    }
  }

  _clearInput () {
    this.setState({tag: ''})
  }

  _addTags (tags) {
    let {validationRegex, onChange, onlyUnique, maxTags, value} = this.props

    if (onlyUnique) {
      tags = uniq(tags)
      tags = tags.filter(tag => value.every(currentTag => this._getTagDisplayValue(currentTag) !== this._getTagDisplayValue(tag)))
    }

    tags = tags.filter(tag => validationRegex.test(this._getTagDisplayValue(tag)))
    tags = tags.filter(tag => {
      let tagDisplayValue = this._getTagDisplayValue(tag)
      if (typeof tagDisplayValue.trim === 'function') {
        return tagDisplayValue.trim().length > 0
      } else {
        return tagDisplayValue
      }
    })

    if (maxTags >= 0) {
      let remainingLimit = Math.max(maxTags - value.length, 0)
      tags = tags.slice(0, remainingLimit)
    }

    if (tags.length > 0) {
      let newValue = value.concat(tags)
      let indexes = []
      for (let i = 0; i < tags.length; i++) {
        indexes.push(value.length + i)
      }
      onChange(newValue, tags, indexes)
      this._clearInput()
      return true
    }

    this._clearInput()
    return false
  }

  focus () {
    if (this.refs.input && typeof this.refs.input.focus === 'function') {
      this.refs.input.focus()
    }

    this.handleOnFocus()
  }

  blur () {
    if (this.refs.input && typeof this.refs.input.blur === 'function') {
      this.refs.input.blur()
    }

    this.handleOnBlur()
  }

  accept () {
    let {tag} = this.state

    if (tag !== '') {
      tag = this._makeTag(tag)
      return this._addTags([tag])
    }

    return false
  }

  addTag (tag) {
    return this._addTags([tag])
  }

  clearInput () {
    this._clearInput()
  }

  handlePaste (e) {
    let {addOnPaste, pasteSplit} = this.props

    if (!addOnPaste) {
      return
    }

    e.preventDefault()

    let data = getClipboardData(e)
    let tags = pasteSplit(data).map(tag => this._makeTag(tag))

    this._addTags(tags)
  }

  handleKeyDown (e) {
    if (e.defaultPrevented) {
      return
    }

    let {value, removeKeys, addKeys} = this.props
    let {tag} = this.state
    let empty = tag === ''
    let keyCode = e.keyCode
    let add = addKeys.indexOf(keyCode) !== -1
    let remove = removeKeys.indexOf(keyCode) !== -1

    if (add) {
      let added = this.accept()
      // Special case for preventing forms submitting.
      if (added || keyCode === 13) {
        e.preventDefault()
      }
    }

    if (remove && value.length > 0 && empty) {
      e.preventDefault()
      this._removeTag(value.length - 1)
    }
  }

  handleClick (e) {
    if (e.target === this.refs.div) {
      this.focus()
    }
  }

  handleChange (e) {
    let {onChange} = this.props.inputProps
    let tag = e.target.value

    if (onChange) {
      onChange(e)
    }

    this.setState({tag})
  }

  handleOnFocus (e) {
    let {onFocus} = this.props.inputProps

    if (onFocus) {
      onFocus(e)
    }

    this.setState({isFocused: true})
  }

  handleOnBlur (e) {
    let {onBlur} = this.props.inputProps

    this.setState({isFocused: false})

    if (e == null) {
      return
    }

    if (onBlur) {
      onBlur(e)
    }

    if (this.props.addOnBlur) {
      const tag = this._makeTag(e.target.value)
      this._addTags([tag])
    }
  }

  handleEdit (index, tag) {
    this._editTag(index, tag)
  }

  handleRemove (tag) {
    this._removeTag(tag)
  }

  inputProps () {
    // eslint-disable-next-line
    let {onChange, onFocus, onBlur, ...otherInputProps} = this.props.inputProps

    let props = {
      ...defaultInputProps,
      ...otherInputProps
    }

    if (this.props.disabled) {
      props.disabled = true
    }

    return props
  }

  componentDidMount () {
    this.setState({
      tag: this.props.currentValue
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.currentValue) {
      return
    }

    this.setState({
      tag: nextProps.currentValue
    })
  }

  render () {
    // eslint-disable-next-line
    let {value, onChange, tagProps, renderLayout, renderTag, renderInput, addKeys, removeKeys, className, focusedClassName, addOnBlur, addOnPaste, inputProps, pasteSplit, onlyUnique, maxTags, validationRegex, disabled, tagDisplayProp, ...other} = this.props
    let {tag, isFocused} = this.state

    if (isFocused) {
      className += ' ' + focusedClassName
    }

    let tagComponents = value.map((tag, index) => {
      return renderTag({
        key: index, tag, tagDisplayProp, onEdit: ::this.handleEdit, onRemove: ::this.handleRemove, disabled, getTagDisplayValue: ::this._getTagDisplayValue, ...tagProps
      })
    })

    let inputComponent = renderInput({
      ref: 'input',
      value: tag,
      onPaste: ::this.handlePaste,
      onKeyDown: ::this.handleKeyDown,
      onChange: ::this.handleChange,
      onFocus: ::this.handleOnFocus,
      onBlur: ::this.handleOnBlur,
      addTag: ::this.addTag,
      ...this.inputProps()
    })

    return (
      <div ref='div' onClick={::this.handleClick} className={className}>
        {renderLayout(tagComponents, inputComponent)}
      </div>
    )
  }
}

export default TagsInput
