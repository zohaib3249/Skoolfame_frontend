import React, { useEffect, useRef, useState } from 'react'
import "./chat.css";
import Layout from '../../Layout'
import { Col, Row, } from "react-bootstrap";
import { IoArrowBackOutline, IoReturnUpBack } from 'react-icons/io5'
import { getAllUser, getChatById, getChatuser } from '../../controller/api';
import { useParams } from 'react-router-dom';
import moment from "moment";
import localization from 'moment/locale/en-in';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import VideocamIcon from '@mui/icons-material/Videocam';

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [susers, setSUsers] = useState([]);
    const [chats, setChats] = useState(null);
    const [name, setName] = useState(null);
    const [searchData, setSearchData] = useState("");
    const ref = useRef();
    const sref = useRef(null);
    const dates = new Set();

    const pf = process.env.REACT_APP_PUBLIC_URL;
    //  const pf = "http://192.168.40.29:3000"
    const { id } = useParams();
    moment.updateLocale('en-in', localization);

    const getUser = async () => {
        try {
            const user = await getChatuser(id);
            const { status, data } = user;
            if (status == 1) {
                setUsers(data.sort(function (a, b) { return new Date(b.lastmessage.createdAt).getTime() - new Date(a.lastmessage.createdAt).getTime() }))
                setSUsers(data.sort(function (a, b) { return new Date(b.lastmessage.createdAt).getTime() - new Date(a.lastmessage.createdAt).getTime() }))
            }
        } catch (error) {

        }
    }
    const renderDate = (v) => {
        dates.add(v)
        return (<><div className='timebox-chat'><span className='timebox-span'>{v}</span></div></>)
    };

    const getChat = async (rid, name) => {
        try {
            setName(name)
            // setLoading(true)
            const user = await getChatById(id, rid);

            const { status, data } = user;

            if (status == 1) {
                setChats(data.reverse())
                // setLod(true)
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        console.log("first")

        sref.current?.scrollIntoView({ behavior: "smooth" })


        // ref.current.offsetTop === ref.current.offsetHeight;

        // ref.current.scrollTo({top:ref.current.offsetHeight ,
        //     behavior: 'auto'})


        const re = setTimeout(() => {
            // sref.current?.scrollIntoView({ behavior: "auto" })
            ref.current.scrollTop = ref.current.scrollHeight;
        }, 100);

        return () => {
            clearTimeout(re)
        }
    }, [chats]);




    useEffect(() => {
        getUser()
        document.title = "Skoolfame | Chat"
    }, []);



    useEffect(() => {
        searchData ? setUsers(susers.filter((a) => new RegExp(searchData, "i").test(a?.user_name)).sort(function (a, b) { return new Date(b?.lastmessage?.createdAt).getTime() - new Date(a.lastmessage.createdAt).getTime() })) : setUsers(susers)
    }, [searchData]);




    return (

        <Layout>
            <div className="user-main py-4 px-4">
                <div className='main-chat'>
                    <Row>
                        <Col xxl={4} xl={5} lg={6} md={6}>
                            <div className='chat-bg px-xl-4 px-2 pt-2 pt-xl-4 pb-2'>
                                <input type="text" className='search' placeholder="Search Name" value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                                <div className='chat-box-scroll'>
                                    {users.length ? users?.map((u, i) => {
                                        const { data_id, user_name, user_image, lastmessage, id: rid } = u
                                        return (
                                            <div className="chat-bar " key={data_id} onClick={() => getChat(rid, user_name)} style={{ cursor: "pointer" }}>
                                                <div className='d-flex align-items-center gap-2 gap-xxl-3 w-100'>
                                                    <img src={
                                                        user_image
                                                            ? `${pf}/${user_image}`
                                                            : "../images/user.png"
                                                    }
                                                        className='chat-img' alt="" />
                                                    <div className='d-flex flex-column w-100 '>
                                                        <div className='d-flex align-items-center w-100 justify-content-between'>
                                                            <h6>{user_name}</h6>
                                                            <span className="time"> {moment(lastmessage?.createdAt).format('L')},{moment(lastmessage?.createdAt).format('LT')}</span>
                                                        </div>
                                                        <div>
                                                            <p>{lastmessage?.message ? lastmessage.message.split("/")[0] == "images" ? <div><InsertPhotoIcon />Photo</div> : lastmessage.message.split("/")[0] == "videos" ? <div><VideocamIcon />Video</div> : lastmessage?.message : null} </p>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>

                                        )
                                    }) : <h1 style={{ textAlign: "center", marginTop: "20px" }}>Not Found!</h1>}





                                </div>
                            </div>
                        </Col>

                        <Col xxl={8} xl={7} lg={6} md={6} className="mt-md-0 mt-5">
                            <div className='chat-window'   >
                                <div className="chat-header">
                                    {/* <button className='backrow shadow-none  border-0'>
                                        <IoArrowBackOutline />
                                    </button> */}
                                    {name && <h6>{name}</h6>}
                                </div>


                                <div className='mt-5 chat-window-scroll' id={!name ? "dd" : ""} ref={ref}>

                                    {chats && chats?.map((c, i) => {
                                        const { sender_user, _id, receiver_user, message, createdAt, message_type } = c;
                                        let date = moment(createdAt).format("DD/MM/YYYY");

                                        if (id === sender_user._id) {
                                            return (
                                                <div key={i}  >
                                                    {dates.has(date) ? null : renderDate(date)}
                                                    <div className="chat-left"  >
                                                        <div className="chat-inner">
                                                            <div className='d-flex gap-3' style={{ width: "100%" }}>

                                                                <img src={
                                                                    sender_user?.user_profile_image
                                                                        ? `${pf}/${sender_user?.user_profile_image}`
                                                                        : "../images/user.png"
                                                                } className='chat-img' alt="" />

                                                                <div style={{ dispaly: "block", width: "82%" }} >
                                                                    <div className='new-h6'>
                                                                        <h6>{sender_user?.first_name + " " + sender_user?.last_name} </h6>
                                                                        <div >
                                                                            <span className="time"> {moment(createdAt).format('LT')}</span>
                                                                        </div>
                                                                    </div >
                                                                    {message_type === "text" ? <p id="breakword">{message}</p>
                                                                        : message_type === "image" ? <img style={{ marginTop: "17px", maxWidth: "100%" }} src={message ? `${pf}/${message}` : "../images/user.png"} />
                                                                            : message_type === "video" ? <video style={{ marginTop: "17px" }} controls src={message ? `${pf}/${message}` : "../images/user.png"}></video>
                                                                                : null
                                                                    }
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>)

                                        } else {
                                            return (
                                                <div key={i} >
                                                    {dates.has(date) ? null : renderDate(date)}
                                                    <div className="chat-right"  >
                                                        <div className="chat-inner">
                                                            <div className='d-flex gap-3' style={{ width: "100%" }}>

                                                                <img src={
                                                                    sender_user?.user_profile_image
                                                                        ? `${pf}/${sender_user?.user_profile_image}`
                                                                        : "../images/user.png"
                                                                } className='chat-img' alt="" />

                                                                <div style={{ dispaly: "block", width: "82%" }} >
                                                                    <div className='new-h6'> <h6>{sender_user?.first_name + " " + sender_user?.last_name} </h6><div >
                                                                        <span className="time"> {moment(createdAt).format('LT')}</span>
                                                                    </div>
                                                                    </div>
                                                                    {message_type === "text" ? <p id="breakword">{message}</p>
                                                                        : message_type === "image" ? <img style={{ marginTop: "17px", maxWidth: "100%" }} src={message ? `${pf}/${message}` : "../images/user.png"} />
                                                                            : message_type === "video" ? <video style={{ marginTop: "17px" }} controls src={message ? `${pf}/${message}` : "../images/user.png"}></video>
                                                                                : null
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>)


                                        }
                                    })

                                    }
                                    <span ref={sref}></span>

                                    {!name && <h1 style={{ textAlign: "center", marginTop: "62px" }}>Please Select User</h1>}


                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Layout>
    )
}

export default Chat