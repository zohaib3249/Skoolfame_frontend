import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Row, Table, Pagination } from "react-bootstrap";
import { getAllLiveUser } from "../../controller/api";
import Layout from "../../Layout";
import LoadingSpinner from "../LoadingSpinner/LoaderSpinner";
import Pagination_new from "../Pagination_new";
import "./dashboard.css";
import moment from "moment";
import localization from "moment/locale/en-in";
import { toast } from "react-toastify";
import {SearchIcon} from '../../Icons';
import Avatar from "@mui/material/Avatar";

const Dashboard = () => {
  const [searchData, setSearchData] = useState("");
  const [liveUser, setLiveUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [allUserS, setAllUserS] = useState([]);
  const [allUserL, setAllUserL] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [totalSchool, setTotalSchool] = useState(0);
  const [Current_page, setCurrent_page] = useState(1);
  const per_page = 10;
  const [pagination, setPagination] = useState(1);
  const pf = process.env.REACT_APP_PUBLIC_URL;
  // const pf = "http://192.168.40.29:3000"
  moment.updateLocale("en-in", localization);
  const user = JSON.parse(localStorage.getItem('user') ?? null);

  //METHOD

  const AllFriends = (pages) => {
    if (pages === 1) {
      setAllUserL(
        searchData
          ? allUserS
              .filter((user) =>
                `${user.user?.first_name + " " + user?.user?.last_name}`
                  .toLowerCase()
                  .includes(searchData)
              )
              .slice(pages - 1, per_page)
          : allUser.slice(pages - 1, per_page)
      );
    } else {
      setAllUserL(
        searchData
          ? allUserS
              .filter((user) =>
                `${user.user?.first_name + " " + user?.user?.last_name}`
                  .toLowerCase()
                  .includes(searchData)
              )
              .slice(
                pages * per_page - per_page,
                pages * per_page - per_page + per_page
              )
          : allUser?.slice(
              pages * per_page - per_page,
              pages * per_page - per_page + per_page
            )
      );
    }
    setCurrent_page(pages);
  };

  const AllUser = async () => {
    setLoading(true);

    try {
      const User = await getAllLiveUser();
      if (User) {
        const { status, message, data, totalUser, totalSchool } = User;
        if (status === 1) {
          setAllUser(data);
          setAllUserS(data);
          setPagination(data ? Math.ceil(data?.length / per_page) : 1);
          setAllUserL(() => data?.slice(Current_page - 1, per_page));
          setTotalUser(totalUser);
          setTotalSchool(totalSchool);
          setLoading(false);
        } else {
          toast.error(message);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    AllUser();
    document.title = " Skoolfame | Dashboard";
  }, []);

  // for searching users

  useEffect(() => {
    const searching = (e) => {
      setCurrent_page(1);
      // setFors(true)
      if (searchData.length) {
        setAllUserL(
          allUserS
            .filter((user) =>
              `${user.user?.first_name + " " + user?.user?.last_name}`
                .toLowerCase()
                .includes(searchData)
            )
            .slice(0, per_page)
        );
        setPagination(
          allUserL
            ? Math.ceil(
                allUserS.filter((user) =>
                  `${user.user?.first_name + " " + user?.user?.last_name}`
                    .toLowerCase()
                    .includes(searchData)
                )?.length / per_page
              )
            : 1
        );
      } else {
        setAllUserL(allUser?.slice(Current_page - 1, per_page));
        setPagination(allUser ? Math.ceil(allUser?.length / per_page) : 1);
      }
    };
    searching();
  }, [searchData]);
  // arr.filter((a)=>new RegExp(st,"i").test(a))
  return (
    <Layout>
      <div className="home-main">
        <div className="dashboard-header">
          <p className="user-heading">Welcome back, {`${user.first_name} ${user.last_name}`}</p>
          <p className="user-text">
            Track, manage and forecast your schools and users
          </p>
        </div>
        <div className="cards-wrap">
          <Row>
            <Col lg={4} md={4} sm={6}>
              <div className="category-box d-flex justify-content-between">
                <h5 className="card-title">Total Users</h5>
                <p className="card-count">{totalUser}</p>
              </div>
            </Col>

            <Col lg={4} md={4} sm={6}>
              <div className="category-box d-flex justify-content-between">
                <h5 className="card-title">Schools</h5>
                <p className="card-count">{totalSchool}</p>
              </div>
            </Col>
            <Col lg={4} md={4} sm={6}>
              <div className="category-box d-flex justify-content-between">
                <h5 className="card-title">Live Users</h5>
                <p className="card-count">{allUser?.length}</p>
              </div>
            </Col>
          </Row>
        </div>
        <div className="users-wrap d-flex align-items-center justify-content-between">
          <p className="user-heading">Live Users</p>
          <div class="form-group has-search">
            <span class="form-control-feedback">
              <SearchIcon />
            </span>
            <input
              className="form-control"
              type="text"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              placeholder="Search"
            />
          </div>
        </div>
        <div className="custom-data-table">
          <Table responsive className="mb-0 px-4 pb-2">
            <thead>
              <tr>
                <th className="table-heading" width="60%">
                  Name
                </th>
                <th className="table-heading" width="20%">
                  Time
                </th>
                <th className="table-heading" width="20%">
                  Views
                </th>
              </tr>
            </thead>

            <tbody>
              {
              !loading &&
                allUserL.length !== 0 &&
                allUserL?.map((u, i) => {
                  return (
                    <tr key={i} className={i%2==0?'even-row':'odd-row'}>
                      <td className="table-data" width="60%">
                      <div className="d-flex align-items-center">
                      <Avatar
                          alt="user profile"
                          src={
                            u.user?.user_profile_image
                              ? `${pf}/${u.user?.user_profile_image}`
                              : "../images/user.png"
                          }
                          sx={{ width: 32, height: 32 }}
                        />
                        <div className="ms-2">
                          <p className="user-name">
                          {`${
                            u.user?.first_name + " " + u.user?.last_name
                          }`}
                          </p>
                          <p className="user-email">{u.user?.email}</p>
                        </div>
                        </div>   
                      </td>
                      <td className="table-data" width="20%">
                      {moment(u?.user?.live_time).format("LT")}
                        </td>
                        <td className="table-data" width="20%">
                        {u?.join_user?.length ? u?.join_user?.length : 0}
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
        ) : allUserL?.length === 0 ? (
          <h1 className="lod">No-one live</h1>
        ) : null}
        <div className="d-flex justify-content-end mt-4 w-100">
          <Pagination_new
            AllUser={AllFriends}
            pagination={pagination}
            current_page={Current_page}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
