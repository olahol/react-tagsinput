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

      var inputClass = ns + "tagsinput-input "
        + (this.props.invalid ? ns + "tagsinput-invalid" : "");

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
        }, this.props.tag + " ", React.createElement("a", {
          onClick: this.props.remove
          , className: this.props.ns + "tagsinput-remove"
        }))
      );
    }
  });

  var TagsInput = React.createClass({
    getDefaultProps: function () {
      return {
        tags: []
        , placeholder: "Add a tag"
        , validate: function (tag) { return tag !== ""; }
        , addKeys: [13, 9]
        , removeKeys: [8]
        , onBeforeTagAdd: function () { return true; }
        , onBeforeTagRemove: function () { return true; }
        , onTagAdd: function () { }
        , onTagRemove: function () { }
        , onChange: function () { }
        , onChangeInput: function () { }
        , onBlur: function () { }
        , classNamespace: "react"
        , addOnBlur: true
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

    , addTag: function (tag, cb) {
      var before = this.props.onBeforeTagAdd(tag);
      var valid =  !!before && this.props.validate(tag);

      tag = typeof before === "string" ? before : tag;

      if (this.state.tags.indexOf(tag) !== -1 || !valid) {
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
        if (cb) {
          return cb();
        }
      });
    }

    , removeTag: function (tag) {
      var valid = this.props.onBeforeTagRemove(tag);

      if (!valid) { return ; }

      var tags = this.state.tags.slice(0)
        , i = tags.indexOf(tag);

      tags.splice(i, 1);

      this.setState({
        tags: tags
        , invalid: false
      }, function () {
        this.props.onTagRemove(tag);
        this.props.onChange(this.state.tags);
      });
    }

    , onKeyDown: function (e) {
      var add = this.props.addKeys.indexOf(e.keyCode) !== -1
        , remove = this.props.removeKeys.indexOf(e.keyCode) !== -1;

      if (add) {
        e.preventDefault();
        this.addTag(this.state.tag.trim());
      }

      if (remove && this.state.tags.length > 0 && this.state.tag === "") {
        this.removeTag(this.state.tags[this.state.tags.length - 1]);
      }
    }

    , onChange: function (e) {
      this.props.onChangeInput(e.target.value);
      this.setState({
        tag: e.target.value
        , invalid: false
      });
    }

    , onBlur: function (e) {
      var _this = this;
      if (!this.props.addOnBlur) {
        this.props.onBlur(this.state.tags);
        return ;
      }

      if (this.state.tag !== "" && !this.state.invalid) {
        return this.addTag(this.state.tag.trim(), function () {
          _this.props.onBlur(_this.state.tags);
        });
      }

      _this.props.onBlur(_this.state.tags);
    }

    , inputFocus: function () {
      this.refs.input.getDOMNode().focus();
    }

    , render: function() {
      var ns = this.props.classNamespace === "" ? "" : this.props.classNamespace + "-";

      var tagNodes = this.state.tags.map(function (tag, i) {
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
          , onKeyDown: this.onKeyDown
          , onChange: this.onChange
          , onBlur: this.onBlur
        }))
      );
    }
  });

  return TagsInput;
});
