import React from 'react'
import TagsInput from '../src'
import {findDOMNode, render} from 'react-dom'
import AutosizeInput from 'react-input-autosize'
import AutocompleteInput from 'react-autocomplete'
import Autosuggest from 'react-autosuggest'

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
        <h2>Auto complete</h2>
        <AutocompleteExample />
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
      let {onChange, value, ...other} = props
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
          inputProps={props}
          onSuggestionSelected={(e, {suggestion}) => {
            this.refs.tags.add(suggestion.name)
          }}
        />
      )
    }

    return <TagsInput ref="tags" renderInput={autocompleteRenderInput} value={this.state.tags} onChange={::this.handleChange} />
  }
}

render(<Examples />, document.getElementById('react-app'))
