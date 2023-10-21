import React, { useState, useEffect } from "react";
import { Form, Table, Button, Col, Row, Model } from 'react-bootstrap'
import { Link } from "react-router-dom";
import Layout from "../../Layout";
import moment from 'moment';
import { getAllReports } from "../../controller/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner/LoaderSpinner";
import Pagination_new from "../Pagination_new";

const perPage = 10;
const GetReport = () => {
    const [loading, setLoading] = useState(true);
    const [allReports, setAllReports] = useState([]);
    const [paginationVal, setPaginationVal] = useState(1);
    const [current_page, setCurrent_page] = useState(1);



    const AllReports = async (pages) => {
        try {
            const SchoolData = await getAllReports(perPage, pages);
            console.log("SchoolData", SchoolData);
            const { status, message, data, count, pagination_value, current_page: page, } = SchoolData;
            if (status === 1) {
                setAllReports(data);
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
    const deletReport = async (i, name) => {
        let check = window.confirm("are you sure you want to delete " + name);
        // if (check) {
        //   try {
        //     const res = await axios.delete(`/delete-all-school?id=${i}`);
        //     if (res.data.status === 1) {
        //       toast.success(res.data.message);
        //       AllSchool(current_page);
        //     } else {
        //       toast.error(res.data.message);

        //     }
        //   } catch (error) {
        //     console.log(error, "school-page-error")
        //   }
        // }
    };
    useEffect(() => {
        AllReports();
        document.title = "Skoolfame | Reports";
    }, []);

    return (
        <Layout>
            <div className="document-main py-4 px-5">
                <Row>
                    <Col lg={12}>
                        <div className="user-data">
                            <div className="user-data-header d-flex align-items-center justify-content-between">
                                <h1>Reported User</h1>
                            </div>
                            <div className="user-data-table mt-4">
                                <Table responsive className="mb-0 px-4 pb-2">
                                    <thead>
                                        <tr>
                                            <th className="p-0">
                                                <span className="d-block py-3 px-5">Posted User</span>
                                            </th>
                                            <th className="p-0">
                                                <span className="d-flex justify-content-center py-3 px-5">
                                                    Reported User
                                                </span>
                                            </th>
                                            <th className="p-0 text-center">
                                                <span className="d-block py-3 px-5">Reported User Email</span>
                                            </th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loading && allReports.length !== 0 && allReports?.map((report, index) => {
                                            return report.reportedUsers.map((reportedUser, userIndex) => {
                                                const senderUser = report.senderUser[userIndex];
                                                const {
                                                    _id,
                                                    first_name: reportedFirstName,
                                                    last_name: reportedLastName,
                                                    email: reportedEmail,
                                                } = reportedUser;

                                                const {
                                                    first_name: senderFirstName,
                                                    last_name: senderLastName,
                                                } = senderUser;

                                                return (
                                                    <tr key={`${_id}-${userIndex}`}>
                                                        <td className="bg-orange">
                                                            <div className="delete-group">
                                                                <span className="d-block text-ellipse">
                                                                    {senderFirstName} {senderLastName}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="bg-orange text-center">
                                                            <span className="d-block py-3 px-5">
                                                                {reportedFirstName} {reportedLastName}
                                                            </span>
                                                        </td>
                                                        <td className="bg-orange text-center">
                                                            <span className="d-block py-3 px-5">{reportedEmail}</span>
                                                        </td>

                                                    </tr>
                                                );
                                            });
                                        })}
                                    </tbody>

                                </Table>
                            </div>
                            {loading ? (
                                <h1 className="lod">
                                    <LoadingSpinner />
                                </h1>
                            ) : allReports.length === 0 ? (
                                <h1 className="lod">No data available of school</h1>
                            ) : null}
                            <div className="d-flex justify-content-end mt-4">
                                <Pagination_new
                                    AllUser={AllReports}
                                    pagination={paginationVal}
                                    current_page={current_page}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>

    )
}

export default GetReport