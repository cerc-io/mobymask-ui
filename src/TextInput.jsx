import React, { useEffect, useState } from "react";

export default function TextInput(props) {
  const { onComplete, placeholder, buttonLabel, ...inputProps } = props;
  const [value, setValue] = useState("");

  return (
    <div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onKeyPress={event => {
          if (event.key === "Enter") {
            onComplete(value);
            setValue("");
          }
        }}
        onChange={event => {
          setValue(event.target.value);
        }}
        {...inputProps}
      />

      <button
        onClick={() => {
          onComplete(value);
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
