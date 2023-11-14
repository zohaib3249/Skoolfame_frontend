import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Button, Dialog, DialogContent } from "@mui/material";
import Layout from "../../Layout";
import "./user.css";
import { Link } from "react-router-dom";
import { getAllUser } from "../../controller/api";
import { toast } from "react-toastify";
import Pagination_new from "../Pagination_new";
import moment from "moment";
import localization from "moment/locale/en-in";
import LoadingSpinner from "../LoadingSpinner/LoaderSpinner";
import axios from "axios";
import Avatar from "@mui/material/Avatar";

const SearchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke="#667085"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
const ChatIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M17.5 9.58333C17.5029 10.6832 17.2459 11.7682 16.75 12.75C16.162 13.9264 15.2581 14.916 14.1395 15.6077C13.021 16.2995 11.7319 16.6662 10.4167 16.6667C9.31678 16.6695 8.23176 16.4126 7.25 15.9167L2.5 17.5L4.08333 12.75C3.58744 11.7682 3.33047 10.6832 3.33333 9.58333C3.33384 8.26812 3.70051 6.97904 4.39227 5.86045C5.08402 4.74187 6.07355 3.83797 7.25 3.24999C8.23176 2.7541 9.31678 2.49713 10.4167 2.49999H10.8333C12.5703 2.59582 14.2109 3.32896 15.4409 4.55904C16.671 5.78912 17.4042 7.4297 17.5 9.16666V9.58333Z"
        stroke="#667085"
        stroke-width="1.67"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
const DeleteIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M2.5 5.00001H4.16667M4.16667 5.00001H17.5M4.16667 5.00001V16.6667C4.16667 17.1087 4.34226 17.5326 4.65482 17.8452C4.96738 18.1577 5.39131 18.3333 5.83333 18.3333H14.1667C14.6087 18.3333 15.0326 18.1577 15.3452 17.8452C15.6577 17.5326 15.8333 17.1087 15.8333 16.6667V5.00001H4.16667ZM6.66667 5.00001V3.33334C6.66667 2.89131 6.84226 2.46739 7.15482 2.15483C7.46738 1.84227 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84227 12.8452 2.15483C13.1577 2.46739 13.3333 2.89131 13.3333 3.33334V5.00001M8.33333 9.16667V14.1667M11.6667 9.16667V14.1667"
        stroke="#667085"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
const SortingIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="16"
      viewBox="0 0 11 16"
      fill="none"
    >
      <g opacity="0.5">
        <path
          d="M7.5 4.25V13.25L10 10.75"
          stroke="black"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M3.5 11.75L3.5 2.75L1 5.25"
          stroke="black"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </g>
    </svg>
  );
};
const DeleteDialogIcon = () => {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" />
      <path
        d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z"
        stroke="#D92D20"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        x="4"
        y="4"
        width="48"
        height="48"
        rx="24"
        stroke="#FEF3F2"
        stroke-width="8"
      />
    </svg>
  );
};

const User = (props) => {
  const [show, setShow] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [allUserRev, setAllUserRev] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rev, setRev] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  const UserRev = allUser ? allUser : null;
  const perPage = 10;

  const pf = process.env.REACT_APP_PUBLIC_URL;
  // const pf = "http://192.168.40.29:3000"
  moment.updateLocale("en-in", localization);

  // METHODS

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const rever = () => {
    // setAllUser([...allUser].reverse());
    setRev(!rev);
  };

  console.log("allUser", allUser);

  const deletUser = async () => {
    if (userId !== "" && userName !== "") {
      try {
        const res = await axios.delete("/delete-user", {
          data: { id: userId },
        });
        if (res.data.status === 1) {
          toast.success(res.data.message);
          AllUser(current_page);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const AllUser = async (pages = 1) => {
    setLoading(true);
    try {
      const User = await getAllUser(perPage, pages, searchData, rev);
      console.log("user", User);
      if (User) {
        const { status, message, data, count, paginationValue, page } = User;
        if (status === 1) {
          setAllUser(data);
          setPaginationVal(paginationValue);
          setCurrent_page(page);
          setLoading(false);
        } else {
          toast.error(message);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    AllUser();
  }, [searchData, rev]);

  useEffect(() => {
    document.title = "Skoolfame | Users";
  }, []);

  return (
    <Layout>
      <div className="home-main">
        <div className="user-main-heading">Users</div>
        <div className="user-data-heading d-flex align-items-center justify-content-between">
          <h1 className="heading-data">Users</h1>
          <div class="form-group has-search">
            <span class="form-control-feedback">
              <SearchIcon />
            </span>
            <input
              className="form-control"
              type="text"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              placeholder="Search"
            />
          </div>
        </div>
        <div className="custom-data-table">
          <Table responsive className="mb-0 px-4 pb-2">
            <thead>
              <tr>
                <th className="table-heading" width="21%">
                  Name
                </th>
                <th className="table-heading" width="17%">
                  Gender
                </th>
                    <th className="table-heading" width="25%">
                  Email Address
                </th>
                <th className="table-heading" width="16%">
                  Birthdate
                </th>
                <th
                  className=" d-flex align-items-center table-heading"
                  width="21%"
                >
                  Created At
                  <span
                    style={{ marginLeft: "-7px", cursor: "pointer" }}
                    onClick={rever}
                  >
                    <SortingIcon />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                allUser.length !== 0 &&
                allUser?.map((user, i) => {
                  const {
                    _id,
                    user_profile_image,
                    first_name,
                    last_name,
                    gender,
                    createdAt,
                    email,
                    dob,
                  } = user;

                  return (
                    <tr
                      key={_id}
                      className={i % 2 == 0 ? "even-row" : "odd-row"}
                    >
                      <td className="table-data" width="21%">
                        <div className="delete-group ">
                          <div
                            // to={`/userdetails/${_id}`}
                            className="d-flex align-items-center gap-2 text-decoration-none"
                          >
                            <Avatar
                              alt="user profile"
                              src={
                                user_profile_image
                                  ? `${pf}/${user_profile_image}`
                                  : "./images/user.png"
                              }
                              sx={{ width: 32, height: 32 }}
                            />
                            <div>
                              <p className="user-name">
                                {first_name!== undefined? first_name:''}
                                {" "}
                                {last_name!==undefined?last_name:''}
                              </p>
                              <p className="user-email">{email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="table-data" width="17%">
                        {gender}
                      </td>
                     
                      <td className="table-data" width="25%">
                        {email}
                      </td>
                      <td className="table-data" width="16%">
                        {moment(dob).format("L")}
                      </td>
                      <td className="table-data" width="12%">
                        <div>{moment(createdAt).format("L")}</div>
                      </td>
                      <td className="table-data" width="9%">
                        <div className="delete-group d-flex align-items-center justify-content-center gap-3 py-2">
                          <Link to={`/chat/${_id}`} className="cursor-pointer">
                            <ChatIcon />
                          </Link>
                          <span
                            style={{cursor:'pointer'}}
                            onClick={() => {
                              setOpenDeleteDialog(true);
                              setUserId(_id);
                              setUserName(`${first_name + " " + last_name}`);
                            }}
                          >
                            <DeleteIcon />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        {loading ? (
          <h1 className="lod">
            <LoadingSpinner />
          </h1>
        ) : allUser.length === 0 ? (
          <h1 className="lod">no data available of users</h1>
        ) : null}
        <div className="d-flex justify-content-end mt-4 w-100">
          <Pagination_new
            AllUser={AllUser}
            pagination={paginationVal}
            current_page={current_page}
          />
        </div>
      </div>
      <Dialog open={openDeleteDialog} aria-labelledby="responsive-dialog-title">
        <DialogContent className="custom-delete-dialog">
          <div className="text-center">
            <DeleteDialogIcon />
          </div>
          <p className="heading mt-3">Delete User</p>
          <p className="data my-3">
            Are you sure you want to delete {userName}? This action cannot
            be undone.
          </p>
          <div className="d-flex justify-content-center align-items-center">
            <Button
              className="dialog-btn"
              style={{ color: "black" }}
              onClick={() => {
                setOpenDeleteDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="dialog-btn"
              style={{ color: "white", background: "red", marginLeft: "20px" }}
              onClick={() => {
                setOpenDeleteDialog(false);
                deletUser();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default User;
