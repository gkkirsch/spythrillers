import React from 'react';
import ReactCodeInput from 'react-code-input';
const inputStyle = {
  outline: 'none',
  margin:  '4px',
  MozAppearance: 'textfield',
  width: '40px',
  textTransform: 'uppercase',
  fontSize: '45px',
  height: '50px',
  padding: '8px 0px 8px 7px',
  backgroundColor: 'black',
  fontWeight: '700',
  color: '#B2BCE2',
  border: 'none'
}
export default function({value, onChange}) {
  return (
    <ReactCodeInput
      value={value}
      onChange={onChange}
      inputMode="text"
      inputStyle={inputStyle}
      type='text'
      fields={5}
    />
  )
}
