import React, { useState } from "react";
import "../schools/document.css";
import Layout from "../../../Layout";
import SchholRequests from './SchoolRequests';
import SchoolChangeRequests from './SchoolChangeRequest';

const RequestTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
<Layout>
      <div className="home-main">
        <div className="user-data w-100">
          <div className="school-main-heading d-flex justify-content-between align-items-center">
            School Requests
          </div>
          <div className="d-flex align-items-center" style={{margin:"0px 32px 10px 32px"}}>
           <p className="tabs-text" onClick={()=>setTabIndex(0)} style={{borderBottom:tabIndex===0?"3px solid #000":'none'}}>School Requests</p>
           <p className="tabs-text ms-4" onClick={()=>setTabIndex(1)}style={{borderBottom:tabIndex===1?"3px solid #000":'none'}}>School Change Requests</p>
          </div>
          {tabIndex=== 0? <SchholRequests/>:<SchoolChangeRequests/>}
        </div>
      </div>
    </Layout>
  );
};

export default RequestTabs;
