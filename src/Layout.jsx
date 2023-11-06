import React, { useState } from 'react'
// import { Button, Dropdown } from "react-bootstrap";
import { Outlet, useLocation } from 'react-router-dom'
// import { MdOutlineNotificationsActive, MdFilterList } from "react-icons/md";
// import Header from './Components/header/Header'
import Sidebar from './Components/sidebar/Sidebar'

const Layout = (props) => {

  const [toggle, setToggle] = useState(false)
  const url = useLocation();

  return (
    <div>
      <Sidebar urls={url.pathname.split("/")[1]} />

      <main className='dashboard-main'>
        {/* {
          <Header setToggle={setToggle} toggle={toggle} />
        } */}
        {/* <div className="toggle-btn" >
        <Button onClick={() => props.setToggle(!props.toggle)}><MdFilterList /></Button>
        </div> */}

        {props.children}

      </main>
    </div>
  )
}

export default Layout

