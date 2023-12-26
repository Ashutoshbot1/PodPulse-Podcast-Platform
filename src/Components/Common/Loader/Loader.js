import React from 'react';
import './Loader.css'

const Loader = ({style}) => {
  return (
    <div className='wrapper' style={style}>
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loader
