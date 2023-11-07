import React, {  useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Layout from "../../../Layout";
import Avatar from "@mui/material/Avatar";
import { useParams } from "react-router-dom";
import moment from "moment";
import localization from "moment/locale/en-in";
import Pagination_new from "../../Pagination_new";
import { schoolNominees } from "../../../controller/api";
import LoadingSpinner from "../../LoadingSpinner/LoaderSpinner";
import { SearchIcon, SortingIcon } from "../../../Icons";

const Nominees = () => {
  const [searchData, setSearchData] = useState("");
  const [schools, setSchools] = useState([]);
  const [schoolss, setSchoolss] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [Current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [Pagination, setPagination] = useState(1);
  const { id } = useParams();

  const per_page = 3;
  const pf = process.env.REACT_APP_PUBLIC_URL;
  moment.updateLocale("en-in", localization);

  //METHOD

  const AllNomi = (pages) => {
    if (pages === 1) {
      setNominees(
        searchData
          ? schoolss
              .filter((user) =>
                `${user.users?.first_name + " " + user?.users?.last_name}`
                  .toLowerCase()
                  .includes(searchData)
              )
              .slice(pages - 1, per_page)
          : schools.slice(pages - 1, per_page)
      );
    } else {
      setNominees(
        searchData
          ? schoolss
              .filter((user) =>
                `${user.users?.first_name + " " + user?.users?.last_name}`
                  .toLowerCase()
                  .includes(searchData)
              )
              .slice(pages * per_page - per_page, pages * per_page)
          : schools.slice(pages * per_page - per_page, pages * per_page)
      );
    }
    setCurrent_page(pages);
  };

  const rever = () => {
    if (nominees.length > 1) {
      setNominees([...nominees].reverse());
    }
  };

  //for serching

  useEffect(() => {
    const searching = (e) => {
      setCurrent_page(1);
      // setFors(true)
      if (searchData.length) {
        setNominees(
          schoolss
            .filter((user) =>
              `${user.users?.first_name + " " + user?.users?.last_name}`
                .toLowerCase()
                .includes(searchData)
            )
            .slice(0, per_page)
        );

        setPagination(
          nominees
            ? Math.ceil(
                schoolss.filter((user) =>
                  `${user.users?.first_name + " " + user?.users?.last_name}`
                    .toLowerCase()
                    .includes(searchData)
                )?.length / per_page
              )
            : 1
        );
      } else {
        setNominees(schools?.slice(Current_page - 1, per_page));
        setPagination(schools ? Math.ceil(schools?.length / per_page) : 1);
      }
    };
    searching();
  }, [searchData]);

  // frist time loading page

  useEffect(() => {
    const getSingleUser = async () => {
      try {
        const nome = await schoolNominees(id);
        const { status, message, data } = nome;
        if (status === 1) {
          setSchools(data);
          setSchoolss(data);
          setPagination(data ? Math.ceil(data?.length / per_page) : 1);
          setNominees(data?.slice(Current_page - 1, per_page));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getSingleUser();
    document.title = "Skoolfame | Nominees";
  }, []);

  return (
    <Layout>
      <div className="home-main">
        <div className="user-data w-100">
          <div className="school-main-heading d-flex justify-content-between align-items-center">
            Nominees
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
                  <th className="table-heading" width="35%">
                    Name
                  </th>
                  <th className="table-heading" width="25%">
                    Email Address
                  </th>
                  <th className="table-heading" width="20%">
                    Superlatives
                  </th>
                  <th className="table-heading" width="20%">
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
                  nominees.length !== 0 &&
                  nominees?.map((user, i) => {
                    return (
                      <tr
                        key={i}
                        className={i % 2 == 0 ? "even-row" : "odd-row"}
                      >
                        <td className="table-data" width="40%">
                          <div className="delete-group d-flex align-items-center gap-2 text-decoration-none">
                            <Avatar
                              src={
                                user.users?.user_profile_image
                                  ? `${pf}/${user.users?.user_profile_image}`
                                  : "../images/user.png"
                              }
                              alt="user profile"
                              sx={{ width: 32, height: 32 }}
                            />
                            <div>
                              <p className="user-name">
                                {`${
                                  user.users?.first_name +
                                  " " +
                                  user?.users?.last_name
                                }`}
                              </p>
                              <p className="user-email">{user.users?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-data" width="25%">
                          {user.users?.email}
                        </td>
                        <td className="table-data" width="20%">
                          {user.superlatives?.category_name}
                        </td>

                        <td className="table-data" width="20%">
                          {moment(user?.createdAt).format("L")}
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
          ) : nominees.length === 0 ? (
            <h1 className="lod">No data available of nominee</h1>
          ) : null}
          <div className="d-flex justify-content-end mt-4">
            <Pagination_new
              AllUser={AllNomi}
              pagination={Pagination}
              current_page={Current_page}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Nominees;
