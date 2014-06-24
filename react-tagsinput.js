;(function () {
  var React = this.React || require("react");

  var Input = React.createClass({
    render: function () {
      var inputClass = this.props.invalid ?
        "react-tagsinput-input react-tagsinput-invalid" :
        "react-tagsinput-input";

      return this.transferPropsTo(
        React.DOM.input({
          type: "text"
          , className: inputClass
          , placeholder: this.props.placeholder
        })
      );
    }
  });

  var Tag = React.createClass({
    render: function () {
      return (
        React.DOM.span({
          className: "react-tagsinput-tag"
        }, this.props.tag + " ", React.DOM.a({
          onClick: this.props.remove
          , className: "react-tagsinput-remove"
        }, "X"))
      );
    }
  });

  var TagsInput = React.createClass({
    getDefaultProps: function () {
      return {
        tags: []
        , placeholder: "Add a tag"
        , onTagAdd: function () { }
        , onTagRemove: function () { }
        , onChange: function () { }
      };
    }

    , getInitialState: function () {
      return {
        tags: []
        , tag: ""
        , invalid: false
      };
    }

    , componentWillMount: function () {
      this.setState({
        tags: this.props.tags.slice(0)
      });
    }

    , getTags: function () {
      return this.state.tags;
    }

    , addTag: function () {
      var tag = this.state.tag.trim();

      if (this.state.tags.indexOf(tag) !== -1 || tag === "") {
        return this.setState({
          invalid: true
        });
      }

      this.setState({
        tags: this.state.tags.concat([tag])
        , tag: ""
        , invalid: false
      }, function () {
        this.props.onTagAdd(tag);
        this.props.onChange(this.state.tags);
        this.inputFocus();
      });
    }

    , removeTag: function (i) {
      var tags = this.state.tags.slice(0);
      var tag = tags.splice(i, 1);
      this.setState({
        tags: tags
        , invalid: false
      }, function () {
        this.props.onTagRemove(tag[0]);
        this.props.onChange(this.state.tags);
      });
    }

    , onKeyDown: function (e) {
      if (e.keyCode === 13 || e.keyCode === 9) {
        this.addTag();
      }

      if (e.keyCode === 8 && this.state.tags.length > 0 && this.state.tag === "") {
        this.removeTag(this.state.tags.length - 1);
      }
    }

    , onChange: function (e) {
      this.setState({
        tag: e.target.value
        , invalid: false
      });
    }

    , inputFocus: function () {
      this.refs.input.getDOMNode().focus();
    }

    , render: function() {
      var tagNodes = this.state.tags.map(function (tag, i) {
        return Tag({
          key: i
          , tag: tag
          , remove: this.removeTag.bind(null, i)
        });
      }.bind(this));

      return (
        React.DOM.div({
          className: "react-tagsinput"
        }, tagNodes, Input({
          ref: "input"
          , placeholder: this.props.placeholder
          , value: this.state.tag
          , invalid: this.state.invalid
          , onKeyDown: this.onKeyDown
          , onChange: this.onChange
        }))
      );
    }
  });

	if (typeof module === "object" && module.exports){
		module.exports = TagsInput;
	} else {
    this.ReactTagsInput = TagsInput;
	}
}.call(this));
