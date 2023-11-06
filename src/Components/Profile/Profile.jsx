import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Auth } from "../../App";
import Layout from "../../Layout";
import "./profile.css";

const Profile = () => {
  const { user, setUserName, userName } = useContext(Auth);

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    conformPassword: "",
  });

  const [name, setName] = useState({
    first_name: userName?.first_name,
    last_name: userName?.last_name,
    email: userName?.email,
  });

  const pass = (e) => {
    e.preventDefault();
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const changeName = (e) => {
    e.preventDefault();
    setName({ ...name, [e.target.name]: e.target.value });
  };

  const changePass = async (e) => {
    e.preventDefault();

    if (password.newPassword.trim().length === 0) {
      toast.error("please enter password");
      return;
    }
    if (password.conformPassword.trim().length === 0) {
      toast.error("Please enter confirm password");
      return;
    }
    if (password.newPassword === password.conformPassword) {
      try {
        const res = await axios.patch(`/update-profile?id=${user?._id}`, {
          new_password: password.newPassword,
          old_password: password.oldPassword,
        });

        if (res.data.status === 1) {
          setPassword({
            oldPassword: "",
            newPassword: "",
            conformPassword: "",
          });
          toast.success(res.data.message);
        } else if (res.data.status === 0) {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Does not match confirm password");
    }
  };

  const updateName = async (e) => {
    e.preventDefault();
    if (
      name.first_name.trim().length === 0 ||
      name.last_name.trim().length === 0 ||
      name.email.trim().length === 0
    ) {
      toast.error("Please enter empty fields");
      return;
    }
    try {
      const res = await axios.patch(`/update-profile?id=${user?._id}`, {
        first_name: name.first_name.trim(),
        last_name: name.last_name.trim(),
        email: name.email.trim(),
      });
      if (res.data.status === 1) {
        setUserName(name);
        localStorage.setItem("username", JSON.stringify(name));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Skoolfame | Profile";
  }, []);

  return (
    <Layout>
      <div className="home-main" style={{ padding: "32px" }}>
        <div className="profile-main-heading">Profile</div>
        <p className="edit-profile-text mt-3">Edit Profile</p>
        <div className="w-100">
          <Row className="form-wrap">
            <Col lg={8} md={8} sm={12}>
              <Form>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="custom-input" style={{ width: "48%" }}>
                    <Form.Group controlId="name">
                      <Form.Label className="title-lable">
                        First Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={"Enter your first name"}
                        value={name.first_name}
                        name="first_name"
                        onChange={(e) => changeName(e)}
                      />
                    </Form.Group>
                  </div>
                  <div className="custom-input" style={{ width: "48%" }}>
                    <Form.Group controlId="name">
                      <Form.Label className="title-lable">Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={"Enter your last name"}
                        value={name.last_name}
                        name="last_name"
                        onChange={(e) => changeName(e)}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="custom-input">
                  <Form.Group controlId="name">
                    <Form.Label className="title-lable">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={"Enter your email"}
                      value={name.email}
                      name="email"
                      onChange={(e) => changeName(e)}
                    />
                  </Form.Group>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                  <button variant="primary" className="custom-cancel-btn me-3">
                    Cancel
                  </button>
                  <button
                    variant="primary"
                    className="custom-btn"
                    type="submit"
                    onClick={updateName}
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>

        <div className="mt-1 profile-main w-100">
          <p className="edit-profile-text mt-3">Change Password</p>
          <div className="w-100">
            <Row className="form-wrap">
              <Col lg={8} md={8} sm={12}>
                <Form>
                  <div className="custom-input">
                    <Form.Group controlId="name">
                      <Form.Label className="title-lable">
                        Current Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Current password"
                        value={password.oldPassword}
                        name="oldPassword"
                        onChange={(e) => pass(e)}
                      />
                    </Form.Group>
                  </div>
                  <div className="custom-input">
                    <Form.Group controlId="name">
                      <Form.Label className="title-lable">
                        New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="New password"
                        value={password.newPassword}
                        name="newPassword"
                        onChange={(e) => pass(e)}
                      />
                    </Form.Group>
                  </div>
                  <div className="custom-input">
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label className="title-lable">
                        Confirm New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={password.conformPassword}
                        name="conformPassword"
                        onChange={(e) => pass(e)}
                      />
                    </Form.Group>
                  </div>
                  <div className="d-flex align-items-center justify-content-end">
                    <button
                      variant="primary"
                      className="custom-cancel-btn me-3"
                    >
                      Cancel
                    </button>
                    <button
                      variant="primary"
                      className="custom-btn"
                      type="submit"
                      onClick={changePass}
                    >
                      Save Changes
                    </button>
                  </div>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
