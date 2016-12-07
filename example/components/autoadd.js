import React from 'react'

import TagsInput from '../../src'

class Example extends React.Component {
  constructor () {
    super()
    this.state = {tags: [], tag: ''}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  handleInputChange (value) {
    if (value.length > 2) {
      return this.refs.tagsinput.accept()
    }

    this.setState({tag: value})
  }

  render () {
    return (
      <TagsInput
        ref='tagsinput'
        value={this.state.tags}
        onChange={::this.handleChange}
        inputValue={this.state.tag}
        onChangeInput={::this.handleInputChange}
      />
    )
  }
}

export default Example
