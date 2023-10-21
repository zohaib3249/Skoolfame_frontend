import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Table, Form, } from "react-bootstrap";
import Layout from "../../../Layout";
import "./document.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import Pagination_new from "../../Pagination_new";
import { getAllSchool } from "../../../controller/api";
import localization from "moment/locale/en-in";
import LoadingSpinner from "../../LoadingSpinner/LoaderSpinner";
import axios from "axios";
import { addSuperlatives } from '../../../controller/api'


const Document = () => {
  const [show, setShow] = useState(false);
  const [superShow, setSuperShow] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [allSchools, setAllSchools] = useState([]);
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [rev, setRev] = useState(false);
  const [newName, setNewName] = useState("");

  const perPage = 10;
  const pf = process.env.REACT_APP_PUBLIC_URL;
  moment.updateLocale("en-in", localization);

  // METHODS

  const handleShow = () => setShow(true);
  const handleSuperShow = () => setSuperShow(true);

  //

  const handleClose = () => {
    setShow(false);
    setSuperShow(false);
    setAddress("");
    setName("");
    setNewName("");
  };

  //

  const rever = () => {
    // setAllSchools([...allSchools].reverse())
    setRev(!rev)
  };

  //

  const deletSchool = async (i, name) => {
    let check = window.confirm("are you sure you want to delete " + name);
    if (check) {
      try {
        const res = await axios.delete(`/delete-all-school?id=${i}`);
        if (res.data.status === 1) {
          toast.success(res.data.message);
          AllSchool(current_page);
        } else {
          toast.error(res.data.message);

        }
      } catch (error) {
        console.log(error, "school-page-error")
      }
    }
  };

  const addName = async () => {
    if (newName.trim().length == 0) {
      toast.error("Please enter name");
      return
    }
    try {

      const AllSuperlative = await addSuperlatives(newName)
      // const res = await axios.post("/add-superlative", {  school_id: id,  name: newName,});
      if (AllSuperlative.status == 1) {
        setSuperShow(false);
        // SchoolDetails(current_page);
        toast.success(AllSuperlative.message);
        setNewName("");
      } else {
        toast.error(AllSuperlative.message);
      }
    } catch (error) { console.log(error); }
  };

  //

  const addSchool = async (e) => {
    e.preventDefault();
    if (name.trim().length == 0 || address.trim().length == 0) {
      toast.error("Please enter empty fields")
      setAddress("");
      setName("");
      return;
    }
    try {
      const SchoolData = await axios.post("/add-school", { name: name.trim(), address: address.trim() });
      if (SchoolData.data.status == 1) {
        setAddress("");
        setName("");
        setShow(false);
        toast.success("School added successfully");
        AllSchool(1);
      }
    } catch (error) {
      console.log(error, "school-page-error");
    }
  };

  //

  const AllSchool = async (pages) => {
    try {
      const SchoolData = await getAllSchool(perPage, pages, searchData, rev);
      const { status, message, data, count, pagination_value, current_page: page, } = SchoolData;
      if (status === 1) {
        setAllSchools(data);
        setPaginationVal(pagination_value);
        setCurrent_page(page);
        setLoading(false);
      } else {
        toast.error(message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error, "school-page-error");
    }
  };

  //

  useEffect(() => {
    AllSchool();
    document.title = "Skoolfame | Schools";
  }, [searchData, rev]);


  return (
    <Layout>
      <div className="document-main py-4 px-5">
        <Row>
          <Col lg={12}>
            <div className="user-data">
              <div className="user-data-header d-flex align-items-center justify-content-between">
                <h1>Schools</h1>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-flex align-items-center justify-content-end">
                    {/* <Button onClick={handleShow} className="btn-plus shadow-none" > + </Button> */}
                    <Link to="/addschool" onClick={handleShow} className="btn-plus shadow-none addschool" > + </Link>
                  </span>
                  <input placeholder="Search name" type="text" value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                </div>
              </div>
              <div className="user-data-table mt-4">
                <Table responsive className="mb-0 px-4 pb-2">
                  <thead>
                    <tr>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">Name</span>
                      </th>
                      <th className="p-0">
                        <span className="d-flex justify-content-center py-3 px-5">
                          Created At
                          <Button className="bg-transparent border-0 shadow-none p-0" onClick={rever}>
                            <img src="./images/sorting-new.png" alt="" />
                          </Button>
                        </span>
                      </th>
                      <th className="p-0 text-center">
                        <span className="d-block py-3 px-5">Superlatives</span>
                      </th>
                      <th className="p-0 text-center">
                        <span className="d-block py-3 px-5">School Users</span>
                      </th>
                      <th className="p-0">
                        <span className="d-flex align-items-center justify-content-end px-5">
                          <Button onClick={handleSuperShow} className="btn-plus superlative shadow-none" >Add Superlatives</Button>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading &&
                      allSchools.length !== 0 &&
                      allSchools?.map((school) => {
                        const {
                          _id,
                          school_profile_image,
                          name,
                          createdAt,
                          users,
                          superlatives,
                          school_user
                        } = school;

                        return (
                          <tr key={_id}>
                            <td className="bg-orange">
                              <div className="delete-group ">
                                <Link
                                  to={`/Superlatives/${_id}`}
                                  className="p-0 text-decoration-none"
                                >
                                  <span className="d-block text-ellipse">{name}</span>
                                </Link>
                              </div>
                            </td>
                            <td className="bg-orange text-center">
                              <span className="d-block py-3 px-5">
                                {moment(createdAt).format("L")}
                              </span>
                            </td>
                            <td className="bg-orange text-center">
                              <span className="d-block py-3 px-5">
                                {superlatives ? superlatives?.length : 0}
                              </span>
                            </td>
                            <td className="bg-orange text-center">
                              <span className="d-block py-3 px-5 ">
                                {school_user ? school_user : "0"}
                              </span>
                            </td>
                            <td className="bg-orange">
                              <div className="delete-group d-flex align-items-center justify-content-end gap-3">
                                <Link
                                  to={`/Superlatives/${_id}`}
                                  className="d-flex align-items-center gap-3 p-0 text-decoration-none">
                                  <Button>Info</Button>
                                </Link>
                                <Button onClick={() => deletSchool(_id, name)}>Delete</Button>
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
              ) : allSchools.length === 0 ? (
                <h1 className="lod">No data available of school</h1>
              ) : null}
              <div className="d-flex justify-content-end mt-4">
                <Pagination_new
                  AllUser={AllSchool}
                  pagination={paginationVal}
                  current_page={current_page}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="modal_superlative" >
        <Modal.Header closeButton>
          <Modal.Title>Add School</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGridEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formGridEmail" className="mt-4">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </Form.Group>
            <Button className="submit-btn" onClick={addSchool}>Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>


      <Modal
        show={superShow}
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

export default Document;
