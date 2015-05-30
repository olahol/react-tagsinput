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
      , onKeyDown: React.PropTypes.func
      , onKeyUp: React.PropTypes.func
      , onTagAdd: React.PropTypes.func
      , onTagRemove: React.PropTypes.func
      , transform: React.PropTypes.func
      , validate: React.PropTypes.func
      , validateAsync: React.PropTypes.func
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
        , onKeyDown: function () { }
        , onKeyUp: function () { }
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
    }

    , _valueTransaction: function (fn, tag) {
      var valueLink = this.getValueLink();

      if (!this.isUncontrolled()) {
        return valueLink.requestChange(fn(valueLink.value), tag);
      }

      this.setState(function (state) {
        var newValue = fn(state.value);
        if (newValue) {
          this.props.onChange(newValue, tag);
          return { value: newValue };
        }
      });
    }

    , _value: function () {
      var valueLink = this.getValueLink();

      if (!this.isUncontrolled()) {
        return valueLink.value;
      }

      return this.state.value;
    }

    , defaultValidate: function (tag) {
      return this._value().indexOf(tag) === -1;
    }

    , getTags: function () {
      return this._value();
    }

    , validation: function (tag, cb) {
      var validate = this.props.validateAsync || this.props.validate || this.defaultValidate;

      var async = !!this.props.validateAsync || validate.length == 2;

      if (async) {
        validate(tag, cb);
      } else {
        cb(validate(tag));
      }
    }

    , addTag: function (tag) {
      var valueLink = this.getValueLink();

      var newTag = this.props.transform(tag);

      if (!newTag) { return ; }

      this.setState({ validating: true });
      this.validation(newTag, function (valid) {
        this.setState({ validating: false });

        if (!valid) { return this.setState({ invalid: true }); }

        this._valueTransaction(function (value) {

          this.setState({
            tag: ""
            , invalid: false
          }, function () {
            this.props.onTagAdd(newTag);
          });

          return value.concat([newTag]);
        }.bind(this), newTag);
      }.bind(this));
    }

    , removeTag: function (tag) {
      this._valueTransaction(function (value) {
        var clone = value.concat([]);

        for (var i = 0; i < clone.length; i += 1) {
          if (clone[i] === tag) {
            clone.splice(i, 1);

            this.setState({
              invalid: false
            }, function () {
              this.props.onTagRemove(tag);
            });

            return clone;
          }
        }
      }.bind(this), tag);
    }

    , onKeyDown: function (e) {
      var add = this.props.addKeys.indexOf(e.keyCode) !== -1
        , remove = this.props.removeKeys.indexOf(e.keyCode) !== -1;

      if (add) {
        e.preventDefault();
        this.addTag(this.state.tag);
      }

      if (remove && this._value().length > 0 && this.state.tag === "") {
        this.removeTag(this._value()[this._value().length - 1]);
      }

      if (!add && !remove) {
        this.props.onKeyDown(e);
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

      if (this.props.addOnBlur) {
        this.addTag(tag);
      }

      this.props.onBlur();
    }

    , clear: function () {
      this.setState({ tag: "", invalid: false });
    }

    , focus: function () {
      this.refs.input.getDOMNode().focus();
    }

    , handleClick: function (e) {
      if (e.target === this.getDOMNode()) {
        this.focus();
      }
    }

    , render: function() {
      var ns = this.props.classNamespace === "" ? "" : this.props.classNamespace + "-";

      var tagNodes = this._value().map(function (tag, i) {
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
          , onClick: this.handleClick
        }, tagNodes, React.createElement(Input, {
          ref: "input"
          , ns: ns
          , placeholder: this.props.placeholder
          , value: this.state.tag
          , invalid: this.state.invalid
          , validating: this.state.validating
          , onKeyDown: this.onKeyDown
          , onKeyUp: this.props.onKeyUp
          , onChange: this.onChange
          , onBlur: this.onBlur
        }))
      );
    }
  });

  return TagsInput;
});
