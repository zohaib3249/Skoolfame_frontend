import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, NavLink, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../../Layout';
import { useParams } from "react-router-dom";
import moment from "moment";
import localization from "moment/locale/en-in";
import Pagination_new from "../../Pagination_new";
import { schoolNominees } from "../../../controller/api";
import LoadingSpinner from "../../LoadingSpinner/LoaderSpinner";

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
            setNominees(searchData ? schoolss.filter((user) => `${user.users?.first_name + " " + user?.users?.last_name}`.toLowerCase().includes(searchData)).slice(pages - 1, per_page) : schools.slice(pages - 1, per_page));
        } else {
            setNominees(searchData ? schoolss.filter((user) => `${user.users?.first_name + " " + user?.users?.last_name}`.toLowerCase().includes(searchData)).slice(pages * per_page - per_page, pages * per_page) : schools.slice(pages * per_page - per_page, pages * per_page));
        }
        setCurrent_page(pages);
    };


    const rever = () => {
        if (nominees.length > 1) {
            setNominees([...nominees].reverse())
        }
    };


    //for serching

    useEffect(() => {
        const searching = (e) => {
            setCurrent_page(1);
            // setFors(true)
            if (searchData.length) {

                setNominees(schoolss.filter((user) => `${user.users?.first_name + " " + user?.users?.last_name}`.toLowerCase().includes(searchData)).slice(0, per_page));

                setPagination(nominees ? Math.ceil(schoolss.filter((user) => `${user.users?.first_name + " " + user?.users?.last_name}`.toLowerCase().includes(searchData))?.length / per_page) : 1)

            } else {
                setNominees(schools?.slice(Current_page - 1, per_page));
                setPagination(schools ? Math.ceil(schools?.length / per_page) : 1)
            }
        }
        searching()
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
            <div className="user-main py-4 px-5">
                <Row>
                    <Col lg={12}>
                        <div className="user-data">
                            <div className="user-data-header d-flex align-items-center justify-content-between">
                                <h1>Nominees</h1>
                                <input placeholder="Search name" type="text" value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                            </div>
                            <div className="user-data-table mt-4">
                                <Table responsive className="mb-0 px-4 pb-2">
                                    <thead>
                                        <tr>
                                            <th className="p-0">
                                                <span className="d-block py-3 px-5">Name</span>
                                            </th>
                                            <th className="p-0">
                                                <span className="d-block py-3 px-5">Superlatives</span>
                                            </th>
                                            <th className="p-0">
                                                <span className="d-block py-3 px-5">Email</span>
                                            </th>
                                            <th className="p-0">
                                                <span className="d-flex py-3 px-5">
                                                    Created At
                                                    <Button className="bg-transparent border-0 shadow-none p-0" onClick={rever} >
                                                        <img src="../images/sorting-new.png" alt="" />
                                                    </Button>
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loading && nominees.length !== 0 && nominees?.map((user, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="bg-orange">
                                                        <div className="delete-group ">
                                                            <div to='' className="d-flex align-items-center gap-3 p-0 text-decoration-none cursor-none" >
                                                                <img
                                                                    className="round_img"
                                                                    src={user.users?.user_profile_image ? `${pf}/${user.users?.user_profile_image}` : "../images/user.png"}
                                                                    alt="user profile"
                                                                />
                                                                <span className="d-block text-ellipse">{`${user.users?.first_name + " " + user?.users?.last_name}`}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="bg-orange">
                                                        <div to='' className="d-flex align-items-center gap-3 px-5 text-decoration-none">
                                                            <span className='trophy'>
                                                                <img src="../images/trophy.svg"
                                                                    alt=""
                                                                />
                                                            </span>
                                                            <span className="d-block">{user.superlatives?.category_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="bg-orange">
                                                        <span className="d-block cp px-5 text-ellipse">{user.users?.email}</span>
                                                    </td>
                                                    <td className="bg-orange">
                                                        <span className="d-block cp px-5">
                                                            {moment(user?.createdAt).format('L')}
                                                        </span>
                                                    </td>

                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </Table>
                            </div>
                            {loading ? <h1 className="lod"><LoadingSpinner /></h1> : nominees.length === 0 ? <h1 className="lod">No data available of nominee</h1> : null}
                            <div className="d-flex justify-content-end mt-4">
                                <Pagination_new
                                    AllUser={AllNomi}
                                    pagination={Pagination}
                                    current_page={Current_page}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export default Nominees