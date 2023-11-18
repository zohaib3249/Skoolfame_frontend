import React, { useState, useEffect } from "react";
import { Form, Table, Button, Col, Row, Model } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../user/user.css";
import Layout from "../../Layout";
import moment from "moment";
import Avatar from "@mui/material/Avatar";
import { getAllReports } from "../../controller/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner/LoaderSpinner";
import Pagination_new from "../Pagination_new";
// import { SearchIcon } from "../../Icons";

const perPage = 10;
const pf = process.env.REACT_APP_PUBLIC_URL;
const GetReport = () => {
  const [loading, setLoading] = useState(true);
  // const [searchData, setSearchData] = useState("");
  const [allReports, setAllReports] = useState([]);
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);

  const AllReports = async (pages) => {
    try {
      const SchoolData = await getAllReports(perPage, pages);//searchData
      const {
        status,
        message,
        data,
        count,
        pagination_value,
        current_page: page,
      } = SchoolData;
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
  }, []);//searchData


  return (
    <Layout>
      <div className="home-main">
        <div className="user-main-heading">Reported Users</div>
        <div className="user-data-heading d-flex align-items-center justify-content-between">

        </div>
        <div className="custom-data-table">
          <Table responsive className="mb-0 px-4 pb-2">
            <thead>
              <tr>
                <th className="table-heading" width="33%">
                  Posted User
                </th>
                <th className="table-heading" width="33%">
                  Reported User
                </th>
                <th className="table-heading" width="34%">
                  Reported Post
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                allReports.length !== 0 &&
                allReports?.map((report, index) => {
                  let postDatas = report.postData;
                  console.log(postDatas)
                  return report.reportedUsers.map((reportedUser, userIndex) => {

                    const senderUser = report.senderUser[userIndex];

                    const {
                      _id,
                      postData,
                      first_name: reportedFirstName,
                      last_name: reportedLastName,
                      email: reportedEmail,
                      user_profile_image: reportedProfileImage,
                    } = reportedUser;

                    return (
                      <tr key={`${_id}-${userIndex}`} className={index % 2 == 0 ? "even-row" : "odd-row"}>
                        <td className="table-data" width="33%">
                          <div className="d-flex align-items-center">
                            <Avatar
                              alt={`${senderUser?.first_name + " " + senderUser?.last_name
                                }`}
                              src={
                                senderUser?.user_profile_image
                                  ? `${pf}/${senderUser?.user_profile_image}`
                                  : "./images/user.png"
                              }
                              sx={{ width: 32, height: 32 }}
                            />
                            <div className="ms-2">
                              <p className="user-name">
                                {`${senderUser?.first_name + " " + senderUser?.last_name
                                  }`}
                              </p>
                              <p className="user-email">
                                {senderUser?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="table-data" width="33%">
                          <div className="d-flex align-items-center">
                            <Avatar
                              alt={`${reportedFirstName + " " + reportedLastName
                                }`}
                              src={
                                reportedProfileImage
                                  ? `${pf}/${reportedProfileImage}`
                                  : "./images/user.png"
                              }
                              sx={{ width: 32, height: 32 }}
                            />
                            <div className="ms-2">
                              <p className="user-name">
                                {`${reportedFirstName + " " + reportedLastName
                                  }`}
                              </p>
                              <p className="user-email">
                                {reportedEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="table-data" width="34%">
                          {postDatas?.message_type === 'text' ? (
                            postDatas?.message
                          ) : postDatas?.message_type === 'image' && postDatas?.images_list.length > 0 ? (
                            <a href={`${pf}/${postDatas.images_list[0]}`} target="_blank" rel="noopener noreferrer">
                              Open {postDatas?.message_type}
                            </a>
                          ) : (
                            <a href={`${pf}/${postDatas?.message}`} target="_blank" rel="noopener noreferrer">
                              Open {postDatas?.message_type}
                            </a>
                          )}
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
        <div className="d-flex justify-content-end mt-4 w-100">
          <Pagination_new
            AllUser={AllReports}
            pagination={paginationVal}
            current_page={current_page}
          />
        </div>
      </div>
    </Layout>
  );
};

export default GetReport;
