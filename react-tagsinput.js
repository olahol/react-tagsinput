(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ReactTagsInput', ['module', 'exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.React);
    global.ReactTagsInput = mod.exports;
  }
})(this, function (module, exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _objectWithoutProperties(obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function uniq(arr) {
    var out = [];

    for (var i = 0; i < arr.length; i++) {
      if (out.indexOf(arr[i]) === -1) {
        out.push(arr[i]);
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

  var Tag = function (_React$Component) {
    _inherits(Tag, _React$Component);

    function Tag(props) {
      _classCallCheck(this, Tag);

      var _this = _possibleConstructorReturn(this, (Tag.__proto__ || Object.getPrototypeOf(Tag)).call(this, props));

      _this.state = {
        isEdited: false,
        displayValue: props.getTagDisplayValue(props.tag)
      };
      return _this;
    }

    _createClass(Tag, [{
      key: 'handleDoubleClick',
      value: function handleDoubleClick() {
        var _this2 = this;

        this.setState({ isEdited: true }, function () {
          _this2.input.focus();
          _this2.input.select();
        });
      }
    }, {
      key: 'handleChange',
      value: function handleChange(e) {
        this.setState({ displayValue: e.target.value });
      }
    }, {
      key: 'handleKeyDown',
      value: function handleKeyDown(e) {
        var save = e.keyCode === 13;
        var cancel = e.keyCode === 27;

        if (!save && !cancel) return;

        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        this.setState({ isEdited: false });

        var _props = this.props;
        var index = _props.index;
        var tag = _props.tag;
        var tagDisplayProp = _props.tagDisplayProp;
        var onEdit = _props.onEdit;
        var getTagDisplayValue = _props.getTagDisplayValue;
        var displayValue = this.state.displayValue;


        if (save && displayValue !== '') {
          onEdit(index, tagDisplayProp ? _extends({}, tag, _defineProperty({}, tagDisplayProp, displayValue)) : displayValue);
        }

        if (cancel || displayValue === '') {
          this.setState({ displayValue: getTagDisplayValue(tag) });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var _state = this.state;
        var isEdited = _state.isEdited;
        var displayValue = _state.displayValue;
        var _props2 = this.props;
        var index = _props2.index;
        var disabled = _props2.disabled;
        var onRemove = _props2.onRemove;
        var className = _props2.className;
        var classNameRemove = _props2.classNameRemove;


        return _react2.default.createElement(
          'span',
          { className: className, onDoubleClick: this.handleDoubleClick.bind(this) },
          !isEdited && displayValue,
          isEdited && _react2.default.createElement('input', {
            type: 'text',
            className: className + '-input',
            ref: function ref(input) {
              return _this3.input = input;
            },
            value: displayValue,
            onChange: this.handleChange.bind(this),
            onKeyDown: this.handleKeyDown.bind(this)
          }),
          !disabled && _react2.default.createElement('a', { className: classNameRemove, onClick: function onClick(e) {
              return onRemove(index);
            } })
        );
      }
    }]);

    return Tag;
  }(_react2.default.Component);

  Tag.propTypes = {
    index: _react2.default.PropTypes.number,
    tag: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.object]),
    onEdit: _react2.default.PropTypes.func,
    onRemove: _react2.default.PropTypes.func,
    classNameRemove: _react2.default.PropTypes.string,
    getTagDisplayValue: _react2.default.PropTypes.func
  };


  function defaultRenderTag(props) {
    var key = props.key;

    var other = _objectWithoutProperties(props, ['key']);

    return _react2.default.createElement(Tag, _extends({ index: key, key: key }, other));
  }

  defaultRenderTag.propTypes = {
    key: _react2.default.PropTypes.number,
    tag: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.object]),
    onEdit: _react2.default.PropTypes.func,
    onRemove: _react2.default.PropTypes.func,
    classNameRemove: _react2.default.PropTypes.string,
    getTagDisplayValue: _react2.default.PropTypes.func
  };

  function defaultRenderInput(props) {
    var onChange = props.onChange;
    var value = props.value;
    var addTag = props.addTag;

    var other = _objectWithoutProperties(props, ['onChange', 'value', 'addTag']);

    return _react2.default.createElement('input', _extends({ type: 'text', onChange: onChange, value: value }, other));
  }

  defaultRenderInput.propTypes = {
    value: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    addTag: _react2.default.PropTypes.func
  };

  function defaultRenderLayout(tagComponents, inputComponent) {
    return _react2.default.createElement(
      'span',
      null,
      tagComponents,
      inputComponent
    );
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

  var TagsInput = function (_React$Component2) {
    _inherits(TagsInput, _React$Component2);

    function TagsInput() {
      _classCallCheck(this, TagsInput);

      var _this4 = _possibleConstructorReturn(this, (TagsInput.__proto__ || Object.getPrototypeOf(TagsInput)).call(this));

      _this4.state = { tag: '', isFocused: false };
      _this4.focus = _this4.focus.bind(_this4);
      _this4.blur = _this4.blur.bind(_this4);
      return _this4;
    }

    _createClass(TagsInput, [{
      key: '_getTagDisplayValue',
      value: function _getTagDisplayValue(tag) {
        var tagDisplayProp = this.props.tagDisplayProp;


        if (tagDisplayProp) {
          return tag[tagDisplayProp];
        }

        return tag;
      }
    }, {
      key: '_makeTag',
      value: function _makeTag(tag) {
        var tagDisplayProp = this.props.tagDisplayProp;


        if (tagDisplayProp) {
          return _defineProperty({}, tagDisplayProp, tag);
        }

        return tag;
      }
    }, {
      key: '_editTag',
      value: function _editTag(index, tag) {
        var value = this.props.value;

        value[index] = tag;
        this.props.onChange(value, [tag], [index]);
      }
    }, {
      key: '_removeTag',
      value: function _removeTag(index) {
        var value = this.props.value.concat([]);
        if (index > -1 && index < value.length) {
          var changed = value.splice(index, 1);
          this.props.onChange(value, changed, [index]);
        }
      }
    }, {
      key: '_clearInput',
      value: function _clearInput() {
        this.setState({ tag: '' });
      }
    }, {
      key: '_addTags',
      value: function _addTags(tags) {
        var _this5 = this;

        var _props3 = this.props;
        var validationRegex = _props3.validationRegex;
        var onChange = _props3.onChange;
        var onlyUnique = _props3.onlyUnique;
        var maxTags = _props3.maxTags;
        var value = _props3.value;


        if (onlyUnique) {
          tags = uniq(tags);
          tags = tags.filter(function (tag) {
            return value.every(function (currentTag) {
              return _this5._getTagDisplayValue(currentTag) !== _this5._getTagDisplayValue(tag);
            });
          });
        }

        tags = tags.filter(function (tag) {
          return validationRegex.test(_this5._getTagDisplayValue(tag));
        });
        tags = tags.filter(function (tag) {
          var tagDisplayValue = _this5._getTagDisplayValue(tag);
          if (typeof tagDisplayValue.trim === 'function') {
            return tagDisplayValue.trim().length > 0;
          } else {
            return tagDisplayValue;
          }
        });

        if (maxTags >= 0) {
          var remainingLimit = Math.max(maxTags - value.length, 0);
          tags = tags.slice(0, remainingLimit);
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

        this._clearInput();
        return false;
      }
    }, {
      key: 'focus',
      value: function focus() {
        if (this.refs.input && typeof this.refs.input.focus === 'function') {
          this.refs.input.focus();
        }

        this.handleOnFocus();
      }
    }, {
      key: 'blur',
      value: function blur() {
        if (this.refs.input && typeof this.refs.input.blur === 'function') {
          this.refs.input.blur();
        }

        this.handleOnBlur();
      }
    }, {
      key: 'accept',
      value: function accept() {
        var tag = this.state.tag;


        if (tag !== '') {
          tag = this._makeTag(tag);
          return this._addTags([tag]);
        }

        return false;
      }
    }, {
      key: 'addTag',
      value: function addTag(tag) {
        return this._addTags([tag]);
      }
    }, {
      key: 'clearInput',
      value: function clearInput() {
        this._clearInput();
      }
    }, {
      key: 'handlePaste',
      value: function handlePaste(e) {
        var _this6 = this;

        var _props4 = this.props;
        var addOnPaste = _props4.addOnPaste;
        var pasteSplit = _props4.pasteSplit;


        if (!addOnPaste) {
          return;
        }

        e.preventDefault();

        var data = getClipboardData(e);
        var tags = pasteSplit(data).map(function (tag) {
          return _this6._makeTag(tag);
        });

        this._addTags(tags);
      }
    }, {
      key: 'handleKeyDown',
      value: function handleKeyDown(e) {
        if (e.defaultPrevented) {
          return;
        }

        var _props5 = this.props;
        var value = _props5.value;
        var removeKeys = _props5.removeKeys;
        var addKeys = _props5.addKeys;
        var tag = this.state.tag;

        var empty = tag === '';
        var keyCode = e.keyCode;
        var add = addKeys.indexOf(keyCode) !== -1;
        var remove = removeKeys.indexOf(keyCode) !== -1;

        if (add) {
          var added = this.accept();
          // Special case for preventing forms submitting.
          if (added || keyCode === 13) {
            e.preventDefault();
          }
        }

        if (remove && value.length > 0 && empty) {
          e.preventDefault();
          this._removeTag(value.length - 1);
        }
      }
    }, {
      key: 'handleClick',
      value: function handleClick(e) {
        if (e.target === this.refs.div) {
          this.focus();
        }
      }
    }, {
      key: 'handleChange',
      value: function handleChange(e) {
        var onChange = this.props.inputProps.onChange;

        var tag = e.target.value;

        if (onChange) {
          onChange(e);
        }

        this.setState({ tag: tag });
      }
    }, {
      key: 'handleOnFocus',
      value: function handleOnFocus(e) {
        var onFocus = this.props.inputProps.onFocus;


        if (onFocus) {
          onFocus(e);
        }

        this.setState({ isFocused: true });
      }
    }, {
      key: 'handleOnBlur',
      value: function handleOnBlur(e) {
        var onBlur = this.props.inputProps.onBlur;


        this.setState({ isFocused: false });

        if (e == null) {
          return;
        }

        if (onBlur) {
          onBlur(e);
        }

        if (this.props.addOnBlur) {
          var tag = this._makeTag(e.target.value);
          this._addTags([tag]);
        }
      }
    }, {
      key: 'handleEdit',
      value: function handleEdit(index, tag) {
        this._editTag(index, tag);
      }
    }, {
      key: 'handleRemove',
      value: function handleRemove(tag) {
        this._removeTag(tag);
      }
    }, {
      key: 'inputProps',
      value: function inputProps() {
        var _props$inputProps = this.props.inputProps;
        var onChange = _props$inputProps.onChange;
        var onFocus = _props$inputProps.onFocus;
        var onBlur = _props$inputProps.onBlur;

        var otherInputProps = _objectWithoutProperties(_props$inputProps, ['onChange', 'onFocus', 'onBlur']);

        var props = _extends({}, defaultInputProps, otherInputProps);

        if (this.props.disabled) {
          props.disabled = true;
        }

        return props;
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.setState({
          tag: this.props.currentValue
        });
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (!nextProps.currentValue) {
          return;
        }

        this.setState({
          tag: nextProps.currentValue
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this7 = this;

        var _props6 = this.props;
        var value = _props6.value;
        var onChange = _props6.onChange;
        var tagProps = _props6.tagProps;
        var renderLayout = _props6.renderLayout;
        var renderTag = _props6.renderTag;
        var renderInput = _props6.renderInput;
        var addKeys = _props6.addKeys;
        var removeKeys = _props6.removeKeys;
        var className = _props6.className;
        var focusedClassName = _props6.focusedClassName;
        var addOnBlur = _props6.addOnBlur;
        var addOnPaste = _props6.addOnPaste;
        var inputProps = _props6.inputProps;
        var pasteSplit = _props6.pasteSplit;
        var onlyUnique = _props6.onlyUnique;
        var maxTags = _props6.maxTags;
        var validationRegex = _props6.validationRegex;
        var disabled = _props6.disabled;
        var tagDisplayProp = _props6.tagDisplayProp;

        var other = _objectWithoutProperties(_props6, ['value', 'onChange', 'tagProps', 'renderLayout', 'renderTag', 'renderInput', 'addKeys', 'removeKeys', 'className', 'focusedClassName', 'addOnBlur', 'addOnPaste', 'inputProps', 'pasteSplit', 'onlyUnique', 'maxTags', 'validationRegex', 'disabled', 'tagDisplayProp']);

        var _state2 = this.state;
        var tag = _state2.tag;
        var isFocused = _state2.isFocused;


        if (isFocused) {
          className += ' ' + focusedClassName;
        }

        var tagComponents = value.map(function (tag, index) {
          return renderTag(_extends({
            key: index, tag: tag, tagDisplayProp: tagDisplayProp, onEdit: _this7.handleEdit.bind(_this7), onRemove: _this7.handleRemove.bind(_this7), disabled: disabled, getTagDisplayValue: _this7._getTagDisplayValue.bind(_this7) }, tagProps));
        });

        var inputComponent = renderInput(_extends({
          ref: 'input',
          value: tag,
          onPaste: this.handlePaste.bind(this),
          onKeyDown: this.handleKeyDown.bind(this),
          onChange: this.handleChange.bind(this),
          onFocus: this.handleOnFocus.bind(this),
          onBlur: this.handleOnBlur.bind(this),
          addTag: this.addTag.bind(this)
        }, this.inputProps()));

        return _react2.default.createElement(
          'div',
          { ref: 'div', onClick: this.handleClick.bind(this), className: className },
          renderLayout(tagComponents, inputComponent)
        );
      }
    }]);

    return TagsInput;
  }(_react2.default.Component);

  TagsInput.propTypes = {
    focusedClassName: _react2.default.PropTypes.string,
    addKeys: _react2.default.PropTypes.array,
    addOnBlur: _react2.default.PropTypes.bool,
    addOnPaste: _react2.default.PropTypes.bool,
    currentValue: _react2.default.PropTypes.string,
    inputProps: _react2.default.PropTypes.object,
    onChange: _react2.default.PropTypes.func.isRequired,
    removeKeys: _react2.default.PropTypes.array,
    renderInput: _react2.default.PropTypes.func,
    renderTag: _react2.default.PropTypes.func,
    renderLayout: _react2.default.PropTypes.func,
    pasteSplit: _react2.default.PropTypes.func,
    tagProps: _react2.default.PropTypes.object,
    onlyUnique: _react2.default.PropTypes.bool,
    value: _react2.default.PropTypes.array.isRequired,
    maxTags: _react2.default.PropTypes.number,
    validationRegex: _react2.default.PropTypes.instanceOf(RegExp),
    disabled: _react2.default.PropTypes.bool,
    tagDisplayProp: _react2.default.PropTypes.string
  };
  TagsInput.defaultProps = {
    className: 'react-tagsinput',
    focusedClassName: 'react-tagsinput--focused',
    currentValue: '',
    addKeys: [9, 13],
    addOnBlur: false,
    addOnPaste: false,
    inputProps: {},
    removeKeys: [8],
    renderInput: defaultRenderInput,
    renderTag: defaultRenderTag,
    renderLayout: defaultRenderLayout,
    pasteSplit: defaultPasteSplit,
    tagProps: { className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove' },
    onlyUnique: false,
    maxTags: -1,
    validationRegex: /.*/,
    disabled: false,
    tagDisplayProp: null
  };
  exports.default = TagsInput;
  module.exports = exports['default'];
});

