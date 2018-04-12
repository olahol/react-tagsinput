define(['react', 'react-dom', 'react-tagsinput'], (React, ReactDOM, ReactTagsInput) => {
  class SimpleTagsInput extends React.Component {
    constructor(props) {
      super(props);

      this.state = { tags: [] };

      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(tags) {
      this.setState({ tags });
    }

    render() {
      return (
        React.createElement(ReactTagsInput, {
          value: this.state.tags,
          onChange: this.handleChange,
        })
      );
    }
  }

  ReactDOM.render(React.createElement(SimpleTagsInput), document.getElementById('react-app'));
});
