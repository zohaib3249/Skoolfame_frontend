import React, { useContext } from "react";
import { toast } from 'react-toastify';
import { BiBookOpen } from "react-icons/bi";
import { Link,NavLink } from "react-router-dom";
import { FiUsers,FiFlag,FiInfo } from "react-icons/fi";
import {LuBarChart2} from 'react-icons/lu';

import { ImBlocked } from "react-icons/im";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import { Auth } from "../../App";
import {SidebarLogo,LogoutBtn} from '../../Icons';
import "./sidebar.css";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const { user, userName, setUser } = useContext(Auth);
  const pf = process.env.REACT_APP_PUBLIC_URL;


  const logout = () => {
    localStorage.clear();
    setUser(null)
    navigate("/login");
    toast.success("Logout Successfully")
    //  window.location.reload();
  };

  return (

    <div className='sidebar'>
      <div className="logo-div">
      <SidebarLogo />
      </div>
      
      <div className="menu">
        <NavLink to="/dashboard" className={props.urls === "dashboard" || !props.urls ? "active" : ""} >
          <span> <LuBarChart2 /> </span>
          Dashboard
        </NavLink>
        <NavLink to="/users" className={props.urls === "userdetails" || props.urls === "chat" ? "active" : ""}>
          <span> <FiUsers /></span>
          Users
        </NavLink>
        <NavLink to="/schools" className={props.urls === "Superlatives" || props.urls === "Groups" || props.urls === "nominees" ? "active" : ""}>
          <span> <BiBookOpen /></span>
          Schools
        </NavLink>
        <NavLink to="/request-schools">
          <span className="spanpath">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path d="M22 12.8H16L14 15.8H10L8 12.8H2M22 12.8V18.8C22 19.3304 21.7893 19.8391 21.4142 20.2142C21.0391 20.5893 20.5304 20.8 20 20.8H4C3.46957 20.8 2.96086 20.5893 2.58579 20.2142C2.21071 19.8391 2 19.3304 2 18.8V12.8M22 12.8L18.55 5.90999C18.3844 5.57678 18.1292 5.29636 17.813 5.10027C17.4967 4.90418 17.1321 4.80019 16.76 4.79999H7.24C6.86792 4.80019 6.50326 4.90418 6.18704 5.10027C5.87083 5.29636 5.61558 5.57678 5.45 5.90999L2 12.8" stroke="#D0D5DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          </span>
          School Requests
        </NavLink>
        <NavLink to="/reports">
          <span className="spanpath">
          <FiFlag />
          </span>
          Report Post
        </NavLink>
        <NavLink to="/user-reports">
          <span className="spanpath">
          <FiUsers />
          </span>
          Report User
        </NavLink>
        <NavLink to="/moderator">
          <span className="spanpath">
          <ImBlocked />
          </span>
          Moderator
        </NavLink>
        <NavLink to="/about">
          <span><FiInfo /></span>
          About
        </NavLink>
      </div>
      <div className="sidebar-bottom">
        <div className="d-flex align-items-center justify-content-between" style={{width:'100%'}}>
        <Link to={"/profile"} style={{textDecoration:'none'}}>
        <div className="d-flex align-items-center" >
        <Avatar
            alt="user profile"
            src={
              user.user_profile_image
                ? `${pf}/${user.user_profile_image}`
                : "./images/user.png"
            }
            sx={{ width: 32, height: 32 }}
          />
           <div style={{margin:'0px 8px'}}>
            <p className="name">{`${userName.first_name} ${userName.last_name}`}</p>
            <p className="email">{user.email}</p>
           </div>
        </div>
        </Link>
        <div style={{width:'100%',textAlign:'right'}} >
        <span style={{cursor:'pointer'}} onClick={logout}><LogoutBtn/></span>
        </div>
        </div>
      </div>
    </div>

  );
};

export default Sidebar;
