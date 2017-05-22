/* global describe, it, expect */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import jsPDF from 'jspdf';
import ReactHTMLToPDF from '../src/ReactHTMLToPDF';

chai.use(chaiEnzyme());

describe('tests for <ReactHTMLToPDF> container, openBlank: true', () => {
  const props = {
    id: 'test-button-download-pdf',
    className: 'button-download-pdf',
    buttonText: 'Download as PDF',
    html: 'sdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd',
    openBlank: true,
  };

  const container = shallow(<ReactHTMLToPDF {...props} />);

  it('should test that the component mounts', () => {
    sinon.spy(ReactHTMLToPDF.prototype, 'componentDidMount');
    const containerMount = mount(<ReactHTMLToPDF {...props} />);
    expect(ReactHTMLToPDF.prototype.componentDidMount.calledOnce).to.equal(
      true,
    );
  });

  it('should render one button', () => {
    expect(container.find('button').length).to.equal(1);
  });

  it('should render one button with the correct class applied', () => {
    expect(container.find('button').hasClass(props.className)).to.equal(true);
  });

  it('should have props for id', () => {
    expect(container.props().id).to.be.defined;
  });

  it('should have props for className', () => {
    expect(container.props().className).to.be.defined;
  });

  it('should have props for buttonText', () => {
    expect(container.props().buttonText).to.be.defined;
  });

  it('should have props for html', () => {
    expect(container.props().html).to.be.defined;
  });

  it('should have props for openBlank', () => {
    expect(container.props().openBlank).to.be.defined;
  });

  it('should simulate button click event', (done) => {
    expect(container.find('button').simulate('click'));
    done();
  });

  it('test html2pdf static method', (done) => {
    function callback(data) {
      expect(data).to.be.an('object');
      done();
    }

    const pdf = new jsPDF('p', 'pt', 'a4');
    const canvas = pdf.canvas;
    canvas.height = 72 * 11;
    canvas.width = 72 * 8.5;
    ReactHTMLToPDF.html2pdf(props.html, pdf, callback);
  });
});

describe('tests for <ReactHTMLToPDF> container, openBlank: false', () => {
  const props = {
    id: 'test-button-download-pdf',
    className: 'button-download-pdf',
    buttonText: 'Download as PDF',
    html: 'asdasd',
    openBlank: false,
  };

  const container = shallow(<ReactHTMLToPDF {...props} />);

  it('should render one button', () => {
    expect(container.find('button').length).to.equal(1);
  });

  it('should render one button with the correct class applied', () => {
    expect(container.find('button').hasClass(props.className)).to.equal(true);
  });

  it('should have props for id', () => {
    expect(container.props().id).to.be.defined;
  });

  it('should have props for className', () => {
    expect(container.props().className).to.be.defined;
  });

  it('should have props for buttonText', () => {
    expect(container.props().buttonText).to.be.defined;
  });

  it('should have props for html', () => {
    expect(container.props().html).to.be.defined;
  });

  it('should have props for openBlank', () => {
    expect(container.props().openBlank).to.be.defined;
  });

  it('should simulate button click event', (done) => {
    expect(container.find('button').simulate('click'));
    done();
  });
});

describe('tests for <ReactHTMLToPDF> container, html: ""', () => {
  const props = {
    id: 'test-button-download-pdf',
    className: 'button-download-pdf',
    buttonText: 'Download as PDF',
    html: '',
    openBlank: false,
  };

  const container = shallow(<ReactHTMLToPDF {...props} />);

  it('should render one button', () => {
    expect(container.find('button').length).to.equal(1);
  });

  it('should render one button with the correct class applied', () => {
    expect(container.find('button').hasClass(props.className)).to.equal(true);
  });

  it('should have props for id', () => {
    expect(container.props().id).to.be.defined;
  });

  it('should have props for className', () => {
    expect(container.props().className).to.be.defined;
  });

  it('should have props for buttonText', () => {
    expect(container.props().buttonText).to.be.defined;
  });

  it('should have props for html', () => {
    expect(container.props().html).to.be.defined;
  });

  it('should have props for openBlank', () => {
    expect(container.props().openBlank).to.be.defined;
  });

  it('should simulate button click event', (done) => {
    expect(container.find('button').simulate('click'));
    done();
  });
});
