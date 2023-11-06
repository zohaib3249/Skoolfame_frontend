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
      <div className="home-main">
        <div className="about-main-heading">
          Users
        </div>
          <TextareaAutosize className="about-teaxtarea area " aria-label="empty textarea" placeholder='Enter a description...'
            onChange={(e) => setAbout(e.target.value)}
            value={about}
          />
          <Button className='about-btn' onClick={handle}>Update</Button>
        </div>    
    </Layout>
  );
};

export default Procedure;
