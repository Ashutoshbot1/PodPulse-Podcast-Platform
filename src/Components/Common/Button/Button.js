import React from "react";
import "./Button.css";

const Button = ({ text, onClick, disabled, style }) => {
  return (
    <div
      className="custom-btn"
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {text}
    </div>
  );
};

export default Button;
