;(function (root, factory) {
  /* istanbul ignore next */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("react"));
  } else if (typeof define === "function" && define.amd) {
    define(["react"], factory);
  } else {
    root.ReactTagsInput = factory(root.React);
  }
})(this, function (React) {
  "use strict";

  var Input = React.createClass({
    render: function () {
      var ns = this.props.ns;

      var inputClass = ns + "tagsinput-input";

      if (this.props.validating) {
        inputClass += " " + ns + "tagsinput-validating";
      }

      if (this.props.invalid) {
        inputClass += " " + ns + "tagsinput-invalid";
      }

      return React.createElement("input",
        // https://gist.github.com/sebmarkbage/a6e220b7097eb3c79ab7
        // avoid dependency on ES6's `Object.assign()`
        React.__spread({}, this.props, {
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
        React.createElement("span", {
          className: this.props.ns + "tagsinput-tag"
        }, this.props.tag, React.createElement("a", {
          onClick: this.props.remove
          , className: this.props.ns + "tagsinput-remove"
        }))
      );
    }
  });

  var TagsInput = React.createClass({
    propTypes: {
      value: React.PropTypes.array
      , valueLink: React.PropTypes.object
      , defaultValue: React.PropTypes.array
      , placeholder: React.PropTypes.string
      , classNamespace: React.PropTypes.string
      , addKeys: React.PropTypes.array
      , removeKeys: React.PropTypes.array
      , addOnBlur: React.PropTypes.bool
      , onChange: React.PropTypes.func
      , onChangeInput: React.PropTypes.func
      , onBlur: React.PropTypes.func
      , onTagAdd: React.PropTypes.func
      , onTagRemove: React.PropTypes.func
      , transform: React.PropTypes.func
      , validate: React.PropTypes.func
    }

    , getDefaultProps: function () {
      return {
        defaultValue: []
        , placeholder: "Add a tag"
        , classNamespace: "react"
        , addKeys: [13, 9]
        , removeKeys: [8]
        , addOnBlur: true
        , onChange: function () { }
        , onChangeInput: function () { }
        , onBlur: function () { }
        , onTagAdd: function () { }
        , onTagRemove: function () { }
        , transform: function (tag) { return tag.trim(); }
      };
    }

    , getInitialState: function () {
      var value = this.props.defaultValue.slice(0);

      return {
        value: value
        , tag: ""
        , invalid: false
        , validating: false
      };
    }

    , componentWillUpdate: function (nextProps) {
      if (!this.isUncontrolled() && this.isUncontrolled(nextProps)) {
        this.setState({ value: this.props.defaultValue.slice(0) });
      }
    }

    , isUncontrolled: function (props) {
      props = props || this.props;
      return !props.value && !props.valueLink;
    }

    , getValueLink: function () {
      if (!this.isUncontrolled()) {
        return this.props.valueLink || {
          value: this.props.value
          , requestChange: this.props.onChange
        };
      }

      return {
        value: this.state.value
        , requestChange: function (tags) {
          this.setState({
            value: tags
          });
          this.props.onChange(tags);
        }.bind(this)
      };
    }

    , defaultValidate: function (tag) {
      var valueLink = this.getValueLink();

      return tag !== "" && valueLink.value.indexOf(tag) === -1;
    }

    , getTags: function () {
      var valueLink = this.getValueLink();
      return valueLink.value;
    }

    , validation: function (tag, cb) {
      var validate = this.props.validate || this.defaultValidate;

      var async = validate.length === 2;

      if (async) {
        validate(tag, cb);
      } else {
        cb(validate(tag));
      }
    }

    , addTag: function (tag) {
      var valueLink = this.getValueLink();

      var newTag = this.props.transform(tag);

      tag = newTag ? newTag : tag;

      this.setState({ validating: true });
      this.validation(tag, function (valid) {
        this.setState({ validating: false });

        if (!valid) { return this.setState({ invalid: true }); }

        var newValue = valueLink.value.concat([tag]);

        valueLink.requestChange(newValue, tag);

        this.setState({
          tag: ""
          , invalid: false
        }, function () {
          this.props.onTagAdd(tag);
        });
      }.bind(this));
    }

    , removeTag: function (tag) {
      var valueLink = this.getValueLink();

      var clone = valueLink.value.concat([]);

      for (var i = 0; i < clone.length; i += 1) {
        if (clone[i] === tag) {
          clone.splice(i, 1);
          valueLink.requestChange(clone, tag);
          this.props.onTagRemove(tag);
          return ;
        }
      }
    }

    , onKeyDown: function (e) {
      var valueLink = this.getValueLink();

      var add = this.props.addKeys.indexOf(e.keyCode) !== -1
        , remove = this.props.removeKeys.indexOf(e.keyCode) !== -1;

      if (add) {
        e.preventDefault();
        this.addTag(this.state.tag);
      }

      if (remove && valueLink.value.length > 0 && this.state.tag === "") {
        this.removeTag(valueLink.value[valueLink.value.length - 1]);
      }
    }

    , onChange: function (e) {
      if (!this.state.validating) {
        this.props.onChangeInput(e.target.value);
        this.setState({
          tag: e.target.value
          , invalid: false
        });
      }
    }

    , onBlur: function (e) {
      var tag = this.state.tag;

      if (this.props.addOnBlur && tag !== "") {
        this.addTag(tag);
      }

      this.props.onBlur();
    }

    , focus: function () {
      this.refs.input.getDOMNode().focus();
    }

    , render: function() {
      var valueLink = this.getValueLink();

      var ns = this.props.classNamespace === "" ? "" : this.props.classNamespace + "-";

      var tagNodes = valueLink.value.map(function (tag, i) {
        return React.createElement(Tag, {
          key: i
          , ns: ns
          , tag: tag
          , remove: this.removeTag.bind(null, tag)
        });
      }.bind(this));

      return (
        React.createElement("div", {
          className: ns + "tagsinput"
        }, tagNodes, React.createElement(Input, {
          ref: "input"
          , ns: ns
          , placeholder: this.props.placeholder
          , value: this.state.tag
          , invalid: this.state.invalid
          , validating: this.state.validating
          , onKeyDown: this.onKeyDown
          , onChange: this.onChange
          , onBlur: this.onBlur
        }))
      );
    }
  });

  return TagsInput;
});
