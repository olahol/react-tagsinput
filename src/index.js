import React from 'react'

function defaultRenderTag (props) {
  let {tag, key, onRemove, classNameRemove, ...other} = props
  return (
    <span key={key} {...other}>
      {tag}
      <a className={classNameRemove} onClick={(e) => onRemove(key)} />
    </span>
  )
}

defaultRenderTag.propTypes = {
  key: React.PropTypes.number,
  tag: React.PropTypes.string,
  onRemove: React.PropTypes.function,
  classNameRemove: React.PropTypes.string
}

function defaultRenderInput (props) {
  let {onChange, value, ...other} = props
  return (
    <input type='text' onChange={onChange} value={value} {...other} />
  )
}

defaultRenderInput.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.function
}

function defaultRenderLayout (tagComponents, inputComponent) {
  return (
    <span>
      {tagComponents}
      {inputComponent}
    </span>
  )
}

class TagsInput extends React.Component {
  constructor () {
    super()
    this.state = {tag: '', width: ''}
    this.focus = ::this.focus
    this.blur = ::this.blur
  }

  static propTypes = {
    addKeys: React.PropTypes.array,
    addOnBlur: React.PropTypes.bool,
    inputProps: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    removeKeys: React.PropTypes.array,
    renderInput: React.PropTypes.func,
    renderTag: React.PropTypes.func,
    renderLayout: React.PropTypes.func,
    tagProps: React.PropTypes.object,
    onlyUnique: React.PropTypes.bool,
    value: React.PropTypes.array.isRequired,
    maxTags: React.PropTypes.number,
    validationRegex: React.PropTypes.instanceOf(RegExp),
    dynamicWidth: React.PropTypes.bool,
    widthStep: React.PropTypes.number
  }

  static defaultProps = {
    className: 'react-tagsinput',
    addKeys: [9, 13],
    inputProps: {className: 'react-tagsinput-input'},
    removeKeys: [8],
    renderInput: defaultRenderInput,
    renderTag: defaultRenderTag,
    renderLayout: defaultRenderLayout,
    tagProps: {className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove'},
    onlyUnique: false,
    maxTags: -1,
    validationRegex: /.*/,
    dynamicWidth: false,
    widthStep: 10
  }

  _removeTag (index) {
    let value = this.props.value.concat([])
    if (index > -1 && index < value.length) {
      value.splice(index, 1)
      this.props.onChange(value)
    }
  }

  _clearInput () {
    this.setState({tag: ''})
  }

  _maxTags (tags) {
    return this.props.maxTags !== -1 ? tags < this.props.maxTags : true
  }

  _addTag (tag) {
    let {onlyUnique} = this.props
    let isUnique = this.props.value.indexOf(tag) === -1
    let limit = this._maxTags(this.props.value.length)
    if (tag !== '' && limit && (isUnique || !onlyUnique)) {
      let value = this.props.value.concat([tag])
      this.props.onChange(value)
      this._clearInput()
      if (this.props.dynamicWidth) this.setState({width: ''})
    }
  }

  focus () {
    this.refs.input.focus()
  }

  blur () {
    this.refs.input.focus()
  }

  handleKeyDown (e) {
    let {value, removeKeys, addKeys, validationRegex} = this.props
    let {tag} = this.state
    let empty = tag === ''
    let add = addKeys.indexOf(e.keyCode) !== -1
    let remove = removeKeys.indexOf(e.keyCode) !== -1

    if (add) {
      e.preventDefault()
      if (validationRegex.test(tag)) {
        this._addTag(tag)
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
    let {dynamicWidth, widthStep} = this.props
    let tag = e.target.value
    if (onChange) {
      onChange(e)
    }
    this.setState({tag})
    if (dynamicWidth) this.setState({width: tag.length * widthStep + 10 + 'px'})
  }

  handleOnBlur (e) {
    if (this.props.addOnBlur) {
      this._addTag(e.target.value)
    }
  }

  handleRemove (tag) {
    this._removeTag(tag)
  }

  inputProps () {
    let {onChange, ...otherInputProps} = this.props.inputProps
    return otherInputProps
  }

  render () {
    let {value, onChange, inputProps, tagProps, renderLayout, renderTag, renderInput, addKeys, removeKeys, dynamicWidth, ...other} = this.props
    let {tag, width} = this.state

    let tagComponents = value.map((tag, index) => {
      return renderTag({key: index, tag, onRemove: ::this.handleRemove, ...tagProps})
    })

    let inputComponent = renderInput({
      ref: 'input',
      value: tag,
      onKeyDown: ::this.handleKeyDown,
      onChange: ::this.handleChange,
      onBlur: ::this.handleOnBlur,
      style: dynamicWidth ? {width: width} : {},
      ...this.inputProps()
    })

    return (
      <div ref='div' onClick={::this.handleClick} {...other}>
        {renderLayout(tagComponents, inputComponent)}
      </div>
    )
  }
}

export default TagsInput
