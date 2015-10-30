import React from 'react'

function defaultRenderTag (props) {
  let {tag, key, onRemove, ...other} = props
  return (
    <span key={key} {...other}>
      {tag}
      <a onClick={(e) => onRemove(key)} />
    </span>
  )
}

function defaultRenderInput (props) {
  let {onChange, value, ...other} = props
  return (
    <input type='text' onChange={onChange} value={value} {...other} />
  )
}

class TagsInput extends React.Component {
  constructor () {
    super()
    this.state = {tag: ''}
    this.focus = ::this.focus
    this.blur = ::this.blur
  }

  static propTypes = {
    addKeys: React.PropTypes.array,
    inputProps: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    removeKeys: React.PropTypes.array,
    renderInput: React.PropTypes.func,
    renderTag: React.PropTypes.func,
    tagProps: React.PropTypes.object,
    value: React.PropTypes.array.isRequired
  }

  static defaultProps = {
    className: 'react-tagsinput',
    addKeys: [9, 13],
    inputProps: {className: 'react-tagsinput-input'},
    removeKeys: [8],
    renderInput: defaultRenderInput,
    renderTag: defaultRenderTag,
    tagProps: {className: 'react-tagsinput-tag'}
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

  _addTag (tag) {
    if (tag !== '') {
      let value = this.props.value.concat([tag])
      this.props.onChange(value)
      this._clearInput()
    }
  }

  focus () {
    this.refs.input.focus()
  }

  blur () {
    this.refs.input.focus()
  }

  handleKeyDown (e) {
    let {value, removeKeys, addKeys} = this.props
    let {tag} = this.state
    let empty = tag === ''
    let add = addKeys.indexOf(e.keyCode) !== -1
    let remove = removeKeys.indexOf(e.keyCode) !== -1

    if (add) {
      e.preventDefault()
      this._addTag(tag)
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
    let tag = e.target.value
    this.setState({tag})
  }

  handleRemove (tag) {
    this._removeTag(tag)
  }

  render () {
    let {value, onChange, inputProps, tagProps, renderTag, renderInput, addKeys, removeKeys, ...other} = this.props
    let {tag} = this.state

    return (
      <div ref='div' onClick={::this.handleClick} {...other}>
        {value.map((tag, index) => {
          return renderTag({key: index, tag, onRemove: ::this.handleRemove, ...tagProps})
        })}
        {renderInput({ref: 'input', value: tag, onKeyDown: ::this.handleKeyDown,
          onChange: ::this.handleChange, ...inputProps})}
      </div>
    )
  }
}

export default TagsInput
