(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('ReactTagsInput', ['exports', 'module', 'react'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React);
    global.ReactTagsInput = mod.exports;
  }
})(this, function (exports, module, _react) {
  'use strict';

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _React = _interopRequireDefault(_react);

  function uniq(arr) {
    var out = [];

    for (var i = 0; i < arr.length; i++) {
      if (out.indexOf(arr[i]) === -1) {
        out.push(arr[i]);
      }
    }

    return out;
  }

  function defaultRenderTag(props) {
    var tag = props.tag;
    var key = props.key;
    var onRemove = props.onRemove;
    var classNameRemove = props.classNameRemove;

    var other = _objectWithoutProperties(props, ['tag', 'key', 'onRemove', 'classNameRemove']);

    return _React['default'].createElement(
      'span',
      _extends({ key: key }, other),
      tag,
      _React['default'].createElement('a', { className: classNameRemove, onClick: function (e) {
          return onRemove(key);
        } })
    );
  }

  defaultRenderTag.propTypes = {
    key: _React['default'].PropTypes.number,
    tag: _React['default'].PropTypes.string,
    onRemove: _React['default'].PropTypes.func,
    classNameRemove: _React['default'].PropTypes.string
  };

  function defaultRenderInput(props) {
    var onChange = props.onChange;
    var value = props.value;

    var other = _objectWithoutProperties(props, ['onChange', 'value']);

    return _React['default'].createElement('input', _extends({ type: 'text', onChange: onChange, value: value }, other));
  }

  defaultRenderInput.propTypes = {
    value: _React['default'].PropTypes.string,
    onChange: _React['default'].PropTypes.func
  };

  function defaultRenderLayout(tagComponents, inputComponent) {
    return _React['default'].createElement(
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

  var TagsInput = (function (_React$Component) {
    _inherits(TagsInput, _React$Component);

    function TagsInput() {
      _classCallCheck(this, TagsInput);

      _get(Object.getPrototypeOf(TagsInput.prototype), 'constructor', this).call(this);
      this.state = { tag: '' };
      this.focus = this.focus.bind(this);
      this.blur = this.blur.bind(this);
    }

    _createClass(TagsInput, [{
      key: '_removeTag',
      value: function _removeTag(index) {
        var value = this.props.value.concat([]);
        if (index > -1 && index < value.length) {
          value.splice(index, 1);
          this.props.onChange(value);
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
        var _props = this.props;
        var validationRegex = _props.validationRegex;
        var onChange = _props.onChange;
        var onlyUnique = _props.onlyUnique;
        var maxTags = _props.maxTags;
        var value = _props.value;

        // 1. Strip non-unique tags
        if (onlyUnique) {
          tags = uniq(tags);
          tags = tags.filter(function (tag) {
            return value.indexOf(tag) === -1;
          });
        }

        // 2. Strip invalid tags
        tags = tags.filter(function (tag) {
          return validationRegex.test(tag);
        });
        tags = tags.filter(function (tag) {
          return tag.trim().length > 0;
        });

        // 3. Strip extras based on limit
        if (maxTags >= 0) {
          var remainingLimit = Math.max(maxTags - value.length, 0);
          tags = tags.slice(0, remainingLimit);
        }

        // 4. Add remaining tags to value
        if (tags.length > 0) {
          var newValue = value.concat(tags);
          onChange(newValue);
          this._clearInput();
        }
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.refs.input.focus();
      }
    }, {
      key: 'blur',
      value: function blur() {
        this.refs.input.focus();
      }
    }, {
      key: 'handlePaste',
      value: function handlePaste(e) {
        var _props2 = this.props;
        var addOnPaste = _props2.addOnPaste;
        var pasteSplit = _props2.pasteSplit;

        if (!addOnPaste) {
          return;
        }

        e.preventDefault();

        var data = e.clipboardData.getData('text/plain');
        var tags = pasteSplit(data);

        this._addTags(tags);
      }
    }, {
      key: 'handleKeyDown',
      value: function handleKeyDown(e) {
        var _props3 = this.props;
        var value = _props3.value;
        var removeKeys = _props3.removeKeys;
        var addKeys = _props3.addKeys;
        var tag = this.state.tag;

        var empty = tag === '';
        var add = addKeys.indexOf(e.keyCode) !== -1;
        var remove = removeKeys.indexOf(e.keyCode) !== -1;

        if (add) {
          e.preventDefault();
          this._addTags([tag]);
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
      key: 'handleOnBlur',
      value: function handleOnBlur(e) {
        if (this.props.addOnBlur) {
          this._addTags([e.target.value]);
        }
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

        var otherInputProps = _objectWithoutProperties(_props$inputProps, ['onChange']);

        return otherInputProps;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this = this;

        var _props4 = this.props;
        var value = _props4.value;
        var onChange = _props4.onChange;
        var inputProps = _props4.inputProps;
        var tagProps = _props4.tagProps;
        var renderLayout = _props4.renderLayout;
        var renderTag = _props4.renderTag;
        var renderInput = _props4.renderInput;
        var addKeys = _props4.addKeys;
        var removeKeys = _props4.removeKeys;

        var other = _objectWithoutProperties(_props4, ['value', 'onChange', 'inputProps', 'tagProps', 'renderLayout', 'renderTag', 'renderInput', 'addKeys', 'removeKeys']);

        var tag = this.state.tag;

        var tagComponents = value.map(function (tag, index) {
          return renderTag(_extends({ key: index, tag: tag, onRemove: _this.handleRemove.bind(_this) }, tagProps));
        });

        var inputComponent = renderInput(_extends({
          ref: 'input',
          value: tag,
          onPaste: this.handlePaste.bind(this),
          onKeyDown: this.handleKeyDown.bind(this),
          onChange: this.handleChange.bind(this),
          onBlur: this.handleOnBlur.bind(this)
        }, this.inputProps()));

        return _React['default'].createElement(
          'div',
          _extends({ ref: 'div', onClick: this.handleClick.bind(this) }, other),
          renderLayout(tagComponents, inputComponent)
        );
      }
    }], [{
      key: 'propTypes',
      value: {
        addKeys: _React['default'].PropTypes.array,
        addOnBlur: _React['default'].PropTypes.bool,
        addOnPaste: _React['default'].PropTypes.bool,
        inputProps: _React['default'].PropTypes.object,
        onChange: _React['default'].PropTypes.func.isRequired,
        removeKeys: _React['default'].PropTypes.array,
        renderInput: _React['default'].PropTypes.func,
        renderTag: _React['default'].PropTypes.func,
        renderLayout: _React['default'].PropTypes.func,
        pasteSplit: _React['default'].PropTypes.func,
        tagProps: _React['default'].PropTypes.object,
        onlyUnique: _React['default'].PropTypes.bool,
        value: _React['default'].PropTypes.array.isRequired,
        maxTags: _React['default'].PropTypes.number,
        validationRegex: _React['default'].PropTypes.instanceOf(RegExp)
      },
      enumerable: true
    }, {
      key: 'defaultProps',
      value: {
        className: 'react-tagsinput',
        addKeys: [9, 13],
        addOnBlur: false,
        addOnPaste: false,
        inputProps: { className: 'react-tagsinput-input' },
        removeKeys: [8],
        renderInput: defaultRenderInput,
        renderTag: defaultRenderTag,
        renderLayout: defaultRenderLayout,
        pasteSplit: defaultPasteSplit,
        tagProps: { className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove' },
        onlyUnique: false,
        maxTags: -1,
        validationRegex: /.*/
      },
      enumerable: true
    }]);

    return TagsInput;
  })(_React['default'].Component);

  module.exports = TagsInput;
});
