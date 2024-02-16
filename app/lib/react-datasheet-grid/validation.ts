/* eslint-disable no-irregular-whitespace */
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^010\d{8}$/

export const emailCellClassName = (data:Record<string, unknown>) => {
  const {rowData} = data;

  if (!rowData) {
    return '';
  }

  const isValid = emailRegex.test(String(data.rowData).toLowerCase());

  if (!isValid) {
    return  'has-error'
  }

  return ''
}

export const phoneNumberCellClassName = (data:Record<string, unknown>) => {
  const { rowData } = data;

  if (!rowData) {
    return '';
  }

  const isValid = phoneRegex.test(data.rowData);

  if (!isValid) {
    return  'has-error'
  }

  return ''
}