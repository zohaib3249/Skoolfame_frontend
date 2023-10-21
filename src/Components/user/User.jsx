import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Modal, NavLink, Pagination, Row, Table } from "react-bootstrap";
import Layout from "../../Layout";
import { GrFormClose } from "react-icons/gr";
import "./user.css";
import { Link } from "react-router-dom";
import { getAllUser } from "../../controller/api";
import { toast } from "react-toastify";
import Pagination_new from "../Pagination_new";
import moment from "moment";
import localization from 'moment/locale/en-in';
import LoadingSpinner from "../LoadingSpinner/LoaderSpinner";
import axios from "axios";


const User = (props) => {
  const [show, setShow] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [allUserRev, setAllUserRev] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rev, setRev] = useState(false);

  const UserRev = allUser ? allUser : null
  const perPage = 10

  const pf = process.env.REACT_APP_PUBLIC_URL;
  // const pf = "http://192.168.40.29:3000"
  moment.updateLocale('en-in', localization);


  // METHODS


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const rever = () => {
    // setAllUser([...allUser].reverse());
    setRev(!rev)

  };

  const deletUser = async (i, name) => {
    let check = window.confirm("are you sure you want to delete " + name);
    if (check) {
      try {
        const res = await axios.delete("/delete-user", { data: { id: i } });
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
          setCurrent_page(page)
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
    document.title = "Skoolfame | Users"
  }, []);

  return (
    <Layout>

      <div className="user-main py-4 px-5">
        <Row>
          <Col lg={12}>
            <div className="user-data">
              <div className="user-data-header d-flex align-items-center justify-content-between">
                <h1>Users</h1>
                <input type="text" placeholder="Search name" value={searchData} onChange={(e) => setSearchData(e.target.value)} />
              </div>
              <div className="user-data-table mt-4">
                <Table responsive className="mb-0 px-4 pb-2">
                  <thead>
                    <tr>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">Name</span>
                      </th>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">Gender</span>
                      </th>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">Birthdate</span>
                      </th>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">Email</span>
                      </th>
                      <th className="p-0" colSpan={2}>
                        <span className="d-flex py-3 px-5">
                          Created At
                          <Button className="bg-transparent border-0 shadow-none p-0" onClick={rever} >
                            <img src="./images/sorting-new.png" alt="" className="mt-0" />
                          </Button>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && allUser.length !== 0 && allUser?.map((user) => {
                      const { _id, user_profile_image, first_name, last_name, gender, createdAt, email, dob } = user;

                      return (
                        <tr key={_id}>
                          <td className="bg-orange">
                            <div className="delete-group ">
                              <Link
                                to={`/userdetails/${_id}`}
                                className="d-flex align-items-center gap-3 p-0 text-decoration-none"
                              >
                                <img
                                  className="round_img"
                                  src={
                                    user_profile_image
                                      ? `${pf}/${user_profile_image}`
                                      : "./images/user.png"
                                  }
                                  alt="user profile"
                                />
                                <span className="d-block text-ellipse">{`${first_name + " " + last_name}`}</span>
                              </Link>
                            </div>
                          </td>
                          <td className="bg-orange">
                            <span className="d-block cp px-5">
                              {gender}
                            </span>
                          </td>
                          <td className="bg-orange">
                            <span className="d-block cp px-5">{moment(dob).format('L')}</span>
                          </td>
                          <td className="bg-orange">
                            <span className="d-block cp px-5 text-ellipse">
                              {email}
                            </span>
                          </td>
                          <td className="bg-orange">
                            <span className="d-block cp px-5">
                              {moment(createdAt).format('L')}
                            </span>
                          </td>
                          <td className="bg-orange">
                            <div className="delete-group d-flex align-items-center justify-content-center gap-3 py-2">
                              <Link to={`/chat/${_id}`}>
                                <Button>Chat</Button>
                              </Link>
                              <Button onClick={() => deletUser(_id, `${first_name + " " + last_name}`)}>Delete</Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {loading ? <h1 className="lod"><LoadingSpinner /></h1> : allUser.length === 0 ? <h1 className="lod">no data available of users</h1> : null}
              <div className="d-flex justify-content-end mt-4">
                <Pagination_new
                  AllUser={AllUser}
                  pagination={paginationVal}
                  current_page={current_page}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default User;
