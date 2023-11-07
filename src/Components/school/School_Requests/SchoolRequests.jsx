import React, { useEffect, useState } from "react";
import {Table } from "react-bootstrap";
import "../schools/document.css";
import moment from "moment";
import { toast } from "react-toastify";
import Pagination_new from "../../Pagination_new";
import { getAllSchoolsRequest } from "../../../controller/api";
import localization from "moment/locale/en-in";
import LoadingSpinner from "../../LoadingSpinner/LoaderSpinner";
import axios from "axios";

const School_Requests = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [requestSchools, setRequestSchools] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [length, setLength] = useState(allSchools ? allSchools.length : []);
  const [current_page, setCurrent_page] = useState(1);
  const [loading, setLoading] = useState(true);
  const per_page = 5;
  const [Pagination, setPagination] = useState(1);
  moment.updateLocale("en-in", localization);

  // METHODS

  const AllSchoolRequests = async () => {
    try {
      const SchoolData = await getAllSchoolsRequest();
      const { status, message, data } = SchoolData;
      if (status === 1) {
        setLoading(false);
        setRequestSchools(data);
        setAllSchools(data?.slice(current_page - 1, per_page));
        setPagination(data?.length ? Math.ceil(data?.length / per_page) : 1);
      } else {
        toast.error(message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const AllFriends = async (pages) => {
    if (pages === 1) {
      setAllSchools(requestSchools?.slice(pages - 1, per_page));
    } else {
      setAllSchools(
        requestSchools?.slice(
          pages * per_page - per_page,
          pages * per_page - per_page + per_page
        )
      );
    }
    setCurrent_page(pages);
  };

  const handelDelete = async (id, name) => {
    let check = window.confirm(
      "are you sure you want to delete " + name + " school ?"
    );
    if (check) {
      try {
        const { data } = await axios.delete(`/delete-school?id=${id}`);
        if (data.status == 1) {
          toast.success(data.message);
          setCurrent_page(1);
          setLength(length - 1);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handelAccept = async (id, name) => {
    let check = window.confirm(
      "are you sure you want to update " + name + " ?"
    );
    if (check) {
      try {
        const { data } = await axios.patch(`/update-school-request?id=${id}`);
        if (data.status == 1) {
          toast.success(data.message);
          setCurrent_page(1);
          setLength(length - 1);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    AllSchoolRequests();
    document.title = " Skoolfame | School Requests";
  }, [length]);

  return (
        <>
          <div className="custom-data-table w-100">
            <Table responsive className="mb-0 px-4 pb-2">
              <thead>
                <tr>
                  {/* <th className="table-heading" width="30%">
                    Requester Name
                  </th> */}
                  <th className="table-heading" width="40%">
                    School Name
                  </th>
                  <th className="table-heading" width="60%">
                    School Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  allSchools?.length !== 0 &&
                  allSchools?.map((school, i) => {
                    const {
                      _id,
                      school_profile_image,
                      name,
                      address,
                      createdAt,
                      users,
                    } = school;
                    return (
                      <tr
                        key={_id}
                        className={i % 2 == 0 ? "even-row" : "odd-row"}
                      >
                        {/* <td className="table-data" width="30%">
                          {name}
                        </td> */}
                        <td className="table-data" width="40%">
                          {name}
                        </td>
                        <td className="table-data" width="45%">
                          {address}
                        </td>
                        <td className="table-data" width="15%">
                          <span className="delete-group d-flex align-items-center justify-content-start gap-3">
                            <div
                              className="request-p"
                              onClick={() => handelDelete(_id, name)}
                            >
                              Decline
                            </div>
                            <div
                              className="request-p"
                              style={{ color: "#0085FF" }}
                              onClick={() => handelAccept(_id, name)}
                            >
                              Accept
                            </div>
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
          ) : allSchools.length == 0 ? (
            <h1 className="lod">No Schools Request</h1>
          ) : null}
          <div className="d-flex justify-content-end mt-4">
            {allSchools?.length !== 0 ? (
              <Pagination_new
                AllUser={AllFriends}
                pagination={Pagination}
                current_page={current_page}
              />
            ) : null}
          </div>
        </>

      // <Modal show={show} onHide={handleClose} centered>
      //   <Modal.Body>
      //     <div className="modal-title text-center position-relative">
      //       <h2>Create Document Category</h2>
      //       <Button className="modal-close-btn" onClick={() => handleClose()}>
      //         <GrFormClose />
      //       </Button>
      //     </div>
      //     <div className="modal-form my-4">
      //       <div className="input-field">
      //         <label>Disease Name</label>
      //         <input type="text" />
      //       </div>
      //     </div>
      //     <div className="modal-btn-group d-flex align-items-center justify-content-end gap-3">
      //       <Button className="cancel" onClick={() => handleClose()}>
      //         Cancel
      //       </Button>
      //       <Button className="ok">OK</Button>
      //     </div>
      //   </Modal.Body>
      // </Modal>
  );
};

export default School_Requests;
