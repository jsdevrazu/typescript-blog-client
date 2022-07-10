import React from "react";

interface InputProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<InputProps> = ({ children, ...props }) => {
  return (
    <>
      <button {...props}>{children}</button>
    </>
  );
};

export default Button;
