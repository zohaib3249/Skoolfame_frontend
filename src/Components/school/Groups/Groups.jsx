import React, { useState, useEffect } from "react";
import Layout from "../../../Layout";
import { Table, Form, Modal, Button, } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { getGroups } from "../../../controller/api";
import { Dialog, DialogContent } from "@mui/material";
import moment from "moment";
import localization from "moment/locale/en-in";
import LoadingSpinner from "../../LoadingSpinner/LoaderSpinner";
import Pagination_new from "../../Pagination_new";
import axios from "axios";
import { toast } from "react-toastify";
import { SearchIcon,SortingIcon, DeleteIcon, DeleteDialogIcon } from "../../../Icons";

const Groups = () => {

  const [show, setShow] = useState(false);
  const [rev, setRev] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [schools, setSchools] = useState([]);
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
  const deletSchool = async () => {
    if (schoolId !== "") {
      try {
        const res = await axios.delete(`/school-timeline/school-groups/delete-group?id=${schoolId}`);
        if (res.data.status === 1) {
          toast.success(res.data.message);
          SchoolDetails(current_page);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error, "school-page-error");
      }
    }
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
      const SchoolData = await getGroups(perPage, pages, searchData, id, rev);
      const { status, message, data, count, pagination_value,
        current_page, } =
        SchoolData;
      if (status === 1) {
        setSchools(data);
        setPaginationVal(pagination_value);
        setCurrent_page(current_page);
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
          Groups
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
                      <th className="table-heading" width="25%">
                       Group Name
                      </th>
                      <th className="table-heading" width="15%">
                       Member
                      </th>
                      <th className="table-heading" width="15%">
                       School Name
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
                      schools?.map((group,i) => {
                        const { _id, members, school, createdAt, name, } = group;
                        return (
                          <tr key={_id} className={i % 2 == 0 ? "even-row" : "odd-row"}>
                            <td className="table-data" width="25%">
                              <div className="delete-group ">
                                    {name}
                              </div>
                            </td>
                            <td className="table-data" width="15%">
                             
                                {members?.length}  
                        
                            </td>
                            <td className="table-data" width="15%">
                             
                             {school.name}  
                     
                         </td>
                            <td className="table-data" width="15%">
                             
                                {moment(createdAt).format("L")}
                           
                            </td>
                            <td className="table-data" width="20%">
                              <div className="nominees-btn">
                                <Link to={`/members/${_id}`} style={{textDecoration:'none',color:"#000"}}>
                                    View Members
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
                            onClick={() => {
                              setOpenDeleteDialog(true);
                              setSchoolId(_id);
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
              ) : schools?.length === 0 ? (
                <h1 className="lod">no data available of Groups</h1>
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
      <Dialog open={openDeleteDialog} aria-labelledby="responsive-dialog-title">
        <DialogContent className="custom-delete-dialog">
          <div className="text-center">
            <DeleteDialogIcon />
          </div>
          <p className="heading mt-3">Delete School</p>
          <p className="data my-3">
            Are you sure you want to delete this Group? This action cannot be
            undone.
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
                deletSchool();
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

export default Groups;
