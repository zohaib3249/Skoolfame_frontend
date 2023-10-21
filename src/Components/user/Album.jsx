import React, { useEffect } from "react";
import { Col, Row, Form } from "react-bootstrap";

const Album = ({ albums, con }) => {
  const pf = process.env.REACT_APP_PUBLIC_URL;
  // const pf = "http://192.168.40.29:3000";
  useEffect(() => { document.title = "Skoolfame | Albums" }, [])
  return (
    <div className="p-4 overflow-modal">
      <div className="user_details p-4">
        <Row>
          <Col lg={12}>
            <div className="user-data user-data-frame2">
              <div className="user-data-table mt-2 bg-white border-0">
                <div className="d-flex justify-content-center flex-wrap profile-gap width-div">
                  {/* video */}
                  {con === "video" ? (
                    albums?.length !== 0 ? (
                      albums?.map((v, i) => {
                        return (
                          <>
                            <div className="img-div rounded-0" key={i}>
                              <video width="320" height="240" controls className="img-fluid h-100" >
                                <source src={v?.path ? `${pf}/${v?.path}` : "../images/user.png"} type="video/mp4" />
                                <source src={v?.path ? `${pf}/${v?.path}` : "../images/user.png"} type="video/avi" />
                                Your browser does not support the video element.
                              </video>
                            </div>
                          </>
                        );
                      })
                    ) : (
                      <div className="img-div w-100 text-center">
                        <h1>No added videos</h1>
                      </div>
                    )
                  ) : albums?.length !== 0 ? (
                    albums?.map((v, i) => {
                      return (
                        <div className="img-div" key={i}>
                          <img
                            src={
                              v?.path
                                ? `${pf}/${v?.path}`
                                : "../images/user.png"
                            }
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="img-div w-100 text-center">
                      <h1>No added images </h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Album;
