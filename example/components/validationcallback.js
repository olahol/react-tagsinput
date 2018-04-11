import React from 'react'

import TagsInput from '../../src'

class Example extends React.Component {
  constructor () {
    super()
    this.state = {tags: []}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  render () {
    return (
      <TagsInput
        validate={::this.validate}
        value={this.state.tags}
        onChange={::this.handleChange}
      />
    )
  }

  validate (tag) {
    const matches = /^(\d+)-(\d+)$/.exec(tag)
    if (!matches || matches.length !== 3) {
      return false
    }

    const min = parseInt(matches[1], 10)
    const max = parseInt(matches[2], 10)
    if (min > max) {
      return false
    }

    return true
  }
}

export default Example
