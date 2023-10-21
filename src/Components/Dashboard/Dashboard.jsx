import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Row, Table, Pagination } from "react-bootstrap";
import { getAllLiveUser } from "../../controller/api";
import Layout from "../../Layout";
import LoadingSpinner from "../LoadingSpinner/LoaderSpinner";
import Pagination_new from "../Pagination_new";
import "./dashboard.css";
import moment from "moment";
import localization from 'moment/locale/en-in';
import { toast } from "react-toastify";

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
  moment.updateLocale('en-in', localization);

  //METHOD

  const AllFriends = (pages) => {

    if (pages === 1) {
      setAllUserL(searchData ? allUserS.filter((user) => `${user.user?.first_name + " " + user?.user?.last_name}`.toLowerCase().includes(searchData)).slice(pages - 1, per_page) : allUser.slice(pages - 1, per_page));
    } else {
      setAllUserL(searchData ? allUserS.filter((user) => `${user.user?.first_name + " " + user?.user?.last_name}`.toLowerCase().includes(searchData)).slice(pages * per_page - per_page, pages * per_page - per_page + per_page) : allUser?.slice(pages * per_page - per_page, pages * per_page - per_page + per_page));
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
          setPagination(data ? Math.ceil(data?.length / per_page) : 1)
          setAllUserL(() => data?.slice(Current_page - 1, per_page));
          setTotalUser(totalUser)
          setTotalSchool(totalSchool)
          setLoading(false);
        } else {
          toast.error(message);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };


  useEffect(() => {
    AllUser();
    document.title = " Skoolfame | Dashboard"
  }, []);

  // for searching users

  useEffect(() => {
    const searching = (e) => {
      setCurrent_page(1);
      // setFors(true)
      if (searchData.length) {

        setAllUserL(allUserS.filter((user) => `${user.user?.first_name + " " + user?.user?.last_name}`.toLowerCase().includes(searchData)).slice(0, per_page));
        setPagination(allUserL ? Math.ceil(allUserS.filter((user) => `${user.user?.first_name + " " + user?.user?.last_name}`.toLowerCase().includes(searchData))?.length / per_page) : 1)

      } else {
        setAllUserL(allUser?.slice(Current_page - 1, per_page));
        setPagination(allUser ? Math.ceil(allUser?.length / per_page) : 1)
      }
    }
    searching()
  }, [searchData]);
  // arr.filter((a)=>new RegExp(st,"i").test(a))
  return (
    <Layout>
      <div className="home-main py-4 px-5">
        <Row>
          <Col lg={4} md={4} sm={6} className="mt-3">
            <div className="category-box d-flex justify-content-between">
              <div className="category-title">
                <h5>Users</h5>
                <p>{totalUser}</p>
              </div>

            </div>
          </Col>

          <Col lg={4} md={4} sm={6} className="mt-3">
            <div className="category-box d-flex justify-content-between">
              <div className="category-title">
                <h5>Schools</h5>
                <p>{totalSchool}</p>
              </div>

            </div>
          </Col>
          <Col lg={4} md={4} sm={6} className="mt-3">
            <div className="category-box d-flex justify-content-between">
              <div className="category-title">
                <h5>Live Users</h5>
                <p>{allUser?.length}</p>
              </div>

            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col xl={8} lg={12}>
            <div className="user-data">
              <div className="user-data-header d-flex align-items-center justify-content-between">
                <h1>Live Users</h1>
                <input type="text" value={searchData} onChange={(e) => setSearchData(e.target.value)} placeholder="Search Name" />
              </div>
              <div className="user-data-table mt-4">
                <Table responsive className="mb-0 px-4 pb-2">
                  <thead>
                    <tr>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">Users</span>
                      </th>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">
                          Time
                        </span>
                      </th>
                      <th className="p-0">
                        <span className="d-block py-3 px-5">
                          Views
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {!loading && allUserL.length !== 0 && allUserL?.map((u, i) => {
                      return (
                        <tr key={i}>
                          <td className="bg-orange">
                            <div className="delete-group d-flex align-items-center gap-3">
                              <img src={u.user?.user_profile_image ? `${pf}/${u.user?.user_profile_image}` : "../images/user.png"} alt="" className="imgs" />
                              <span className="d-block text-ellipse" >{`${u.user?.first_name + " " + u.user?.last_name}`}</span>
                            </div>
                          </td>
                          <td className="bg-orange">
                            <span className="d-block py-3 px-5">{moment(u?.user?.live_time).format('LT')}</span>
                          </td>
                          <td className="bg-orange">
                            <span className="d-block py-3 px-5">{u?.join_user?.length ? u?.join_user?.length : 0}</span>
                          </td>
                        </tr>
                      )
                    })}


                  </tbody>
                </Table>
              </div>
              {loading ? <h1 className="lod"><LoadingSpinner /></h1> : allUserL?.length === 0 ? <h1 className="lod">No-one live</h1> : null}
              <div className="d-flex justify-content-end mt-4">
                <Pagination_new
                  AllUser={AllFriends}
                  pagination={pagination}
                  current_page={Current_page}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Dashboard;
