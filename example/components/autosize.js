import React from 'react'

import TagsInput from '../../src'

import AutosizeInput from 'react-input-autosize'

class AutosizeExample extends React.Component {
  constructor () {
    super()
    this.state = {tags: []}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  render () {
    function autosizingRenderInput ({addTag, ...props}) {
      let {onChange, value, ...other} = props
      return (
        <AutosizeInput type='text' onChange={onChange} value={value} {...other} />
      )
    }

    return <TagsInput renderInput={autosizingRenderInput} value={this.state.tags} onChange={::this.handleChange} />
  }
}

export default AutosizeExample
