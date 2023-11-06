import React, { useEffect, useState } from "react";
import { Form, Table, Button, Col, Row, Model } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../Layout";
import moment from "moment";
import "../AddSchool/addSchool.css";
import { useParams,useNavigate } from 'react-router-dom'
import { FaRegImage } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { getSingleSchool,updateSingleSchool } from "../../../controller/api";
import Dropdown from "react-bootstrap/Dropdown";
import statesData from "../AddSchool/country.json";
import { UploadIcon,UserIcon } from "../../../Icons";

const AddSchool = () => {
  const [school, setSchool] = useState({
    schoolType:"",
    name: "",
    since: "",
    address: "",
    state: "",
    about: "",
  });
  const [file, setFile] = useState({});
  const [selectedStateAbbr, setSelectedStateAbbr] = useState("");
  const [selectedStateFullName, setSelectedStateFullName] = useState("");
  const [selectEduLevel, setSelectEduLevel] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const getSchool = async () => {
    try {
      const data = await getSingleSchool(id);
      console.log('data',data)
      const obj= {
        schoolType:data.data.schoolType?data.data.schoolType:"",
        name: data.data.name?data.data.name:"",
        since: data.data.since?data.data.since:"",
        address: data.data.address?data.data.address:"",
        state:data.data.state?data.data.state: "",
        about:data.data.about?data.data.about: "",
      }
     setSchool(obj)
     if(data.data.schoolType){
      setSelectEduLevel(data.data.schoolType)
     }
     if(data.data.state){
      setSelectedStateAbbr(data.data.state);
     }if(data.data.image.length>0){
      setFile(data.data.image[0])
     }
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };
  useEffect(() => {
    getSchool();
  }, []);

  const levels=[{label:'High School',value:'High School'},{label:'Middle School',value:'Middle School'}]

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the changed input is the state field, update state abbreviation and full name
    if (name === "state") {
      setSelectedStateAbbr(value);
      setSelectedStateFullName(statesData[value]);
    }
    if (name === "schoolType") {
        setSelectEduLevel(value);
      }

    setSchool({ ...school, [name]: value });
  };

  const handleFileInput = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = async () => {
    const createdData = await updateSingleSchool(school, file,id);
    if (createdData) {
      const { message, status } = createdData;
      if (status === 1) {
        navigate("/schools");
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  };
console.log('school',school)
  return (
    <Layout>
      <div className="home-main" style={{ padding: "32px" }}>
        <div className="school-creation-main-heading d-flex justify-content-between align-items-center w-100">
          Edit School
          {/* <button className="custom-btn">Upload CSV</button> */}
        </div>
        {/* <p className="create-school-text mt-3">Create School</p> */}
        <Row className="form-wrap">
          <Col lg={8} md={8} sm={12}>
          <div className="custom-input">
              <Form.Group controlId="formGridEmail">
                <Form.Label className="title-lable">Education Level</Form.Label>
                {/* <Form.Control
                                    type="text"
                                    name='state'
                                    onChange={handleChange}
                                /> */}
                <Form.Select
                  name="schoolType"
                  value={selectEduLevel}
                  onChange={handleChange}
                >
                  <option value="">Select Education Level</option>
                  {/* {Object.keys(statesData).map(abbr => (
                                        <option key={abbr} value={abbr}>
                                            {statesData[abbr]}
                                        </option>
                                    ))} */}
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="custom-input" style={{ width: "48%" }}>
                <Form.Group controlId="formGridEmail">
                  <Form.Label className="title-lable">School Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={school.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="custom-input " style={{ width: "48%" }}>
                <Form.Group controlId="formGridEmail">
                  <Form.Label className="title-lable">Since Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="since"
                    value={school.since}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="custom-input">
              <Form.Group controlId="formGridEmail">
                <Form.Label className="title-lable">Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={school.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="custom-input">
              <Form.Group controlId="formGridEmail">
                <Form.Label className="title-lable">State</Form.Label>
                {/* <Form.Control
                                    type="text"
                                    name='state'
                                    onChange={handleChange}
                                /> */}
                <Form.Select
                  name="state"
                  value={selectedStateAbbr}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {/* {Object.keys(statesData).map(abbr => (
                                        <option key={abbr} value={abbr}>
                                            {statesData[abbr]}
                                        </option>
                                    ))} */}
                  {statesData.map((state) => (
                    <option key={state.abbreviation} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="custom-input">
              <Form.Group controlId="formGridEmail">
                <Form.Label className="title-lable">About</Form.Label>
                <Form.Control
                  type="text"
                  name="about"
                  value={school.about}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="d-flex justify-content-between">
              <div style={{ marginRight: "20px" }}>
                <UserIcon />
              </div>
              <div class="custom-file">
                <input
                  type="file"
                  class="custom-file__input"
                  id="field-upload"
                  name="file"
                  onChange={handleFileInput}
                  required
                />
                <label class="custom-file__label" for="field-upload">
                  <div>
                    <span className="mt-2">
                      <UploadIcon />
                    </span>
                    <div className="upload-text mt-2">
                      <span style={{ color: "#6941C6", fontWeight: "bold" }}>
                        Click to upload{" "}
                      </span>
                      <span>or drag and drop</span>
                    </div>
                    <div className="upload-text">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end mt-3">
              <button variant="primary" onClick={()=> navigate("/schools")} className="custom-cancel-btn me-3">
                Cancel
              </button>
              <button className="custom-btn" onClick={handleClick}>
                Submit
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default AddSchool;
