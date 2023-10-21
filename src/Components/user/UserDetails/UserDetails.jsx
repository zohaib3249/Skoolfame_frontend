import React, { useEffect, useState } from "react";
import Layout from "../../../Layout";
import "./UserDetails.css";
import { Col, Row, Table, Pagination, Form, Button, NavLink, Modal, } from "react-bootstrap";
import { Link } from "react-router-dom";
import Album from "../Album";
import { getAlbum, getAllUser, singleUserDetail } from "../../../controller/api";
import { useParams } from "react-router-dom";
import moment from "moment";
import localization from "moment/locale/en-in";
import Pagination_new from "../../Pagination_new";

const UserDetails = () => {
  const [show, setShow] = useState(false);
  const [con, setCon] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [user, setUser] = useState("");
  const [allAlbums, setAllAlbums] = useState(null);
  const [allVideos, setAllVideos] = useState(null);
  const [_A_Current_page, set_A_Current_page] = useState(1);
  const [_V_Current_page, set_V_Current_page] = useState(1);
  const [_F_Current_page, set_F_Current_page] = useState(1);
  const [_R_Current_page, set_R_Current_page] = useState(1);
  const [f_Data, setF_Data] = useState(null);
  const [r_Data, setR_Data] = useState(null);

  const per_page_A_V = 8;
  const A_Pagination = user?.friends?.length
    ? Math.ceil(user?.imageAlbum?.length / per_page_A_V)
    : 1; // change for user.friends
  const V_Pagination = user?.friends?.length
    ? Math.ceil(user?.VideoAlbum?.length / per_page_A_V)
    : 1; // change for user.friends

  const per_page = 2;

  const f_Pagination = user?.friends?.length
    ? Math.ceil(user?.friends?.length / per_page)
    : 1;

  const r_Pagination = user?.relationships?.length
    ? Math.ceil(user?.relationships?.length / per_page)
    : 1;

  const index = user?.feedback?.length - 1;
  let feedback = user?.feedback
    ? Number(user.feedback[index]?.rate)
    : null;
  let co = user?.feedback ? user?.feedback[user?.feedback?.length - 1]?.comment : null;
  const { id } = useParams();

  moment.updateLocale("en-in", localization);

  const pf = process.env.REACT_APP_PUBLIC_URL;
  //  const pf = "http://192.168.40.29:3000"
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // METHODS

  const openalbum = async (type, id) => {
    try {

      const albumData = await getAlbum(type, id)
      const { status, data } = albumData;
      if (status == 1) {
        setAlbums(data)
        setCon(type)
        setShow(true)
      } else {

      }
    } catch (error) {

    }
  }

  // all pagination

  const AllAlbum = async (pages) => {

    if (pages === 1) {
      setAllAlbums(user?.imageAlbum?.slice(pages - 1, per_page_A_V));
    } else {
      setAllAlbums(user?.imageAlbum?.slice(pages * per_page_A_V - per_page_A_V, pages * per_page_A_V));
    }
    set_A_Current_page(pages);
  };

  const AllVideo = async (pages) => {

    if (pages === 1) {
      setAllVideos(user?.VideoAlbum?.slice(pages - 1, per_page_A_V));
    } else {
      setAllVideos(user?.VideoAlbum?.slice(pages * per_page_A_V - per_page_A_V, pages * per_page_A_V));
    }
    set_V_Current_page(pages);
  };

  const AllFriends = async (pages) => {

    if (pages === 1) {
      setF_Data(user?.friends?.slice(pages - 1, per_page));
    } else {
      setF_Data(user?.friends?.slice(pages * per_page - per_page, pages * per_page));
    }
    set_F_Current_page(pages);
  };

  const AllRelationships = async (pages) => {
    if (pages === 1) {
      setR_Data(() => user?.relationships?.slice(pages - 1, per_page));
    } else {
      setR_Data(() => user?.relationships?.slice(pages * per_page - per_page, pages * per_page));
    }
    set_R_Current_page(pages);
  };

  //for first time only

  useEffect(() => {
    const getSingleUser = async () => {
      try {
        const user = await singleUserDetail(id);
        const { status, message, data } = user;
        if (status === 1) {
          setUser(data);
          setF_Data(() => data?.friends?.slice(_F_Current_page - 1, per_page));
          setR_Data(() =>
            data?.relationships?.slice(_R_Current_page - 1, per_page)
          );
          setAllAlbums(() =>
            data?.imageAlbum?.slice(_F_Current_page - 1, per_page_A_V)
          );
          setAllVideos(() =>
            data?.VideoAlbum?.slice(_R_Current_page - 1, per_page_A_V)
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSingleUser();
    document.title = "Skoolfame | User's Details";
  }, []);

  return (
    <Layout>
      <div className="user-main py-4 px-4">
        <Row>
          <Col xl={8} className="order-2 order-xl-1 ">
            <Row>
              <Col lg={12}>
                <div className="user_details p-4">
                  <div className="user_details_information">
                    <h1 className="user_details_headings"> User Information</h1>
                    <Form className="mt-4">
                      <Row>
                        <Col lg={6} md={6} className="mb-4">
                          <Form.Group controlId="formGridEmail">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={user?.first_name}
                              disabled
                            />
                          </Form.Group>
                        </Col>

                        <Col lg={6} md={6} className="mb-4">
                          <Form.Group controlId="formGridPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={user?.last_name}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4" controlId="formGridAddress1">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={user?.gender}
                          disabled
                        />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="formGridAddress2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder={user?.email}
                          disabled
                        />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="formGridAddress2">
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={moment(user.dob).format("L")}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group className="mb-4" controlId="formGridAddress2">
                        <Form.Label>School</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={user?.school ? user?.school : "Not added"}
                          disabled
                        />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="formGridAddress2">
                        <Form.Label>Feedback</Form.Label>
                        <p className="feedback">

                          {feedback && !feedback == 0 ? [...Array(feedback)]?.map((u, i) => (
                            <span style={{ color: "orange" }}>&#9733;</span>
                          )) : null}

                          {feedback && !feedback == 0 ? [...Array(5 - feedback)]?.map((u, i) => (
                            <span>&#10032;</span>
                          )) : null}

                          {!feedback && [...Array(5)]?.map((u, i) => (
                            <span>&#10032;</span>
                          ))}
                          <span style={{ color: "rgb(121 121 121)", marginLeft: "5px", fontSize: "10px" }}>
                            {feedback == 0 || feedback ? feedback + ".0 " : null}
                            {co || feedback >= 0 ? "feedback" : "no feedback"}</span>
                        </p>
                      </Form.Group>

                      <Form.Group
                        className="mb-4"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>About</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder={user?.about}
                          disabled
                        />
                      </Form.Group>
                    </Form>
                  </div>

                  <Col lg={12} className="mt-5 pt-4">
                    <div className="user-data">
                      <div className="user-data-header ">
                        <Form.Label className="mb-0">Friends</Form.Label>
                      </div>
                      <div className="user-data-table mt-2">
                        <Table responsive className="mb-0 overflow-x-none">
                          <thead>
                            <tr>
                              <th className="p-0">
                                <span className="d-block py-3 px-5">Name</span>
                              </th>
                              <th className="p-0">
                                <span className="d-block py-3 px-5">Gender</span>
                              </th>
                              <th className="p-0">
                                <span className="d-block py-3 px-5">
                                  Birthdate
                                </span>
                              </th>
                              <th className="p-0">
                                <span className="d-block py-3 px-5">Email</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {f_Data &&
                              f_Data?.map((user) => {
                                const {
                                  _id,
                                  user_profile_image,
                                  first_name,
                                  last_name,
                                  gender,
                                  email,
                                  dob,
                                } = user;
                                return (
                                  <tr key={_id}>
                                    <td className="px-5 py-2">
                                      <div className="delete-group ">
                                        <Link
                                          to=""
                                          className="d-flex align-items-center gap-3 p-0 text-decoration-none"
                                        >
                                          <img className="imgs" src={
                                            user_profile_image
                                              ? `${pf}/${user_profile_image}`
                                              : "../images/user.png"
                                          } alt="" />
                                          <span className="d-block text-ellipse" style={{ width: "175px" }}>
                                            {first_name + " " + last_name}
                                          </span>
                                        </Link>
                                      </div>
                                    </td>
                                    <td className="p-0">
                                      <span className="d-block py-3 px-5">
                                        {gender}
                                      </span>
                                    </td>
                                    <td className="p-0">
                                      <span className="d-block py-3 px-5">
                                        {moment(dob).format("L")}
                                      </span>
                                    </td>
                                    <td className="px-5">
                                      <span className="text-ellipse d-block" style={{ width: "150px" }}>{email}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                        {f_Data?.length == 0 ? <p style={{ textAlign: "center" }}>No Friends</p> : null}
                      </div>
                      {!f_Data?.length ? null : <div className="d-flex justify-content-end mt-4">
                        <Pagination_new
                          AllUser={AllFriends}
                          pagination={f_Pagination}
                          current_page={_F_Current_page}
                        />
                      </div>}
                    </div>
                  </Col>

                  <Col lg={12} className="mt-5 pt-4">
                    <div className="user-data">
                      <div className="user-data-header ">
                        <Form.Label className="mb-0">Relationships</Form.Label>
                      </div>
                      <div className="user-data-table mt-2">
                        <Table responsive className="mb-0">
                          <thead>
                            <tr>
                              <th className="p-0">
                                <span className="d-block py-3 px-5">Name</span>
                              </th>
                              <th className="p-0">
                                <span className="d-block py-3 px-5">Gender</span>
                              </th>
                              <th className="p-0">
                                <span className="d-block py-3 px-5">
                                  Birthdate
                                </span>
                              </th>
                              <th className="p-0">
                                <span className="d-block py-3 px-5">Email</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {r_Data &&
                              r_Data?.map((user) => {
                                const {
                                  _id,
                                  user_profile_image,
                                  first_name,
                                  last_name,
                                  gender,
                                  email,
                                  dob,
                                } = user;
                                return (
                                  <tr key={_id}>
                                    <td className="px-5 py-2">
                                      <div className="delete-group ">
                                        <Link
                                          to=""
                                          className="d-flex align-items-center gap-3 p-0 text-decoration-none"
                                        >
                                          <img className="imgs" src={
                                            user_profile_image
                                              ? `${pf}/${user_profile_image}`
                                              : "../images/user.png"
                                          } alt="" />
                                          <span className="d-block text-ellipse" style={{ width: "175px" }}>
                                            {first_name + " " + last_name}
                                          </span>
                                        </Link>
                                      </div>
                                    </td>
                                    <td className="p-0">
                                      <span className="d-block py-3 px-5">
                                        {gender}
                                      </span>
                                    </td>
                                    <td className="p-0">
                                      <span className="d-block py-3 px-5">
                                        {moment(dob).format("L")}
                                      </span>
                                    </td>
                                    <td className="px-5">
                                      <span className="text-ellipse" style={{ width: "150px" }}>{email}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                        {r_Data?.length == 0 ? <p style={{ textAlign: "center" }}>No Relationships</p> : null}
                      </div>
                      {!r_Data?.length ? null : <div className="d-flex justify-content-end mt-4">
                        <Pagination_new
                          AllUser={AllRelationships}
                          pagination={r_Pagination}
                          current_page={_R_Current_page}
                        />
                      </div>}
                    </div>
                  </Col>

                  <Col lg={12} className="mt-5 pt-4">
                    <div className="user-data user-aldeo">
                      <div className="user-data-header ">
                        <Form.Label className="mb-0">Album</Form.Label>
                      </div>
                      <div className="user-data-table mt-2  border-0">
                        <div className="d-flex justify-content-center flex-wrap profile-gap">
                          {allAlbums?.map((i, e) => {
                            return (
                              <div className="img-div" key={e}>
                                <img
                                  src={
                                    i.path
                                      ? `${pf}/${i?.path}`
                                      : "../images/user.png"
                                  }
                                  alt=""
                                  className="img-fluid"
                                />
                                <button onClick={() => openalbum("image", i?._id)}>
                                  {i?.title ? i?.title : "Profile Avatars"}
                                </button>
                              </div>
                            );
                          })}
                          {allAlbums?.length ? null : <h1>No data found</h1>}
                        </div>
                      </div>
                      {!allAlbums?.length ? null : <div className="d-flex justify-content-end mt-4">
                        <Pagination_new
                          AllUser={AllAlbum}
                          pagination={A_Pagination}
                          current_page={_A_Current_page}
                        />
                      </div>}
                    </div>
                  </Col>

                  <Col lg={12} className="mt-5 pt-4">
                    <div className="user-data user-aldeo">
                      <div className="user-data-header ">
                        <Form.Label className="mb-0">Video</Form.Label>
                      </div>
                      <div className="user-data-table mt-2  border-0">
                        <div className="d-flex justify-content-center flex-wrap profile-gap">
                          {allVideos?.map((v, i) => {
                            return (
                              <div className="img-div" key={v._id}>
                                <img
                                  src={
                                    v?.path
                                      ? `${pf}/${v?.path}`
                                      : "../images/user.png"
                                  }
                                  alt=""
                                  className="img-fluid"
                                />
                                <span onClick={() => openalbum("video", v._id)} style={{ cursor: "pointer" }}>
                                  <img
                                    src="../images/video-icon.svg"
                                    alt=""
                                    className="img-fluid video-icon"
                                  />
                                </span>
                                <button onClick={() => openalbum("video", v._id)}>
                                  {v?.title ? v?.title : "Profile Avatars"}
                                </button>
                              </div>
                            );
                          })}
                          {allVideos?.length ? null : <h1>No data found</h1>}
                        </div>
                      </div>
                      {!allVideos?.length ? null : <div className="d-flex justify-content-end mt-4">
                        <Pagination_new
                          AllUser={AllVideo}
                          pagination={V_Pagination}
                          current_page={_V_Current_page}
                        />
                      </div>}
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </Col>

          <Col xl={4} className="order-1 order-xl-2 mb-xl-0 mb-4">
            <div className="user-data">
              <div className="user-data-header user-data-details">
                <img
                  src={
                    user?.user_profile_image
                      ? `${pf}/${user?.user_profile_image}`
                      : "../images/user.png"
                  }
                  alt=""
                  className="prof"
                />
                <div className="d-flex justify-content-center gap-4 gap-lg-5 flex-wrap count-data">
                  <div>
                    <h6 className="num">
                      {user?.relationships?.length
                        ? user?.relationships?.length
                        : 0}
                    </h6>
                    <p className="rele">Realtionships</p>
                  </div>

                  <div>
                    <h6 className="num">
                      {user?.images?.length ? user?.images?.length : 0}
                    </h6>
                    <p className="rele">Photos</p>
                  </div>
                  <div>
                    <h6 className="num">
                      {user?.videos?.length ? user?.videos?.length : 0}
                    </h6>
                    <p className="rele">Videos</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        id="modal-user"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="border-0" closeButton>
          <span style={{ width: "100%", textAlign: "center", fontSize: "20px", fontWeight: "600" }}> {con + "s"}</span>
        </Modal.Header>
        <Album
          albums={albums}
          con={con} />
      </Modal>
    </Layout>
  );
};

export default UserDetails;
