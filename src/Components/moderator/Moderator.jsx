import React, { useEffect, useState,useRef } from "react";
import { Table, Form } from "react-bootstrap";
import { Button, Dialog, DialogContent } from "@mui/material";
import Layout from "../../Layout";
import "./moderator.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import Pagination_new from "../Pagination_new";
import { getAllWords,uploadWordCSV } from "../../controller/api";
import localization from "moment/locale/en-in";
import LoadingSpinner from "../LoadingSpinner/LoaderSpinner";
import axios from "axios";
import { DeleteIcon, DeleteDialogIcon, SortingIcon,EditIcon } from "../../Icons";
import { addWords } from "../../controller/api";

const Moderator = () => {
  const [show, setShow] = useState(false);
  const [wordShow, setWordShow] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [allSchools, setAllSchools] = useState([]);
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rev, setRev] = useState(false);
  const [words, setWords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newName, setNewName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [wordId, setWordId] = useState("");

  const fileInputRef = useRef(null);

  const perPage = 10;
  const pf = process.env.REACT_APP_PUBLIC_URL;
  moment.updateLocale("en-in", localization);

  const handleClose = () => {
    setShow(false);
    setWordShow(false);
    setNewName("");
  };

  //

  const rever = () => {
    // setAllSchools([...allSchools].reverse())
    setRev(!rev);
  };

  //

  const deletSchool = async () => {
    if (wordId !== "") {
      try {
        const res = await axios.delete(`/moderators/${wordId}`);
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

  const addName = async () => {
    const payload=[...words];
    if (words.length == 0) {
      if (newName.trim().length == 0) {
        toast.error("Please enter name");
        return;
      }
      else{
        const data = {
          keyword: newName,
        };
        payload.splice(0, 0, data);
      }
    }
    else if (newName !== "") {
      const data = {
        keyword: newName,
      };
      if (editIndex !== null) {
        payload.splice(editIndex, 1, data);
        setEditIndex(null)
      } else {
        payload.splice(payload.length-1, 0, data);
      }
      setNewName("");
    }
    try {
      const AllWords = await addWords(payload);
      // const res = await axios.post("/add-superlative", {  school_id: id,  name: newName,});
      if (AllWords.status == 1) {
        setWordShow(false);
        // SchoolDetails(current_page);
        toast.success(AllWords.message);
        setNewName("");
      } else {
        toast.error(AllWords.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const AddNewWord = () => {
    if (newName !== "") {
      const data = {
        keyword: newName,
      };
      if (editIndex !== null) {
        const arrData = [...words];
        arrData.splice(editIndex, 1, data);
        setWords(arrData);
        setEditIndex(null);
      } else {
        setWords([...words, data]);
      }
      setNewName("");
    }
  };
  const EditWord = (i) => {
    setEditIndex(i);
    setNewName(words[i].keyword);
  };
  const DeleteWord = (i) => {
    const data = [...words];
    data.splice(i, 1);
    setWords(data);
  };

  const AllSchool = async (pages) => {
    try {
      const SchoolData = await getAllWords(perPage, pages, searchData, rev);
      const {
        status,
        message,
        data,
        count,
        pagination_value,
        current_page,
      } = SchoolData;
      if (status === 1) {
        setAllSchools(data);
        setPaginationVal(pagination_value);
        setCurrent_page(current_page);
        setLoading(false);
      } else {
        toast.error(message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error, "school-page-error");
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };


  const handleFileChange = async  (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile.type === 'text/csv' && selectedFile.size <= 30000000) {
        const createdData = await uploadWordCSV(selectedFile);
    if (createdData) {
      const { message, status } = createdData;
      if (status === 1) {
        AllSchool();
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
        console.log('Selected file:', selectedFile.name);
      } else {
        alert('Please select a CSV file with a maximum size of 30MB.');
        e.target.value = '';
      }
    }
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
          Moderator
          <div className="d-flex align-items-center">
          <div className="me-2" >
          <button onClick={handleButtonClick} className="custom-btn">Upload CSV</button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
    <button onClick={()=>setWordShow(true)} className="custom-btn">Add Word</button>
          </div>
            
        </div>
        <div className="custom-data-table" style={{borderTop:"1px solid var(--gray-200, #EAECF0)"}}>
          <Table responsive className="mb-0 px-4 pb-2">
            <thead>
              <tr>
                <th className="table-heading" width="60%">
                  Word
                </th>
                <th
                  className=" d-flex align-items-center table-heading"
                  width="40%"
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
                allSchools.length !== 0 &&
                allSchools?.map((school, i) => {
                  const {
                    _id,
                    keyword,
                    createdAt,
                  } = school;

                  return (
                    <tr
                      key={_id}
                      className={i % 2 == 0 ? "even-row" : "odd-row"}
                    >
                      <td className="table-data" width="60%">
                        <div className="delete-group ">
                            {keyword}
                        </div>
                      </td>
                      <td className="table-data" width="30%">
                        {moment(createdAt).format("L")}
                      </td>
                      <td className="table-data" width="10%">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setOpenDeleteDialog(true);
                              setWordId(_id);
                            }}
                          >
                            <DeleteIcon />
                          </span>
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

      <Dialog open={wordShow} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogContent className="custom-delete-dialog">
          <p className="heading mx-auto mb-3">Add Word</p>
          {words.length > 0 &&
            words.map((item, i) => (
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="added-name">{item.keyword}</p>
                <div className="d-flex align-items-center">
                  <div
                    className="me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => EditWord(i)}
                  >
                    <EditIcon />
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => DeleteWord(i)}
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
            <p className="add-more-btn mt-2" onClick={() => AddNewWord()}>
                + Add new word
              </p>
            </div>
            <button className="custom-btn w-100" onClick={addName}>
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
          <p className="heading mt-3">Delete Word</p>
          <p className="data my-3">
            Are you sure you want to delete this Word? This action cannot be
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

export default Moderator;
