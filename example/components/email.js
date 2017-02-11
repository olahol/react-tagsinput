import React from 'react'

import TagsInput from '../../src'

class EmailExample extends React.Component {
  constructor () {
    super()
    this.state = {tags: []}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  render () {
    var EMAIL_VALIDATION_REGEX = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i

    return (
      <TagsInput
        value={this.state.tags}
        addKeys={[9, 13, 32, 186, 188]} // tab, enter, space, semicolon, comma
        onlyUnique
        addOnPaste
        validationRegex={EMAIL_VALIDATION_REGEX}
        pasteSplit={data => {
          return data.replace(/[\r\n,;]/g, ' ').split(' ').map(d => d.trim())
        }}
        onChange={::this.handleChange}
      />
    )
  }
}

export default EmailExample
