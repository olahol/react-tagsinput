/* eslint-disable */
import React from 'react'
import TagsInput from '../src'
import {findDOMNode, render} from 'react-dom'
import Autosuggest from 'react-autosuggest'
import AutosizeInput from 'react-input-autosize'

import SimpleExample from "./components/simple";
import AutosizeExample from "./components/autosize";
import AutocompleteExample from "./components/autocomplete";
import EmailExample from "./components/email";
import FormExample from "./components/form";
import AutoaddExample from "./components/autoadd";

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
        <h2>Auto add</h2>
        <AutoaddExample />
      </div>
    )
  }
}

render(<Examples />, document.getElementById('react-app'))
