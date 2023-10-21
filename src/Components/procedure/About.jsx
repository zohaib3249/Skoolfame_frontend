import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { updateAbout } from "../../controller/api";
import Layout from "../../Layout";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import "./procedure.css";

const Procedure = () => {
  const [about, setAbout] = useState("");

  const handle = async () => {
    if (about.trim().length == 0) {
      toast.error("You can not update empty content");
      setAbout("");
      return
    }
    try {
      const aboutRes = await updateAbout(about);
      const { status, message } = aboutRes;
      if (status === 1) {
        toast.success(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { document.title = "Skoolfame | About" }, []);

  return (
    <Layout>
      <div className="procedure-main py-4 px-5">
        <Row>
          <Col lg={12}>
            <div className="user-data">
              <div className="user-data-header d-flex align-items-center justify-content-between">
                <h1>About</h1>
                <div className="delete-group d-flex align-items-center justify-content-end">
                  <Button onClick={handle}>Update</Button>
                </div>
              </div>
              <div className="user-data-table mt-4">
                <TextareaAutosize className="bg-transparent border-0 area " aria-label="empty textarea" placeholder='write anything for your app'
                  onChange={(e) => setAbout(e.target.value)}
                  value={about}
                  style={{ width: "100%", minHeight: 300, border: "none", padding: "20px" }}
                />
              </div>

            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Procedure;
