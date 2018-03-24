import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export class FieldSelect extends Component {
  render() {
    const {
      labelId,
      onChange,
      value,
      options,
      field,
      placeholder
    } = this.props;

    function change(selection) {
      const val = (selection ? selection.value : '');
      onChange(val, field);
    }

    function getOptions() {
      const ops = [];
      _.each(options, (op, key) => {
        ops.push({ label: key, value: key });
      });
      return ops;
    }

    return (
      <Select
        aria-describedby={'ml_aria_description_' + labelId}
        aria-labelledby={'ml_aria_label_' + labelId}
        placeholder={placeholder}
        options={getOptions()}
        value={value}
        onChange={change}
      />
    );
  }
}

FieldSelect.propTypes = {
  labelId: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  options: PropTypes.object,
  field: PropTypes.string,
  placeholder: PropTypes.string
};
