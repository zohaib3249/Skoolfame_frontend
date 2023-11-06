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
import { SearchIcon,SortingIcon, DeleteIcon, DeleteDialogIcon } from "../../../Icons";

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
      <div className="home-main">
            <div className="user-data w-100">
            <div className="school-main-heading d-flex justify-content-between align-items-center">
          Superlative
        </div>
        <div className="school-data-heading w-100">
          <div className="d-flex flex-row-reverse">
            <div class="form-group has-search ms-2">
              <span class="form-control-feedback">
                <SearchIcon />
              </span>
              <input
                className="form-control"
                type="text"
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
                placeholder="Search by name"
              />
            </div>
          </div>
        </div>
              <div className="custom-data-table w-100">
                <Table responsive className="mb-0 px-4 pb-2">
                  <thead>
                    <tr>
                      <th className="table-heading" width="40%">
                       Name
                      </th>
                      <th className="table-heading" width="15%">
                       Nominees
                      </th>
                      <th className="table-heading" width="45%">
                      Created At
                  <span
                    style={{ marginLeft: "2px", cursor: "pointer" }}
                    onClick={rever}
                  >
                    <SortingIcon />
                  </span>
                        
                      </th>
                      {/* <th className="table-heading" width="19%"> */}
                        {/* <span className="d-flex align-items-center justify-content-end px-5">
                          <Button  onClick={handleShow}  className="btn-plus shadow-none">+</Button>
                        </span> */}
                      {/* </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!loading &&
                      schools.length !== 0 &&
                      schools?.map((school,i) => {
                        const { _id, user_profile_image, name, createdAt, users, category_name, } = school;
                        return (
                          <tr key={_id} className={i % 2 == 0 ? "even-row" : "odd-row"}>
                            <td className="table-data" width="40%">
                              <div className="delete-group ">
                                    {category_name}
                              </div>
                            </td>
                            <td className="table-data" width="15%">
                             
                                {users?.length}  
                        
                            </td>
                            <td className="table-data" width="15%">
                             
                                {moment(createdAt).format("L")}
                           
                            </td>
                            <td className="table-data" width="20%">
                              <div className="nominees-btn">
                                <Link to={`/nominees/${_id}`} style={{textDecoration:'none',color:"#000"}}>
                                    View Nominees
                                </Link>
                              </div>
                            </td>
                            <td className="table-data" width="10%">
                        <div className="delete-group d-flex align-items-center justify-content-end gap-3">
                          {/* <Link
                                  to={`/Superlatives/${_id}`}
                                  className="d-flex align-items-center gap-3 p-0 text-decoration-none">
                                  <Button>Info</Button>
                                </Link> */}
                          <span
                            style={{ cursor: "pointer" }}
                            // onClick={() => {
                            //   setOpenDeleteDialog(true);
                            //   setSchoolId(_id);
                            // }}
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
