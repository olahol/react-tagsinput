import React from 'react'

import TagsInput from '../../src'

class FormExample extends React.Component {
  constructor () {
    super()
    this.state = {tags: []}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  render () {
    return (
      <form>
        <TagsInput name='form' value={this.state.tags} onChange={::this.handleChange} onlyUnique />
      </form>
    )
  }
}

export default FormExample
