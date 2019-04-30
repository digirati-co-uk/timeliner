import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEM from '@fesk/bem-js';
import './FileUpload.scss';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

const $style = BEM.block('file-upload');
class FileUpload extends Component {
  static propTypes = {
    onChange: PropTypes.func,
  };

  state = { json: null };

  fileInput = React.createRef();

  onChange = e => {
    this.setState({ loading: true });
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.addEventListener('load', ev => {
      try {
        const json = JSON.parse(reader.result.toString());

        if (this.props.onChange) {
          this.props.onChange(json);
        }

        this.setState({
          json,
          loading: false,
        });
      } catch (error) {
        this.props.onChange({ error });
        this.setState({ loading: false });
      }
    });
  };

  resetForm = () => {
    this.setState({ json: null });
  };

  render() {
    const { json, loading } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }
    if (json) {
      return (
        <div className={$style}>
          <span className={$style.element('label')}>
            {json.label && json.label.en && json.label.en.join('')
              ? json.label.en.join(' ')
              : 'Untitled manifest'}{' '}
          </span>
          <PrimaryButton onClick={this.resetForm}>Remove</PrimaryButton>
        </div>
      );
    }
    return (
      <div className={$style}>
        <input
          ref={ref => (this.fileInput = ref)}
          type="file"
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default FileUpload;
