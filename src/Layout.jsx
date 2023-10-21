import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Components/header/Header'
import Sidebar from './Components/sidebar/Sidebar'

const Layout = (props) => {

  const [toggle, setToggle] = useState(false)
  const url = useLocation();

  return (
    <div>
      <Sidebar toggle={toggle} setToggle={setToggle} urls={url.pathname.split("/")[1]} />

      <main className='dashboard-main'>
        {
          <Header setToggle={setToggle} toggle={toggle} />
        }

        {props.children}

      </main>
    </div>
  )
}

export default Layout

