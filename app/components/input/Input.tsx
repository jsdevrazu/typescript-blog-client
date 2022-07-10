import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{};

const Input: React.FC<InputProps> = ({...props}) => {
  return (
    <>
      <input {...props} />
    </>
  )
}

export default Input