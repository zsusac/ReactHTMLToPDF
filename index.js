'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _jspdf = require('jspdf');

var _jspdf2 = _interopRequireDefault(_jspdf);

var _html2canvas = require('html2canvas');

var _html2canvas2 = _interopRequireDefault(_html2canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global document  */


var propTypes = {
  html: _propTypes.PropTypes.string.isRequired,
  id: _propTypes.PropTypes.string,
  className: _propTypes.PropTypes.string,
  buttonText: _propTypes.PropTypes.string,
  openBlank: _propTypes.PropTypes.bool
};

var defaultProps = {
  id: 'button-download-as-pdf',
  className: 'button-download-pdf',
  buttonText: 'Download as PDF',
  openBlank: true
};

var ReactHTMLToPDF = function (_Component) {
  _inherits(ReactHTMLToPDF, _Component);

  _createClass(ReactHTMLToPDF, null, [{
    key: 'html2pdf',
    value: function html2pdf(html, pdf, callback) {
      var _this2 = this;

      var canvas = pdf.canvas;
      if (!canvas) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('jsPDF canvas plugin not installed');
        }

        return false;
      }
      canvas.pdf = pdf;
      pdf.annotations = {
        _nameMap: [],

        createAnnotation: function createAnnotation(href, bounds) {
          var x = pdf.context2d._wrapX(bounds.left);
          var y = pdf.context2d._wrapY(bounds.top);
          var options = void 0;
          var index = href.indexOf('#');
          if (index >= 0) {
            options = {
              name: href.substring(index + 1)
            };
          } else {
            options = {
              url: href
            };
          }
          pdf.link(x, y, bounds.right - bounds.left, bounds.bottom - bounds.top, options);
        },

        setName: function setName(name, bounds) {
          var x = pdf.context2d._wrapX(bounds.left);
          var y = pdf.context2d._wrapY(bounds.top);
          var page = pdf.context2d._page(bounds.top);
          _this2._nameMap[name] = {
            page: page,
            x: x,
            y: y
          };
        }
      };
      canvas.annotations = pdf.annotations;

      pdf.context2d._pageBreakAt = function (y) {
        _this2.pageBreaks.push(y);
      };

      pdf.context2d._gotoPage = function (pageOneBased) {
        while (pdf.internal.getNumberOfPages() < pageOneBased) {
          pdf.addPage();
        }
        pdf.setPage(pageOneBased);
      };
      var iframe = document.createElement('iframe');

      // remove all scripts
      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      document.body.appendChild(iframe);
      var doc = iframe.contentDocument;

      doc.open();
      doc.write(html);
      doc.close();

      var promise = (0, _html2canvas2.default)(doc.body, {
        canvas: canvas,
        onrendered: function onrendered(canvas) {
          if (callback) {
            if (iframe) {
              iframe.parentElement.removeChild(iframe);
            }
            callback(pdf);
          }
        }
      });
    }
  }]);

  function ReactHTMLToPDF(props) {
    _classCallCheck(this, ReactHTMLToPDF);

    var _this = _possibleConstructorReturn(this, (ReactHTMLToPDF.__proto__ || Object.getPrototypeOf(ReactHTMLToPDF)).call(this, props));

    _this.handleDownload = _this.handleDownload.bind(_this);
    return _this;
  }

  _createClass(ReactHTMLToPDF, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'handleDownload',
    value: function handleDownload() {
      if (this.props.html.length <= 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Provided empty html string');
          return;
        }
      }
      var pdf = new _jspdf2.default('p', 'pt', 'a4');
      var canvas = pdf.canvas;
      canvas.height = 72 * 11;
      canvas.width = 72 * 8.5;

      if (this.props.openBlank) {
        ReactHTMLToPDF.html2pdf(this.props.html, pdf, function (pdfOutput) {
          pdfOutput.output('dataurlnewwindow');
        });

        return;
      }

      ReactHTMLToPDF.html2pdf(this.props.html, pdf, function (pdfOutput) {
        pdfOutput.save();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'button',
        {
          id: this.props.id,
          className: this.props.className,
          onClick: this.handleDownload
        },
        this.props.buttonText
      );
    }
  }]);

  return ReactHTMLToPDF;
}(_react.Component);

ReactHTMLToPDF.propTypes = propTypes;
ReactHTMLToPDF.defaultProps = defaultProps;

exports.default = ReactHTMLToPDF;
