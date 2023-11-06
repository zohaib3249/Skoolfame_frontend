import React from 'react';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
      <div>
      <h2 style={{color:'white'}}>Nothing to see here!</h2>
      <p style={{textAlign:'center'}}>
        <Link to="/">Go to the home page</Link>
      </p>
      </div>  
    </div>
  )
};

export default Notfound;