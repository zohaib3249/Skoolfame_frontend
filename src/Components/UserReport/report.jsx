import React, { useState, useEffect } from "react";
import { Table, Col, Row } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import { getAllUserReports } from "../../controller/api";
import { toast } from "react-toastify";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import LoadingSpinner from "../LoadingSpinner/LoaderSpinner";
import Pagination_new from "../Pagination_new";
import Layout from "../../Layout";
import moment from "moment";

const perPage = 10;
const pf = process.env.REACT_APP_PUBLIC_URL;

const GetReport = () => {
  const [loading, setLoading] = useState(true);
  const [allReports, setAllReports] = useState([]);
  const [paginationVal, setPaginationVal] = useState(1);
  const [current_page, setCurrent_page] = useState(1);

  const AllReports = async (pages) => {
    try {
      const userData = await getAllUserReports(perPage, pages);
      const {
        status,
        message,
        reports,
        pagination_value,
        current_page: page,
      } = userData;
      if (status === 1) {
        setAllReports(reports);
        setPaginationVal(pagination_value);
        setCurrent_page(page);
        setLoading(false);
      } else {
        toast.error(message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error, "user-report-page-error");
    }
  };

  useEffect(() => {
    AllReports();
    document.title = "Skoolfame | User Reports";
  }, []);


  return (
    <Layout>
      <div className="home-main">
        <div className="user-main-heading">Reported Users</div>

        <div className="custom-data-table">
          <Table responsive className="mb-0 px-4 pb-2">
            <thead>
              <tr>
                <th className="table-heading" width="33%">
                  Reported User
                </th>
                <th className="table-heading" width="33%">
                  Reporters
                </th>
                <th className="table-heading" width="34%">
                  Report Count
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                allReports.length !== 0 &&
                allReports.map((report, index) => (
                  <tr
                    key={report._id}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    <td className="table-data" width="33%">
                      <div className="d-flex align-items-center">
                        <Avatar
                          alt={`${report.reported_user.first_name} ${report.reported_user.last_name}`}
                          src={`${pf}/${report.reported_user.user_profile_image}`}
                          sx={{ width: 32, height: 32 }}
                        />
                        <div className="ms-2">
                          <p className="user-name">
                            {`${report.reported_user.first_name} ${report.reported_user.last_name}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-data" width="33%">
                      <div className="d-flex align-items-center">
                        {report.reporters.map((reporter) => (
                          <OverlayTrigger
                            key={reporter._id}
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-${reporter._id}`}>
                                {`${reporter.first_name} ${reporter.last_name}`}
                              </Tooltip>
                            }
                          >
                            <Avatar
                              alt={`${reporter.first_name} ${reporter.last_name}`}
                              src={`${pf}/${reporter.user_profile_image}`}
                              sx={{ width: 32, height: 32, marginLeft: '5px' }}
                            />
                          </OverlayTrigger>
                        ))}
                      </div>
                    </td>
                    <td className="table-data" width="34%">
                      {report.reporters.length}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        {loading ? (
          <h1 className="lod">
            <LoadingSpinner />
          </h1>
        ) : allReports.length === 0 ? (
          <h1 className="lod">No data available for user reports</h1>
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
