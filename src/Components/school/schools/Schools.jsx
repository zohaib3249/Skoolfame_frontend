import React, { useEffect, useState } from "react";
import { Modal, Table, Form } from "react-bootstrap";
import { Button, Dialog, DialogContent } from "@mui/material";
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
import { addSuperlatives,addGroups } from "../../../controller/api";
import {
  SearchIcon,
  SortingIcon,
  DeleteIcon,
  DeleteDialogIcon,
  AwardIcon,
  AlertCircle,
  UsersIcon,
  EditIcon,
  UserIcon,
} from "../../../Icons";

const Document = () => {
  const [show, setShow] = useState(false);
  const [superShow, setSuperShow] = useState(false);
  const [groupShow, setGroupShow] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [allSchools, setAllSchools] = useState([]);
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [rev, setRev] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [groups, setGroups] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [schoolId, setSchoolId] = useState("");
  const [superlatives, setSuperlatives] = useState([]);
  const [editSuperIndex, setEditSuperIndex] = useState(null);
  const [schoolIconId, setSchoolIconId] = useState(null);

  const perPage = 10;
  const pf = process.env.REACT_APP_PUBLIC_URL;
  moment.updateLocale("en-in", localization);

  // METHODS

  const handleShow = () => setShow(true);
  const handleSuperShow = () => setSuperShow(true);
  const handleGroupsShow = () => setGroupShow(true);

  //

  const handleClose = () => {
    setShow(false);
    setSuperShow(false);
    setGroupShow(false);
    setAddress("");
    setName("");
    setNewName("");
    setSchoolIconId(null);
  };

  //

  const rever = () => {
    // setAllSchools([...allSchools].reverse())
    setRev(!rev);
  };

  //

  const deletSchool = async () => {
    if (schoolId !== "") {
      try {
        const res = await axios.delete(`/delete-all-school?id=${schoolId}`);
        if (res.data.status === 1) {
          toast.success(res.data.message);
          AllSchool(current_page);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error, "school-page-error");
      }
    }
  };
  const AddNewSuperlative = () => {
    if (newName !== "") {
      const data = {
        name: newName,
      };
      if (editSuperIndex !== null) {
        const arrData = [...superlatives];
        arrData.splice(editSuperIndex, 1, data);
        setSuperlatives(arrData);
        setEditSuperIndex(null);
      } else {
        setSuperlatives([...superlatives, data]);
      }
      setNewName("");
    }
  };
  const EditSuperlative = (i) => {
    setEditSuperIndex(i);
    setNewName(superlatives[i].name);
  };
  const DeleteSuperlative = (i) => {
    const data = [...superlatives];
    data.splice(i, 1);
    setSuperlatives(data);
  };
  const addName = async () => {
    const payload=[...superlatives];
    if (superlatives.length == 0) {
      if (newName.trim().length == 0) {
        toast.error("Please enter name");
        return;
      }
      else{
        const data = {
          name: newName,
        };
        payload.splice(0, 0, data);
      }
    }
    else if (newName !== "") {
      const data = {
        name: newName,
      };
      if (editSuperIndex !== null) {
        payload.splice(editSuperIndex, 1, data);
        setEditSuperIndex(null)
      } else {
        payload.splice(payload.length-1, 0, data);
      }
      setNewName("");
    }
    try {
      const AllSuperlative = await addSuperlatives(payload,schoolIconId);
      // const res = await axios.post("/add-superlative", {  school_id: id,  name: newName,});
      if (AllSuperlative.status == 1) {
        setSuperShow(false);
        AllSchool(1);
        // SchoolDetails(current_page);
        toast.success(AllSuperlative.message);
        setNewName("");
      } else {
        toast.error(AllSuperlative.message);
      }
    } catch (error) {
      console.log(error);
    }
    setSchoolIconId(null);
  };

  const AddNewGroup = () => {
    if (newName !== "" && selectedImage!== null) {
      const data = {
        name: newName,
        image: selectedImage,
      };
      if (editIndex !== null) {
        const arrData = [...groups];
        arrData.splice(editIndex, 1, data);
        setGroups(arrData);
        setEditIndex(null);
      } else {
        setGroups([...groups, data]);
      }
      setNewName("");
      setSelectedImage(null);
    }
  };
  const EditGroup = (i) => {
    setEditIndex(i);
    setNewName(groups[i].name);
    setSelectedImage(groups[i].image)
  };
  const DeleteGroup = (i) => {
    const data = [...groups];
    data.splice(i, 1);
    setGroups(data);
  };
  async function convertImagesToBase64(data) {
    const promises = data.map(async (item) => {
        if (item.image instanceof File) {
            const base64Image = await fileToBase64(item.image);
            return { name: item.name, image: base64Image };
        }
        return item; // If "image" is not a File object, keep it as it is
    });

    return Promise.all(promises);
}

// Function to convert a File object to a Base64 string
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}
function handleGroupSubmission(){
  const payload=[...groups];
  if (groups.length === 0) {
    if (newName.trim().length === 0) {
      toast.error("Please enter group name");
      return;
    }
    else if( selectedImage=== null){
      toast.error("Please enter group image");
      return;
    }
    else{
      const data = {
        name: newName,
        image: selectedImage,
      };
      payload.splice(0, 0, data);
    }
  }
  else if (newName !== "" && selectedImage!== null) {
    const data = {
      name: newName,
      image: selectedImage,
    };
    if (editIndex !== null) {
      payload.splice(editIndex, 1, data);
      setEditIndex(null);
    } else {
      payload.splice(payload.length-1, 0, data);
    }
    setNewName("");
    setSelectedImage(null);
  }
  convertImagesToBase64(payload)
    .then((resultArray) => {
      addGroup(resultArray)
    })
    .catch((error) => {
        console.error('An error occurred while converting images:', error);
    });
}
  const addGroup = async (resultArray) => {
    try {
      const AllGroups = await addGroups(resultArray,schoolIconId);
      // const res = await axios.post("/add-superlative", {  school_id: id,  name: newName,});
      if (AllGroups.status == 1) {
        AllSchool(1);
        setGroupShow(false);
        // SchoolDetails(current_page);
        toast.success(AllGroups.message);
        setNewName("");
        setSelectedImage(null);
      } else {
        toast.error(AllGroups.message);
      }
    } catch (error) {
      console.log(error);
    }
    setSchoolIconId(null);
  };

  //

  const addSchool = async (e) => {
    e.preventDefault();
    if (name.trim().length == 0 || address.trim().length == 0) {
      toast.error("Please enter empty fields");
      setAddress("");
      setName("");
      return;
    }
    try {
      const SchoolData = await axios.post("/add-school", {
        name: name.trim(),
        address: address.trim(),
      });
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
      const {
        status,
        message,
        data,
        count,
        pagination_value,
        current_page: page,
      } = SchoolData;
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
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  //

  useEffect(() => {
    AllSchool();
    document.title = "Skoolfame | Schools";
  }, [searchData, rev]);

  return (
    <Layout>
      <div className="home-main">
        <div className="school-main-heading d-flex justify-content-between align-items-center">
          Schools
          <Link
            to="/addschool"
            onClick={handleShow}
            style={{ textDecoration: "none" }}
          >
            <button className="custom-btn">Add School</button>
          </Link>
        </div>
        <div className="school-data-heading d-flex align-items-center justify-content-between">
          <h1 className="heading-data">All Schools</h1>
          <div className=" d-flex align-items-center">
            <button className="custom-btn" onClick={handleGroupsShow}>
              Add Groups
            </button>
            <button className="custom-btn mx-2" onClick={handleSuperShow}>
              Add Superlative
            </button>
            <div class="form-group has-search">
              <span class="form-control-feedback">
                <SearchIcon />
              </span>
              <input
                className="form-control"
                type="text"
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
                placeholder="Search by keyword"
              />
            </div>
          </div>
        </div>
        <div className="custom-data-table">
          <Table responsive className="mb-0 px-4 pb-2">
            <thead>
              <tr>
                <th className="table-heading" width="19%">
                  School Name
                </th>
                <th className="table-heading" width="13%">
                  States
                </th>
                <th className="table-heading" width="13%">
                  Education Level
                </th>
                <th className="table-heading" width="13%">
                  Superlatives
                </th>
                <th className="table-heading" width="13%">
                  School Users
                </th>
                <th className="table-heading" width="29%">
                  Created At
                  <span
                    style={{ marginLeft: "2px", cursor: "pointer" }}
                    onClick={rever}
                  >
                    <SortingIcon />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                allSchools.length !== 0 &&
                allSchools?.map((school, i) => {
                  const {
                    _id,
                    school_profile_image,
                    name,
                    state,
                    createdAt,
                    schoolType,
                    users,
                    superlatives,
                    school_user,
                  } = school;
                  return (
                    <tr
                      key={_id}
                      className={i % 2 == 0 ? "even-row" : "odd-row"}
                    >
                      <td className="table-data" width="19%">
                        <div className="delete-group ">
                         
                            {name}
                        
                        </div>
                      </td>
                      <td className="table-data" width="13%">
                      {state}
                      </td>
                      <td className="table-data" width="13%">
                           {schoolType?schoolType:''}
                      </td>
                      <td className="table-data" width="13%">
                      {superlatives ? superlatives?.length : 0}
                      </td>
                      <td className="table-data" width="13%">
                        {school_user ? school_user : "0"}
                      </td>
                      <td className="table-data" width="13%">
                  
                        {moment(createdAt).format("L")}
                        
                      </td>
                      <td className="table-data" width="15%">
                        <div className="delete-group d-flex align-items-center justify-content-end gap-3">
                          {/* <Link
                                  to={`/Superlatives/${_id}`}
                                  className="d-flex align-items-center gap-3 p-0 text-decoration-none">
                                  <Button>Info</Button>
                                </Link> */}
                          <span style={{ cursor: "pointer" }} onClick={()=>{handleSuperShow();setSchoolIconId(_id)  }}>
                            <AwardIcon />
                          </span>
                          <span style={{ cursor: "pointer" }}>
                          <Link
                            to={`/Superlatives/${_id}`}
                            className="p-0 text-decoration-none"
                            style={{ color: "#000" }}
                          >
                            <AlertCircle />
                            </Link>
                          </span>
                          <span style={{ cursor: "pointer" }} onClick={()=>{handleGroupsShow();setSchoolIconId(_id)}}>
                          {/* <Link
                            to={`/Groups/${_id}`}
                            className="p-0 text-decoration-none"
                            style={{ color: "#000" }}
                          > */}
                            <UsersIcon />
                            {/* </Link> */}
                          </span>
                          <span style={{ cursor: "pointer" }}>
                          <Link
                            to={`/editschool/${_id}`}
                            className="p-0 text-decoration-none"
                            style={{ color: "#000" }}
                          >
                           <EditIcon />
                          </Link>
                          </span>
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
        ) : allSchools.length === 0 ? (
          <h1 className="lod">No data available of school</h1>
        ) : null}
        <div className="d-flex justify-content-end mt-4 w-100">
          <Pagination_new
            AllUser={AllSchool}
            pagination={paginationVal}
            current_page={current_page}
          />
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="modal_superlative"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add School</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGridEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formGridEmail" className="mt-4">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Button className="submit-btn" onClick={addSchool}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Dialog
       open={superShow}
        onClose={handleClose}
         aria-labelledby="responsive-dialog-title">
        <DialogContent className="custom-delete-dialog">
          <p className="heading mx-auto mb-3">Add Superlative</p>
          {superlatives.length > 0 &&
            superlatives.map((item, i) => (
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="added-name">{item.name}</p>
                <div className="d-flex align-items-center">
                  <div
                    className="me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => EditSuperlative(i)}
                  >
                    <EditIcon />
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => DeleteSuperlative(i)}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              </div>
            ))}
        <Form>
        <div className="custom-input">
            <Form.Group controlId="formGridEmail">
              <Form.Label className="title-lable">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                required="true"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <p className="add-more-btn mt-2" onClick={() => AddNewSuperlative()}>
                + Add new superlative
              </p>
            </div>
            <button className="custom-btn w-100" onClick={addName}>
              Submit
            </button>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={groupShow}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent className="custom-delete-dialog">
          <p className="heading mx-auto mb-3">Add Group</p>
          {groups.length > 0 &&
            groups.map((item, i) => (
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="added-name">{item.name}</p>
                <div className="d-flex align-items-center">
                  <div
                    className="me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => EditGroup(i)}
                  >
                    <EditIcon />
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => DeleteGroup(i)}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              </div>
            ))}
          <Form>
            <div className="custom-input">
              <Form.Group controlId="formGridEmail">
                <Form.Label className="title-lable">Group Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  required="true"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-center mt-3">
                <input
                  type="file"
                  id="file-input"
                  accept="image/jpeg, image/png, image/svg+xml"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
                <label htmlFor="file-input">
                  <UserIcon />
                </label>
              </div>
              <p className="group-image-heading mt-2">{selectedImage!== null?selectedImage.name:'Add Image' }</p>
              <p className="add-more-btn mt-2" onClick={() => AddNewGroup()}>
                + Add more group
              </p>
            </div>
            <button className="custom-btn w-100" onClick={() => handleGroupSubmission()}>
              Submit
            </button>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={openDeleteDialog} aria-labelledby="responsive-dialog-title">
        <DialogContent className="custom-delete-dialog">
          <div className="text-center">
            <DeleteDialogIcon />
          </div>
          <p className="heading mt-3">Delete School</p>
          <p className="data my-3">
            Are you sure you want to delete this School? This action cannot be
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

export default Document;
