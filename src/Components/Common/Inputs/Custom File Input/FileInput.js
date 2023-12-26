import React, { useState } from "react";
import "../Custom Input/Input.css";

const FileInput = ({ accept, id, fileHandleFunc, text }) => {
  const [fileSelected, setFileSelected] = useState("");

  function onChange(e) {
    setFileSelected(e.target.files[0].name);
    fileHandleFunc(e.target.files[0]);
  }

  return (
    <>
      <label
        htmlFor={id}
        className={`custom-input diff-border  ${
          !fileSelected ? "label-input" : "active"
        }`}
      >
        {fileSelected ? `${fileSelected} is selected` : text}
      </label>
      <input
        type="file"
        accept={accept}
        id={id}
        style={{ display: "none" }}
        onChange={onChange}
      />
    </>
  );
};

export default FileInput;
