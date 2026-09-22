function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("ReactTagsInput", ["exports", "react", "prop-types"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"), require("prop-types"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React, global.propTypes);
    global.ReactTagsInput = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _react, _propTypes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  var _excluded = ["tag", "key", "disabled", "onRemove", "classNameRemove", "getTagDisplayValue"],
    _excluded2 = ["addTag"],
    _excluded3 = ["onChange", "value"],
    _excluded4 = ["onChange", "onFocus", "onBlur"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
  function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
  function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
  function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
  function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
  function uniq(arr) {
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      if (out.indexOf(arr[i]) === -1) {
        out.push(typeof arr[i] === 'string' ? arr[i].trim() : arr[i]);
      }
    }
    return out;
  }

  /* istanbul ignore next */
  function getClipboardData(e) {
    if (window.clipboardData) {
      return window.clipboardData.getData('Text');
    }
    if (e.clipboardData) {
      return e.clipboardData.getData('text/plain');
    }
    return '';
  }
  function defaultRenderTag(props) {
    var tag = props.tag,
      key = props.key,
      disabled = props.disabled,
      onRemove = props.onRemove,
      classNameRemove = props.classNameRemove,
      getTagDisplayValue = props.getTagDisplayValue,
      other = _objectWithoutProperties(props, _excluded);
    return /*#__PURE__*/_react.default.createElement("span", _objectSpread({
      key: key
    }, other), getTagDisplayValue(tag), !disabled && /*#__PURE__*/_react.default.createElement("a", {
      className: classNameRemove,
      onClick: function onClick(e) {
        return onRemove(key);
      }
    }));
  }
  function defaultRenderInput(_ref) {
    var addTag = _ref.addTag,
      props = _objectWithoutProperties(_ref, _excluded2);
    var onChange = props.onChange,
      value = props.value,
      other = _objectWithoutProperties(props, _excluded3);
    return /*#__PURE__*/_react.default.createElement("input", _objectSpread({
      type: "text",
      onChange: onChange,
      value: value
    }, other));
  }
  function defaultRenderLayout(tagComponents, inputComponent) {
    return /*#__PURE__*/_react.default.createElement("span", null, tagComponents, inputComponent);
  }
  function defaultPasteSplit(data) {
    return data.split(' ').map(function (d) {
      return d.trim();
    });
  }
  var defaultInputProps = {
    className: 'react-tagsinput-input',
    placeholder: 'Add a tag'
  };
  var TagsInput = /*#__PURE__*/function (_React$Component) {
    /* istanbul ignore next */
    function TagsInput() {
      var _this;
      _classCallCheck(this, TagsInput);
      _this = _callSuper(this, TagsInput);
      _this.state = {
        tag: '',
        isFocused: false
      };
      _this.focus = _this.focus.bind(_this);
      _this.blur = _this.blur.bind(_this);
      _this.accept = _this.accept.bind(_this);
      return _this;
    }
    _inherits(TagsInput, _React$Component);
    return _createClass(TagsInput, [{
      key: "_getTagDisplayValue",
      value: function _getTagDisplayValue(tag) {
        var tagDisplayProp = this.props.tagDisplayProp;
        if (tagDisplayProp) {
          return tag[tagDisplayProp];
        }
        return tag;
      }
    }, {
      key: "_makeTag",
      value: function _makeTag(tag) {
        var tagDisplayProp = this.props.tagDisplayProp;
        if (tagDisplayProp) {
          return _defineProperty({}, tagDisplayProp, tag);
        }
        return tag;
      }
    }, {
      key: "_removeTag",
      value: function _removeTag(index) {
        var value = this.props.value.concat([]);
        if (index > -1 && index < value.length) {
          var changed = value.splice(index, 1);
          this.props.onChange(value, changed, [index]);
        }
      }
    }, {
      key: "_clearInput",
      value: function _clearInput() {
        if (this.hasControlledInput()) {
          this.props.onChangeInput('');
        } else {
          this.setState({
            tag: ''
          });
        }
      }
    }, {
      key: "_tag",
      value: function _tag() {
        if (this.hasControlledInput()) {
          return this.props.inputValue;
        }
        return this.state.tag;
      }
    }, {
      key: "_addTags",
      value: function _addTags(tags) {
        var _this2 = this;
        var _this$props = this.props,
          onChange = _this$props.onChange,
          onValidationReject = _this$props.onValidationReject,
          onlyUnique = _this$props.onlyUnique,
          maxTags = _this$props.maxTags,
          value = _this$props.value;
        if (onlyUnique) {
          tags = uniq(tags);
          tags = tags.filter(function (tag) {
            return value.every(function (currentTag) {
              return _this2._getTagDisplayValue(currentTag) !== _this2._getTagDisplayValue(tag);
            });
          });
        }
        var rejectedTags = tags.filter(function (tag) {
          return !_this2._validate(_this2._getTagDisplayValue(tag));
        });
        tags = tags.filter(function (tag) {
          return _this2._validate(_this2._getTagDisplayValue(tag));
        });
        tags = tags.filter(function (tag) {
          var tagDisplayValue = _this2._getTagDisplayValue(tag);
          if (typeof tagDisplayValue.trim === 'function') {
            return tagDisplayValue.trim().length >= 0;
          } else {
            return tagDisplayValue;
          }
        });
        if (maxTags >= 0) {
          var remainingLimit = Math.max(maxTags - value.length, 0);
          tags = tags.slice(0, remainingLimit);
        }
        if (onValidationReject && rejectedTags.length > 0) {
          onValidationReject(rejectedTags);
        }
        if (tags.length > 0) {
          var newValue = value.concat(tags);
          var indexes = [];
          for (var i = 0; i < tags.length; i++) {
            indexes.push(value.length + i);
          }
          onChange(newValue, tags, indexes);
          this._clearInput();
          return true;
        }
        if (rejectedTags.length > 0) {
          return false;
        }
        this._clearInput();
        return false;
      }
    }, {
      key: "_validate",
      value: function _validate(tag) {
        var _this$props2 = this.props,
          validate = _this$props2.validate,
          validationRegex = _this$props2.validationRegex;
        return validate(tag) && validationRegex.test(tag);
      }
    }, {
      key: "_shouldPreventDefaultEventOnAdd",
      value: function _shouldPreventDefaultEventOnAdd(added, empty, key) {
        if (added) {
          return true;
        }
        if (key === 'Enter') {
          return this.props.preventSubmit || !this.props.preventSubmit && !empty;
        }
        return false;
      }
    }, {
      key: "focus",
      value: function focus() {
        if (this.input && typeof this.input.focus === 'function') {
          this.input.focus();
        }
        this.handleOnFocus();
      }
    }, {
      key: "blur",
      value: function blur() {
        if (this.input && typeof this.input.blur === 'function') {
          this.input.blur();
        }
        this.handleOnBlur();
      }
    }, {
      key: "accept",
      value: function accept() {
        var preventSubmit = this.props.preventSubmit;
        var tag = this._tag();
        if (tag !== '' || !preventSubmit) {
          tag = this._makeTag(tag);
          return this._addTags([tag]);
        }
        return false;
      }
    }, {
      key: "addTag",
      value: function addTag(tag) {
        return this._addTags([tag]);
      }
    }, {
      key: "clearInput",
      value: function clearInput() {
        this._clearInput();
      }
    }, {
      key: "handlePaste",
      value: function handlePaste(e) {
        var _this3 = this;
        var _this$props3 = this.props,
          addOnPaste = _this$props3.addOnPaste,
          pasteSplit = _this$props3.pasteSplit;
        if (!addOnPaste) {
          return;
        }
        e.preventDefault();
        var data = getClipboardData(e);
        var tags = pasteSplit(data).map(function (tag) {
          return _this3._makeTag(tag);
        });
        this._addTags(tags);
      }
    }, {
      key: "handleKeyDown",
      value: function handleKeyDown(e) {
        if (e.defaultPrevented) {
          return;
        }
        var _this$props4 = this.props,
          value = _this$props4.value,
          removeKeys = _this$props4.removeKeys,
          addKeys = _this$props4.addKeys;
        var tag = this._tag();
        var empty = tag === '';
        var keyCode = e.keyCode;
        var key = e.key;
        var add = addKeys.indexOf(keyCode) !== -1 || addKeys.indexOf(key) !== -1;
        var remove = removeKeys.indexOf(keyCode) !== -1 || removeKeys.indexOf(key) !== -1;
        if (add) {
          var added = this.accept();
          if (this._shouldPreventDefaultEventOnAdd(added, empty, key)) {
            e.preventDefault();
          }
        }
        if (remove && value.length > 0 && empty) {
          e.preventDefault();
          this._removeTag(value.length - 1);
        }
      }
    }, {
      key: "handleClick",
      value: function handleClick(e) {
        var clickedElement = e.target;
        var parentElement = e.target && e.target.parentElement;
        if (clickedElement === this.div || parentElement === this.div) {
          this.focus();
        }
      }
    }, {
      key: "handleChange",
      value: function handleChange(e) {
        var onChangeInput = this.props.onChangeInput;
        var onChange = this.props.inputProps.onChange;
        var tag = e.target.value;
        if (onChange) {
          onChange(e);
        }
        if (this.hasControlledInput()) {
          onChangeInput(tag);
        } else {
          this.setState({
            tag: tag
          });
        }
      }
    }, {
      key: "handleOnFocus",
      value: function handleOnFocus(e) {
        var onFocus = this.props.inputProps.onFocus;
        if (onFocus) {
          onFocus(e);
        }
        this.setState({
          isFocused: true
        });
      }
    }, {
      key: "handleOnBlur",
      value: function handleOnBlur(e) {
        var onBlur = this.props.inputProps.onBlur;
        this.setState({
          isFocused: false
        });
        if (e == null) {
          return;
        }
        if (onBlur) {
          onBlur(e);
        }
        if (this.props.addOnBlur && e.target.value) {
          var tag = this._makeTag(e.target.value);
          this._addTags([tag]);
        }
      }
    }, {
      key: "handleRemove",
      value: function handleRemove(tag) {
        this._removeTag(tag);
      }
    }, {
      key: "inputProps",
      value: function inputProps() {
        var _this$props$inputProp = this.props.inputProps,
          onChange = _this$props$inputProp.onChange,
          onFocus = _this$props$inputProp.onFocus,
          onBlur = _this$props$inputProp.onBlur,
          otherInputProps = _objectWithoutProperties(_this$props$inputProp, _excluded4);
        var props = _objectSpread(_objectSpread({}, defaultInputProps), otherInputProps);
        if (this.props.disabled) {
          props.disabled = true;
        }
        return props;
      }
    }, {
      key: "inputValue",
      value: function inputValue(props) {
        return props.currentValue || props.inputValue || '';
      }
    }, {
      key: "hasControlledInput",
      value: function hasControlledInput() {
        var _this$props5 = this.props,
          inputValue = _this$props5.inputValue,
          onChangeInput = _this$props5.onChangeInput;
        return typeof onChangeInput === 'function' && typeof inputValue === 'string';
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.hasControlledInput()) {
          return;
        }
        this.setState({
          tag: this.inputValue(this.props)
        });
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        /* istanbul ignore next */
        if (this.hasControlledInput()) {
          return;
        }
        if (!this.inputValue(this.props)) {
          return;
        }
        if (this.inputValue(prevProps) !== this.inputValue(this.props)) {
          this.setState({
            tag: this.inputValue(this.props)
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this4 = this;
        var _this$props6 = this.props,
          value = _this$props6.value,
          tagProps = _this$props6.tagProps,
          renderLayout = _this$props6.renderLayout,
          renderTag = _this$props6.renderTag,
          renderInput = _this$props6.renderInput,
          className = _this$props6.className,
          focusedClassName = _this$props6.focusedClassName,
          disabled = _this$props6.disabled;
        var isFocused = this.state.isFocused;
        var tagComponents = value.map(function (tag, index) {
          return renderTag(_objectSpread({
            key: index,
            tag: tag,
            onRemove: _this4.handleRemove.bind(_this4),
            disabled: disabled,
            getTagDisplayValue: _this4._getTagDisplayValue.bind(_this4)
          }, tagProps));
        });
        var inputComponent = renderInput(_objectSpread({
          ref: function ref(r) {
            _this4.input = r;
          },
          value: this._tag(),
          onPaste: this.handlePaste.bind(this),
          onKeyDown: this.handleKeyDown.bind(this),
          onChange: this.handleChange.bind(this),
          onFocus: this.handleOnFocus.bind(this),
          onBlur: this.handleOnBlur.bind(this),
          addTag: this.addTag.bind(this)
        }, this.inputProps()));
        return /*#__PURE__*/_react.default.createElement("div", {
          ref: function ref(r) {
            _this4.div = r;
          },
          onClick: this.handleClick.bind(this),
          className: className + (isFocused ? ' ' + focusedClassName : '')
        }, renderLayout(tagComponents, inputComponent));
      }
    }]);
  }(_react.default.Component);
  _defineProperty(TagsInput, "defaultProps", {
    className: 'react-tagsinput',
    focusedClassName: 'react-tagsinput--focused',
    addKeys: ['Tab', 'Enter'],
    addOnBlur: false,
    addOnPaste: false,
    inputProps: {},
    removeKeys: ['Backspace'],
    renderInput: defaultRenderInput,
    renderTag: defaultRenderTag,
    renderLayout: defaultRenderLayout,
    pasteSplit: defaultPasteSplit,
    tagProps: {
      className: 'react-tagsinput-tag',
      classNameRemove: 'react-tagsinput-remove'
    },
    onlyUnique: false,
    maxTags: -1,
    validate: function validate() {
      return true;
    },
    validationRegex: /.*/,
    disabled: false,
    tagDisplayProp: null,
    preventSubmit: true
  });
  var _default = _exports.default = TagsInput;
});
if (typeof module === 'object' && module.exports) {
  module.exports = module.exports.default;
}
