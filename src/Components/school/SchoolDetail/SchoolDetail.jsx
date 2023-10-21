import React, { useState, useEffect } from "react";
import Layout from "../../../Layout";
import { Col, Row, Table, Pagination, Form, Modal, Button, NavLink, } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { getSchool } from "../../../controller/api";
import { Toast } from "bootstrap";
import moment from "moment";
import localization from "moment/locale/en-in";
import LoadingSpinner from "../../LoadingSpinner/LoaderSpinner";
import Pagination_new from "../../Pagination_new";
import axios from "axios";
import { toast } from "react-toastify";

const SchoolDetail = () => {

  const [show, setShow] = useState(false);
  const [rev, setRev] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [schools, setSchools] = useState([]);
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  const { id } = useParams();
  const perPage = 5;
  const pf = process.env.REACT_APP_PUBLIC_URL;
  moment.updateLocale("en-in", localization);

  // METHODS

  const handleClose = () => {
    setShow(false);
    setNewName("");
  };
  const handleShow = () => setShow(true);

  const rever = () => {
    // setSchools([...schools].reverse());
    setRev(!rev)
  };

  const addName = async () => {
    if (newName.trim().length == 0) {
      toast.error("Please enter name");
      return
    }
    try {
      const res = await axios.post("/add-superlative", { school_id: id, name: newName, });
      if (res.data.status == 1) {
        setShow(false);
        SchoolDetails(current_page);
        toast.success(res.data.message);
        setNewName("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) { console.log(error); }
  };


  const SchoolDetails = async (pages) => {
    try {
      const SchoolData = await getSchool(perPage, pages, searchData, id, rev);
      const { status, message, data, count, paginationValue, page } =
        SchoolData;
      if (status === 1) {
        setSchools(data);
        setPaginationVal(paginationValue);
        setCurrent_page(page);
        setLoading(false);
      } else {
        toast.error(message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    SchoolDetails();
  }, [searchData, rev]);

  useEffect(() => {
    document.title = "Skoolfame | Superlatives"
  }, [])


  return (
    <Layout>
      <div className="user-main py-4 px-4">
        <Row>
          <Col lg={12}>
            <div className="user-data">
              <div className="user-data-header d-flex align-items-center justify-content-between">
                <h1>Superlatives </h1>
                <input
                  placeholder="Search name"
                  type="text"
                  value={searchData}
                  onChange={(e) => setSearchData(e.target.value)}
                />
              </div>
              <div className="user-data-table mt-4">
                <Table responsive className="mb-0 px-4 pb-2">
                  <thead>
                    <tr>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">Name</span>
                      </th>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">Nominees</span>
                      </th>
                      <th className="p-0">
                        <span className="d-flex py-3 px-5">
                          Created At
                          <Button className="bg-transparent border-0 shadow-none p-0" onClick={rever}>
                            <img src="../images/sorting-new.png" alt="" />
                          </Button>
                        </span>
                      </th>
                      <th className="p-0">
                        {/* <span className="d-flex align-items-center justify-content-end px-5">
                          <Button  onClick={handleShow}  className="btn-plus shadow-none">+</Button>
                        </span> */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading &&
                      schools.length !== 0 &&
                      schools?.map((school) => {
                        const { _id, user_profile_image, name, createdAt, users, category_name, } = school;
                        return (
                          <tr key={_id}>
                            <td className="bg-orange">
                              <div className="delete-group ">
                                <div to="" className="d-flex align-items-center gap-3 p-0 text-decoration-none cursor-none">
                                  <span className="trophy">
                                    <img
                                      src={
                                        user_profile_image
                                          ? `${pf}/${user_profile_image}`
                                          : "../images/trophy.svg"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="d-block text-ellipse">
                                    {category_name}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="bg-orange">
                              <span className="d-block py-3 px-5">
                                {users?.length}
                              </span>
                            </td>
                            <td className="bg-orange">
                              <span className="d-block py-3 px-5">
                                {moment(createdAt).format("L")}
                              </span>
                            </td>
                            <td className="bg-orange">
                              <div className="delete-group d-flex align-items-center justify-content-end ps-5">
                                <Link to={`/nominees/${_id}`}>
                                  <Button className="shadow-none">
                                    View Nominees
                                  </Button>
                                </Link>
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
              ) : schools?.length === 0 ? (
                <h1 className="lod">no data available of superlative</h1>
              ) : null}
              <div className="d-flex justify-content-end mt-4">
                <Pagination_new
                  AllUser={SchoolDetails}
                  pagination={paginationVal}
                  current_page={current_page}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* modal */}

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="modal_superlative"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Superlative</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGridEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                required="true"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Button className="submit-btn" onClick={addName}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default SchoolDetail;
