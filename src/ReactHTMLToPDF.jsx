/* global document  */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  buttonText: PropTypes.string,
  html: PropTypes.string,
  openBlank: PropTypes.bool,
};

const defaultProps = {
  id: 'button-download-as-pdf',
  className: 'button-download-pdf',
  buttonText: 'Download as PDF',
  html: '<html><head></head><body>ReactHTMLToPDF</body></html>',
  openBlank: true,
};

class ReactHTMLToPDF extends Component {
  static html2pdf(html, pdf, callback) {
    const canvas = pdf.canvas;
    if (!canvas) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('jsPDF canvas plugin not installed');
      }

      return false;
    }
    canvas.pdf = pdf;
    pdf.annotations = {
      _nameMap: [],

      createAnnotation: (href, bounds) => {
        const x = pdf.context2d._wrapX(bounds.left);
        const y = pdf.context2d._wrapY(bounds.top);
        let options;
        const index = href.indexOf('#');
        if (index >= 0) {
          options = {
            name: href.substring(index + 1),
          };
        } else {
          options = {
            url: href,
          };
        }
        pdf.link(
          x,
          y,
          bounds.right - bounds.left,
          bounds.bottom - bounds.top,
          options,
        );
      },

      setName: (name, bounds) => {
        const x = pdf.context2d._wrapX(bounds.left);
        const y = pdf.context2d._wrapY(bounds.top);
        const page = pdf.context2d._page(bounds.top);
        this._nameMap[name] = {
          page,
          x,
          y,
        };
      },
    };
    canvas.annotations = pdf.annotations;

    pdf.context2d._pageBreakAt = (y) => {
      this.pageBreaks.push(y);
    };

    pdf.context2d._gotoPage = (pageOneBased) => {
      while (pdf.internal.getNumberOfPages() < pageOneBased) {
        pdf.addPage();
      }
      pdf.setPage(pageOneBased);
    };
    const iframe = document.createElement('iframe');

    if (typeof html === 'string') {
      // remove all scripts
      html = html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        '',
      );

      document.body.appendChild(iframe);
      let doc;
      doc = iframe.contentDocument;
      if (doc == undefined || doc == null) {
        doc = iframe.contentWindow.document;
      }

      doc.open();
      doc.write(html);
      doc.close();

      const promise = html2canvas(doc.body, {
        canvas,
        onrendered: (canvas) => {
          if (callback) {
            if (iframe) {
              iframe.parentElement.removeChild(iframe);
            }
            callback(pdf);
          }
        },
      });
    } else {
      const body = html;
      const promise = html2canvas(body, {
        canvas,
        onrendered: (canvas) => {
          if (callback) {
            if (iframe) {
              iframe.parentElement.removeChild(iframe);
            }
            callback(pdf);
          }
        },
      });
    }
  }

  constructor(props) {
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
  }
  componentDidMount() {}
  handleDownload() {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const canvas = pdf.canvas;
    canvas.height = 72 * 11;
    canvas.width = 72 * 8.5;

    ReactHTMLToPDF.html2pdf(this.props.html, pdf, (pdfOutput) => {
      if (this.props.openBlank) {
        pdfOutput.output('dataurlnewwindow');
      }
      pdfOutput.save();
    });
  }
  render() {
    return (
      <button
        id={this.props.id}
        className={this.props.className}
        onClick={this.handleDownload}
      >
        {this.props.buttonText}
      </button>
    );
  }
}

ReactHTMLToPDF.propTypes = propTypes;
ReactHTMLToPDF.defaultProps = defaultProps;

export default ReactHTMLToPDF;
