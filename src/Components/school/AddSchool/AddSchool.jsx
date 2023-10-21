import React, { useEffect, useState } from 'react'
import { Form, Table, Button, Col, Row, Model } from 'react-bootstrap'
import { Link } from "react-router-dom";
import Layout from '../../../Layout'
import moment from 'moment';
import './addSchool.css'
import { FaRegImage } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify';
import { createSchool } from '../../../controller/api'
import Dropdown from 'react-bootstrap/Dropdown';
import statesData from './country.json'

const AddSchool = () => {

    const [school, setSchool] = useState({ name: "", since: "", address: "", state: "", about: "" });
    const [file, setFile] = useState({});
    const [selectedStateAbbr, setSelectedStateAbbr] = useState('');
    const [selectedStateFullName, setSelectedStateFullName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If the changed input is the state field, update state abbreviation and full name
        if (name === 'state') {
            setSelectedStateAbbr(value);
            setSelectedStateFullName(statesData[value]);
        }

        setSchool({ ...school, [name]: value });
    };

    const handleFileInput = (e) => {
        setFile(e.target.files[0]);
    }

    const handleClick = async () => {
        const createdData = await createSchool(school, file)
        if (createdData) {
            const { message, status } = createdData;
            if (status === 1) {
                toast.success(message);
            } else {
                toast.error(message);
            };
        }
    }

    return (
        <Layout>

            <div className="school-main py-4 px-5">
                <div className="user-data-header d-flex align-items-center justify-content-between">
                    <h1>School Creation</h1>
                </div>
                <Row className='mt-5'>
                    <Col lg={6} md={6} sm={12}>
                        <div className='school-input'>
                            <Form.Group controlId='formGridEmail'>
                                <Form.Label className="title-lable">School Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name='name'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                    </Col>
                    <Col lg={6} md={6} sm={12} className="mt-3 mt-md-0">
                        <div className='school-input'>
                            <Form.Group controlId="formGridEmail">
                                <Form.Label className="title-lable">Since Date</Form.Label>
                                <Form.Control
                                    type="text"
                                    name='since'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                    </Col>
                    <Col lg={12} md={12} sm={12} className="mt-3">
                        <div className='school-input'>
                            <Form.Group controlId="formGridEmail">
                                <Form.Label className="title-lable">Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name='address'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                    </Col>

                    <Col lg={12} md={12} sm={12} className="mt-3">
                        <div className='school-input'>
                            <Form.Group controlId="formGridEmail">
                                <Form.Label className="title-lable">State</Form.Label>
                                {/* <Form.Control
                                    type="text"
                                    name='state'
                                    onChange={handleChange}
                                /> */}
                                <Form.Select name="state"
                                    value={selectedStateAbbr}
                                    onChange={handleChange}>
                                    
                                    <option value="">Select State</option>
                                    {/* {Object.keys(statesData).map(abbr => (
                                        <option key={abbr} value={abbr}>
                                            {statesData[abbr]}
                                        </option>
                                    ))} */}
                                    {statesData.map(state => (
                                        <option key={state.abbreviation} value={state.name}>
                                            {state.name}
                                        </option>
                                    ))}
                                </Form.Select>

                            </Form.Group>
                        </div>

                    </Col>
                    <Col lg={12} md={12} sm={12} className="mt-3">
                        <div className='school-input'>
                            <Form.Group controlId="formGridEmail">
                                <Form.Label className="title-lable">About</Form.Label>
                                <Form.Control
                                    type="text"
                                    name='about'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                    </Col>
                    <Col lg={12} md={12} sm={12} className="mt-3">
                        <lable className="title-lable">Upload</lable>
                        <div class="custom-file">
                            <input
                                type="file"
                                class="custom-file__input"
                                id="field-upload"
                                name="file"
                                onChange={handleFileInput}
                                required
                            />
                            <label class="custom-file__label" for="field-upload"><FaRegImage /></label>
                        </div>
                        <Button className='submit-btn' onClick={handleClick}>SUBMIT</Button>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export default AddSchool