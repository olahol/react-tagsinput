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
  var _excluded = ["onChange", "onFocus", "onBlur", "onKeyDown", "onPaste"],
    _excluded2 = ["ref"],
    _excluded3 = ["tag", "key", "disabled", "onRemove", "classNameRemove", "getTagDisplayValue"],
    _excluded4 = ["addTag"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
  function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
  function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
  function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
  function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
  function trim(value) {
    return typeof value === 'string' ? value.trim() : value;
  }
  function hasValue(value) {
    var trimmed = trim(value);
    return trimmed === 0 || Boolean(trimmed);
  }
  function matchesKey(keys, keyCode, key) {
    return keys.indexOf(keyCode) !== -1 || keys.indexOf(key) !== -1;
  }

  /* istanbul ignore next */
  function clipboardText(event) {
    if (window.clipboardData) {
      return window.clipboardData.getData('Text');
    }
    return event.clipboardData ? event.clipboardData.getData('text/plain') : '';
  }
  var TagsInput = /*#__PURE__*/function (_React$Component) {
    function TagsInput(props) {
      var _this;
      _classCallCheck(this, TagsInput);
      _this = _callSuper(this, TagsInput, [props]);
      _this.state = {
        tag: _this.inputValue(props),
        isFocused: false
      };
      _this.pendingRemovals = [];
      _this.pendingAdditions = [];
      _this.pendingInputClear = false;
      _this.focus = _this.focus.bind(_this);
      _this.blur = _this.blur.bind(_this);
      _this.accept = _this.accept.bind(_this);
      _this.addTag = _this.addTag.bind(_this);
      _this.handleClick = _this.handleClick.bind(_this);
      _this.handlePaste = _this.handlePaste.bind(_this);
      _this.handleKeyDown = _this.handleKeyDown.bind(_this);
      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleOnFocus = _this.handleOnFocus.bind(_this);
      _this.handleOnBlur = _this.handleOnBlur.bind(_this);
      _this.handleRemove = _this.handleRemove.bind(_this);
      _this._getTagDisplayValue = _this._getTagDisplayValue.bind(_this);
      return _this;
    }
    _inherits(TagsInput, _React$Component);
    return _createClass(TagsInput, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        this.pendingRemovals = [];
        this.pendingAdditions = [];
        if (this.hasControlledInput()) {
          return;
        }
        var tag = this.inputValue(this.props);
        if (this.hasControlledInput(prevProps) || this.props.currentValue !== prevProps.currentValue || tag !== this.inputValue(prevProps)) {
          this.setState({
            tag: tag
          });
        }
      }
    }, {
      key: "focus",
      value: function focus() {
        if (this.props.disabled || this.props.inputProps.disabled) {
          return;
        }
        this.handleOnFocus();
        if (this.input && typeof this.input.focus === 'function') {
          this.input.focus();
        }
      }
    }, {
      key: "blur",
      value: function blur() {
        this.handleOnBlur();
        if (this.input && typeof this.input.blur === 'function') {
          this.input.blur();
        }
      }
    }, {
      key: "accept",
      value: function accept() {
        var tag = this._tag();
        if (tag === '') {
          return false;
        }
        return this._addTags([this._makeTag(tag)]);
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
      key: "inputValue",
      value: function inputValue(props) {
        return props.currentValue == null ? props.inputValue || '' : props.currentValue;
      }
    }, {
      key: "hasControlledInput",
      value: function hasControlledInput() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
        var inputValue = props.inputValue,
          onChangeInput = props.onChangeInput;
        return typeof inputValue === 'string' && typeof onChangeInput === 'function';
      }
    }, {
      key: "inputProps",
      value: function inputProps() {
        var _this$props$inputProp = this.props.inputProps,
          onChange = _this$props$inputProp.onChange,
          onFocus = _this$props$inputProp.onFocus,
          onBlur = _this$props$inputProp.onBlur,
          onKeyDown = _this$props$inputProp.onKeyDown,
          onPaste = _this$props$inputProp.onPaste,
          props = _objectWithoutProperties(_this$props$inputProp, _excluded);
        return _objectSpread(_objectSpread({
          className: 'react-tagsinput-input',
          placeholder: 'Add a tag'
        }, props), this.props.disabled ? {
          disabled: true
        } : {});
      }
    }, {
      key: "_tag",
      value: function _tag() {
        return this.pendingInputClear ? '' : this._inputText();
      }
    }, {
      key: "_inputText",
      value: function _inputText() {
        var value = this.props.inputProps.value;
        if (value != null) {
          return value;
        }
        return this.hasControlledInput() ? this.props.inputValue : this.state.tag;
      }
    }, {
      key: "_clearInput",
      value: function _clearInput() {
        var _this2 = this;
        this.pendingInputClear = true;
        var controlled = this.hasControlledInput();
        if (controlled) {
          this.props.onChangeInput('');
        }
        this.setState(controlled ? {} : {
          tag: ''
        }, function () {
          _this2.pendingInputClear = false;
        });
      }
    }, {
      key: "_getTagDisplayValue",
      value: function _getTagDisplayValue(tag) {
        var tagDisplayProp = this.props.tagDisplayProp;
        return tagDisplayProp && tag != null ? tag[tagDisplayProp] : tag;
      }
    }, {
      key: "_getInputRef",
      value: function _getInputRef(ref) {
        var _this3 = this;
        if (this.inputRef && this.inputRef.ref === ref) {
          return this.inputRef.callback;
        }
        var callback = function callback(input) {
          _this3.input = input;
          if (typeof ref === 'function') {
            var cleanup = ref(input);
            if (typeof cleanup === 'function') {
              return function () {
                _this3.input = null;
                cleanup();
              };
            }
          } else if (ref) {
            ref.current = input;
          }
        };
        this.inputRef = {
          ref: ref,
          callback: callback
        };
        return callback;
      }
    }, {
      key: "_makeTag",
      value: function _makeTag(text) {
        var tagDisplayProp = this.props.tagDisplayProp;
        return tagDisplayProp ? _defineProperty({}, tagDisplayProp, text) : text;
      }
    }, {
      key: "_keptIndexes",
      value: function _keptIndexes() {
        var _this4 = this;
        return this.props.value.map(function (tag, index) {
          return index;
        }).filter(function (index) {
          return _this4.pendingRemovals.indexOf(index) === -1;
        });
      }
    }, {
      key: "_value",
      value: function _value() {
        var _this5 = this;
        return this._keptIndexes().map(function (index) {
          return _this5.props.value[index];
        }).concat(this.pendingAdditions);
      }
    }, {
      key: "_change",
      value: function _change(value, changed, indexes) {
        this.props.onChange(value, changed, indexes);
        this.setState({});
      }
    }, {
      key: "_removeTag",
      value: function _removeTag(index) {
        var value = this._value();
        if (!(index > -1 && index < value.length)) {
          return;
        }
        var kept = this._keptIndexes();
        if (index < kept.length) {
          this.pendingRemovals.push(kept[index]);
        } else {
          this.pendingAdditions.splice(index - kept.length, 1);
        }
        this._change(value.filter(function (_tag, i) {
          return i !== index;
        }), [value[index]], [index]);
      }
    }, {
      key: "_uniqueTags",
      value: function _uniqueTags(tags) {
        var _this6 = this;
        var keys = this._value().map(function (tag) {
          return _this6._getTagDisplayValue(trim(tag));
        });
        return tags.map(trim).filter(function (tag) {
          var key = _this6._getTagDisplayValue(tag);
          if (keys.indexOf(key) !== -1) {
            return false;
          }
          keys.push(key);
          return true;
        });
      }
    }, {
      key: "_addTags",
      value: function _addTags(tags) {
        var _this7 = this;
        var _this$props = this.props,
          onlyUnique = _this$props.onlyUnique,
          maxTags = _this$props.maxTags,
          onValidationReject = _this$props.onValidationReject,
          validate = _this$props.validate,
          validationRegex = _this$props.validationRegex;
        var candidates = onlyUnique ? this._uniqueTags(tags) : tags;
        var rejected = [];
        var accepted = candidates.filter(function (tag) {
          var value = _this7._getTagDisplayValue(tag);
          if (!hasValue(value)) {
            return false;
          }
          var valid = validate(value) && String(value).search(validationRegex) !== -1;
          if (!valid) {
            rejected.push(tag);
          }
          return valid;
        });
        if (onValidationReject && rejected.length > 0) {
          onValidationReject(rejected);
        }
        var unique = onlyUnique ? this._uniqueTags(accepted) : accepted;
        var value = this._value();
        var added = maxTags < 0 ? unique : unique.slice(0, Math.max(0, maxTags - value.length));
        if (added.length === 0) {
          if (rejected.length === 0) {
            this._clearInput();
          }
          return false;
        }
        var indexes = added.map(function (_tag, index) {
          return value.length + index;
        });
        this.pendingInputClear = true;
        this.pendingAdditions = this.pendingAdditions.concat(added);
        this._change(value.concat(added), added, indexes);
        this._clearInput();
        return true;
      }
    }, {
      key: "_forward",
      value: function _forward(name, event) {
        var callback = this.props.inputProps[name];
        if (event != null && callback) {
          callback(event);
        }
      }
    }, {
      key: "handleChange",
      value: function handleChange(event) {
        var onChangeInput = this.props.onChangeInput;
        var tag = event.target.value;
        this.pendingInputClear = false;
        this._forward('onChange', event);
        if (this.hasControlledInput()) {
          onChangeInput(tag);
          return;
        }
        this.setState({
          tag: tag
        });
      }
    }, {
      key: "handlePaste",
      value: function handlePaste(event) {
        var _this8 = this;
        var _this$props2 = this.props,
          addOnPaste = _this$props2.addOnPaste,
          pasteSplit = _this$props2.pasteSplit;
        this._forward('onPaste', event);
        if (!addOnPaste || event.defaultPrevented) {
          return;
        }
        event.preventDefault();
        this._addTags(pasteSplit(clipboardText(event)).map(function (tag) {
          return _this8._makeTag(tag);
        }));
      }
    }, {
      key: "handleKeyDown",
      value: function handleKeyDown(event) {
        this._forward('onKeyDown', event);
        if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229) {
          return;
        }
        var _this$props3 = this.props,
          addKeys = _this$props3.addKeys,
          removeKeys = _this$props3.removeKeys,
          preventSubmit = _this$props3.preventSubmit;
        var value = this._value();
        var empty = this._tag() === '';
        var keyCode = event.keyCode,
          key = event.key;
        var add = matchesKey(addKeys, keyCode, key);
        var remove = matchesKey(removeKeys, keyCode, key);
        if (add && (this.accept() || key === 'Enter' && (preventSubmit || !empty))) {
          event.preventDefault();
        }
        if (remove && empty && value.length > 0) {
          event.preventDefault();
          this._removeTag(value.length - 1);
        }
      }
    }, {
      key: "handleOnFocus",
      value: function handleOnFocus(event) {
        this.setState({
          isFocused: true
        });
        this._forward('onFocus', event);
      }
    }, {
      key: "handleOnBlur",
      value: function handleOnBlur(event) {
        this.setState({
          isFocused: false
        });
        this._forward('onBlur', event);
        if (event && this.props.addOnBlur && !this.pendingInputClear && event.target.value) {
          this._addTags([this._makeTag(event.target.value)]);
        }
      }
    }, {
      key: "handleClick",
      value: function handleClick(_ref2) {
        var target = _ref2.target;
        if (target === this.div || target.parentElement === this.div) {
          this.focus();
        }
      }
    }, {
      key: "handleRemove",
      value: function handleRemove(index) {
        if (this.pendingRemovals.indexOf(index) !== -1) {
          return;
        }
        var offset = this.pendingRemovals.filter(function (removed) {
          return removed < index;
        }).length;
        this._removeTag(index - offset);
      }
    }, {
      key: "render",
      value: function render() {
        var _this9 = this;
        var _this$props4 = this.props,
          value = _this$props4.value,
          tagProps = _this$props4.tagProps,
          renderTag = _this$props4.renderTag,
          renderInput = _this$props4.renderInput,
          renderLayout = _this$props4.renderLayout,
          disabled = _this$props4.disabled;
        var _this$props5 = this.props,
          className = _this$props5.className,
          focusedClassName = _this$props5.focusedClassName;
        var wrapperClassName = className + (this.state.isFocused ? ' ' + focusedClassName : '');
        var tags = value.map(function (tag, key) {
          return renderTag(_objectSpread({
            key: key,
            tag: tag,
            onRemove: _this9.handleRemove,
            disabled: disabled,
            getTagDisplayValue: _this9._getTagDisplayValue
          }, tagProps));
        });
        var _this$inputProps = this.inputProps(),
          ref = _this$inputProps.ref,
          inputProps = _objectWithoutProperties(_this$inputProps, _excluded2);
        var input = renderInput(_objectSpread(_objectSpread({
          onPaste: this.handlePaste,
          onKeyDown: this.handleKeyDown,
          onChange: this.handleChange,
          onFocus: this.handleOnFocus,
          onBlur: this.handleOnBlur,
          addTag: this.addTag
        }, inputProps), {}, {
          value: this._inputText(),
          ref: this._getInputRef(ref)
        }));
        return /*#__PURE__*/_react.default.createElement("div", {
          className: wrapperClassName,
          onClick: this.handleClick,
          ref: function ref(div) {
            _this9.div = div;
          }
        }, renderLayout(tags, input));
      }
    }]);
  }(_react.default.Component);
  function defaultRenderTag(_ref3) {
    var tag = _ref3.tag,
      key = _ref3.key,
      disabled = _ref3.disabled,
      onRemove = _ref3.onRemove,
      classNameRemove = _ref3.classNameRemove,
      getTagDisplayValue = _ref3.getTagDisplayValue,
      props = _objectWithoutProperties(_ref3, _excluded3);
    return /*#__PURE__*/_react.default.createElement("span", _objectSpread({
      key: key
    }, props), getTagDisplayValue(tag), !disabled && /*#__PURE__*/_react.default.createElement("a", {
      className: classNameRemove,
      onClick: function onClick() {
        return onRemove(key);
      }
    }));
  }
  function defaultRenderInput(_ref4) {
    var addTag = _ref4.addTag,
      props = _objectWithoutProperties(_ref4, _excluded4);
    return /*#__PURE__*/_react.default.createElement("input", _objectSpread({
      type: "text"
    }, props));
  }
  function defaultRenderLayout(tags, input) {
    return /*#__PURE__*/_react.default.createElement("span", null, tags, input);
  }
  function defaultPasteSplit(text) {
    return text.split(' ').map(function (tag) {
      return tag.trim();
    });
  }
  TagsInput.defaultProps = {
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
  };
  var _default = _exports.default = TagsInput;
});
if (typeof module === 'object' && module.exports) {
  module.exports = module.exports.default;
}
