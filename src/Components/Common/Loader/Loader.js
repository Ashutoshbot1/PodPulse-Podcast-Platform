import React from 'react';
import './Loader.css'

const Loader = () => {
  return (
    <div className='wrapper'>
      <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loader
