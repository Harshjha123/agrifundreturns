import React from 'react'

const Error = ({ errorMsg }) => {
  return (
    <div className='error__box'>
        <div className="error__message">{errorMsg}</div>
    </div>
  )
}

export default Error