import React, { useContext } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { MdOutlineNotificationsActive, MdFilterList } from "react-icons/md";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Auth } from "../../App";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import "./header.css";
import { toast } from 'react-toastify';
import { BiHomeAlt } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { GrCircleInformation } from "react-icons/gr";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Header = (props) => {
  const navigate = useNavigate();
  const { user, userName, setUser } = useContext(Auth);


  const logout = () => {
    localStorage.clear();
    setUser(null)
    navigate("/login");
    toast.success("Logout Successfully")
    //  window.location.reload();
  };

  const handleClickAway = (e) => {
    e.preventDefault();
    props.setToggle(false)
  };


  return (
    <div className="header" >
      <Button className="toggle" onClick={() => props.setToggle(!props.toggle)}><MdFilterList /></Button>
      {/* <div className="d-flex align-items-center">
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">
            <div className="user-toggle d-flex align-items-center gap-3">
              <span>{userName ? userName.first_name : "Admin"}</span>
              <img src="../images/user.png" className="imgs" />
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item style={{ textAlign: "center" }}><Link to={"/profile"}>Profile</Link></Dropdown.Item>

            <Dropdown.Item style={{ textAlign: "center", borderTop: "1px solid lightgray" }} onClick={logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div> */}
      {props.toggle ? <ClickAwayListener onClickAway={handleClickAway}>
        <div className={`${props.toggle ? "m-0" : ""} hide`}>
          <div className="menu">
            <NavLink to="/dashboard">
              <BiHomeAlt />
              Dashboard
            </NavLink>
            <NavLink to="/users">
              <FaRegUser />
              Users
            </NavLink>
            <NavLink to="/schools">
              <HiOutlineOfficeBuilding />
              Schools
            </NavLink>
            <NavLink to="/request-schools">
              <span className="spanpath ps-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.52877 0C6.50959 0 9.48728 0 12.4681 0C12.4806 0.00626223 12.4963 0.0187867 12.5088 0.0187867C13.2759 0.128376 13.8614 0.795303 13.8458 1.66262C13.8333 2.37025 13.8458 3.07789 13.8427 3.78239C13.8427 3.94521 13.8771 4.06732 13.993 4.20822C14.6755 5.04423 15.3331 5.89902 16 6.74755C16 9.03953 16 11.3315 16 13.6235C15.9906 13.6485 15.9781 13.6705 15.975 13.6955C15.7714 15.0356 14.6818 15.9969 13.3354 15.9969C9.77847 16 6.22153 16 2.66771 15.9969C1.19609 15.9937 0.0125245 14.8164 0.00626223 13.3479C-0.00313112 11.2313 0.00313112 9.11155 0 6.99178C0 6.8227 0.0500978 6.67867 0.156556 6.54716C0.335029 6.32485 0.510372 6.09628 0.688845 5.87084C1.11781 5.32603 1.53425 4.77495 1.97887 4.24266C2.10098 4.0955 2.13542 3.95773 2.13542 3.78239C2.12916 3.07476 2.13229 2.36712 2.13229 1.65949C2.13229 1.14912 2.31389 0.717025 2.70215 0.375734C2.94012 0.16908 3.22818 0.0688845 3.52877 0ZM14.9166 7.74638C14.8509 7.77456 14.807 7.79022 14.7632 7.809C13.4544 8.36947 12.1456 8.93307 10.8337 9.49354C9.01761 10.2701 7.18591 10.3202 5.35421 9.57182C3.96712 9.00509 2.59883 8.39765 1.22114 7.809C1.17104 7.78708 1.12094 7.7683 1.05519 7.74325C1.05519 7.81526 1.05519 7.8591 1.05519 7.90607C1.05519 9.69706 1.05519 11.4881 1.05519 13.2791C1.05519 14.2622 1.73777 14.9479 2.72407 14.9511C3.24384 14.9542 3.76673 14.9511 4.2865 14.9511C4.33659 14.9511 4.38669 14.9448 4.44932 14.9417C4.418 14.8759 4.39609 14.829 4.37417 14.7851C4.18317 14.4 3.98278 14.0149 3.80117 13.6235C3.75108 13.5202 3.71977 13.3949 3.72916 13.2822C3.74481 13.0411 3.93581 12.8501 4.16125 12.8125C4.40548 12.7718 4.62466 12.8783 4.74364 13.11C5.0317 13.6798 5.31663 14.2528 5.60157 14.8258C5.63914 14.8978 5.66732 14.9542 5.77065 14.9542C6.37495 14.9479 6.97926 14.9511 7.58356 14.9511C7.60235 14.9511 7.62113 14.9417 7.65245 14.9354C7.62427 14.8759 7.60548 14.8227 7.58043 14.7726C7.38317 14.3781 7.17965 13.9836 6.98865 13.5859C6.83523 13.2665 6.99178 12.919 7.31742 12.8219C7.57417 12.7468 7.82779 12.8658 7.96243 13.1319C8.2411 13.683 8.51976 14.2372 8.79217 14.7945C8.84227 14.8978 8.89863 14.9386 9.01448 14.9354C9.57808 14.9292 10.1386 14.9323 10.7022 14.9323C10.746 14.9323 10.793 14.9292 10.8556 14.926C10.8274 14.8665 10.8086 14.8196 10.7867 14.7757C10.5926 14.3843 10.389 13.9961 10.2074 13.6016C10.1542 13.4888 10.126 13.3511 10.1386 13.229C10.1636 12.991 10.3609 12.8188 10.5988 12.7875C10.8149 12.7562 11.0372 12.8751 11.1499 13.0943C11.4004 13.589 11.6665 14.0806 11.892 14.591C12.0047 14.8509 12.1487 14.9417 12.4274 14.9198C12.8 14.8885 13.182 14.9386 13.5515 14.8947C14.3624 14.7977 14.9292 14.1119 14.9292 13.2634C14.9292 11.4787 14.926 9.6908 14.926 7.90607C14.926 7.8591 14.9198 7.81213 14.9166 7.74638ZM8.00313 1.06771C6.61918 1.06771 5.23209 1.06771 3.84814 1.06771C3.39726 1.06771 3.19687 1.26184 3.19687 1.70959C3.19687 3.58513 3.19687 5.45753 3.19374 7.33307C3.19374 7.45519 3.22818 7.51468 3.3409 7.56477C4.06106 7.86536 4.77808 8.17221 5.49198 8.48532C7.16086 9.22114 8.82661 9.218 10.4955 8.48219C11.2 8.17221 11.9076 7.87476 12.6184 7.58043C12.753 7.52407 12.8031 7.46145 12.8031 7.31115C12.7969 5.45127 12.8 3.59452 12.8 1.73464C12.8 1.26184 12.6059 1.06771 12.1393 1.06771C10.7616 1.06771 9.38082 1.06771 8.00313 1.06771ZM13.8928 5.75812C13.8928 6.209 13.8928 6.61292 13.8928 7.03562C14.1495 6.92603 14.3875 6.8227 14.638 6.71311C14.3875 6.39374 14.1526 6.09315 13.8928 5.75812ZM2.11977 5.7362C1.85675 6.07436 1.62192 6.37808 1.37456 6.69432C1.63444 6.80704 1.86928 6.90724 2.11977 7.0137C2.11977 6.58787 2.11977 6.18395 2.11977 5.7362Z" fill="white" />
                </svg>
              </span>
              School Requests
            </NavLink>
            <NavLink to="/about">
              <AiOutlineInfoCircle />
              About
            </NavLink>
          </div>
        </div>
      </ClickAwayListener> : null}
    </div>

  );
};

export default Header;
