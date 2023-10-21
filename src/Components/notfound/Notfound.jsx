import React from 'react';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div>
      <h2 style={{textAlign:"center",marginTop:"100px"}}>Nothing to see here!</h2>
      <p style={{textAlign:"center",marginTop:"30px"}}>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
};

export default Notfound;