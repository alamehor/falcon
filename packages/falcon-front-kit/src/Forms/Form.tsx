import React from 'react';
import PropTypes from 'prop-types';
import { Form as FormikForm, FormikFormProps } from 'formik';
import { FormContext, FormContextValue } from './FormContext';

export type FormProps = FormContextValue & FormikFormProps;

export const Form: React.SFC<FormProps> = ({ i18nId, ...restProps }) => (
  <FormContext.Provider value={{ id: restProps.id, name: restProps.name, i18nId }}>
    <FormikForm {...restProps} />
  </FormContext.Provider>
);
Form.propTypes = {
  id: PropTypes.string.isRequired
};
