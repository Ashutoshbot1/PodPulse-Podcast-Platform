import React from "react";
import './Input.css'

const Input = ({ type, state, placeholder, setState, required }) => {
  return (
    <input
      className='custom-input'
      type={type}
      value={state}
      placeholder={placeholder}
      onChange={(e) => setState(e.target.value)}
      required={required}
    />
  );
};

export default Input;
