import React from 'react'
import TagsInput from '../src'
import {findDOMNode, render} from 'react-dom'
import Autosuggest from 'react-autosuggest'
import AutosizeInput from 'react-input-autosize'

import '../react-tagsinput.css'

React.findDOMNode = findDOMNode

class Examples extends React.Component {
  render () {
    return (
      <div>
        <h2>Simple</h2>
        <SimpleExample />
        <hr />
        <h2>Auto size</h2>
        <AutosizeExample />
        <hr />
        <h2>Auto complete</h2>
        <AutocompleteExample />
        <hr />
        <h2>Email</h2>
        <EmailExample />
        <h2>Form</h2>
        <FormExample />
      </div>
    )
  }
}

class SimpleExample extends React.Component {
  constructor () {
    super()
    this.state = {tags: []}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  render () {
    return <TagsInput value={this.state.tags} onChange={::this.handleChange} />
  }
}


class AutosizeExample extends React.Component {
  constructor () {
    super()
    this.state = {tags: []}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  render () {
    function autosizingRenderInput (props) {
      let {onChange, value, addTag, ...other} = props
      return (
        <AutosizeInput type='text' onChange={onChange} value={value} {...other} />
      )
    }

    return <TagsInput renderInput={autosizingRenderInput} value={this.state.tags} onChange={::this.handleChange} />
  }
}

function states() {
  return [
    { abbr: "AL", name: "Alabama"},
    { abbr: "AK", name: "Alaska"},
    { abbr: "AZ", name: "Arizona"},
    { abbr: "AR", name: "Arkansas"},
    { abbr: "CA", name: "California"},
    { abbr: "CO", name: "Colorado"},
    { abbr: "CT", name: "Connecticut"},
    { abbr: "DE", name: "Delaware"},
    { abbr: "FL", name: "Florida"},
    { abbr: "GA", name: "Georgia"},
    { abbr: "HI", name: "Hawaii"},
    { abbr: "ID", name: "Idaho"},
    { abbr: "IL", name: "Illinois"},
    { abbr: "IN", name: "Indiana"},
    { abbr: "IA", name: "Iowa"},
    { abbr: "KS", name: "Kansas"},
    { abbr: "KY", name: "Kentucky"},
    { abbr: "LA", name: "Louisiana"},
    { abbr: "ME", name: "Maine"},
    { abbr: "MD", name: "Maryland"},
    { abbr: "MA", name: "Massachusetts"},
    { abbr: "MI", name: "Michigan"},
    { abbr: "MN", name: "Minnesota"},
    { abbr: "MS", name: "Mississippi"},
    { abbr: "MO", name: "Missouri"},
    { abbr: "MT", name: "Montana"},
    { abbr: "NE", name: "Nebraska"},
    { abbr: "NV", name: "Nevada"},
    { abbr: "NH", name: "New Hampshire"},
    { abbr: "NJ", name: "New Jersey"},
    { abbr: "NM", name: "New Mexico"},
    { abbr: "NY", name: "New York"},
    { abbr: "NC", name: "North Carolina"},
    { abbr: "ND", name: "North Dakota"},
    { abbr: "OH", name: "Ohio"},
    { abbr: "OK", name: "Oklahoma"},
    { abbr: "OR", name: "Oregon"},
    { abbr: "PA", name: "Pennsylvania"},
    { abbr: "RI", name: "Rhode Island"},
    { abbr: "SC", name: "South Carolina"},
    { abbr: "SD", name: "South Dakota"},
    { abbr: "TN", name: "Tennessee"},
    { abbr: "TX", name: "Texas"},
    { abbr: "UT", name: "Utah"},
    { abbr: "VT", name: "Vermont"},
    { abbr: "VA", name: "Virginia"},
    { abbr: "WA", name: "Washington"},
    { abbr: "WV", name: "West Virginia"},
    { abbr: "WI", name: "Wisconsin"},
    { abbr: "WY", name: "Wyoming"}
  ]
}

class AutocompleteExample extends React.Component {
  constructor () {
    super()
    this.state = {tags: []}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  render () {
    const autocompleteRenderInput = (props) => {
      const {addTag, ...other} = props
			const inputValue = (props.value && props.value.trim().toLowerCase()) || ""
			const inputLength = inputValue.length
      let {tags} = this.state
      let suggestions = states().filter((state) => {
				return state.name.toLowerCase().slice(0, inputLength) === inputValue
      })

      return (
        <Autosuggest
          ref={props.ref}
          suggestions={suggestions}
          shouldRenderSuggestions={(value) => value && value.trim().length > 0}
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
          inputProps={other}
          onSuggestionSelected={(e, {suggestion}) => {
            props.addTag(suggestion.name)
          }}
        />
      )
    }

    return <TagsInput ref='tags' renderInput={autocompleteRenderInput} value={this.state.tags} onChange={::this.handleChange} />
  }
}

class EmailExample extends React.Component {
  constructor () {
    super()
    this.state = {tags: []}
  }

  handleChange (tags) {
    this.setState({tags})
  }

  render () {
    var EMAIL_VALIDATION_REGEX = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i

    return (
			<TagsInput
				value={this.state.tags}
				addKeys={[9, 13, 32, 186, 188]} // tab, enter, space, semicolon, comma
				onlyUnique={true}
				addOnPaste={true}
				validationRegex={EMAIL_VALIDATION_REGEX}
				pasteSplit={data => {
					return data.replace(/[\r\n,;]/g, ' ').split(' ').map(d => d.trim())
				}}
				onChange={::this.handleChange}
			/>
    )
  }
}

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
        <TagsInput name="form" onlyUnique={true} value={this.state.tags} onChange={::this.handleChange} />
      </form>
    )
  }
}

render(<Examples />, document.getElementById('react-app'))
