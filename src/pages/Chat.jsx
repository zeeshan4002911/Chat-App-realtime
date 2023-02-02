import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState, useRef } from "react";
import { writeMessageData } from "../firebase/IO";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/config";
import { auth } from "../firebase/config";
import { IconButton, Box, styled, Avatar, Typography, OutlinedInput, Button } from "@mui/material";
import { Send } from "@mui/icons-material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { toast } from "react-toastify";
import PopUp from "../components/PopUp";
import ChatCard from "../components/ChatCard";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';


const Chat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const messagesEndRef = useRef(null);
    const data = location?.state?.friend_data;
    const user_uid = window.localStorage.getItem("chat_uid");
    const [fetchedMessages, setFetchedMessages] = useState([]);
    const [mediaURL, setMediaURL] = useState("");
    const [mediaType, setMediaType] = useState("");


    useEffect(() => {
        window.onresize = () => {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.innerWidth;
            if (width >= 500) window.location.reload();
        }
    }, [navigate]);

    useEffect(() => {
        const friend_uid = data?.uid;
        const db = database;
        const room_id = (user_uid > friend_uid) ? `${user_uid}&${friend_uid}` : `${friend_uid}&${user_uid}`;
        const room_ref = ref(db, 'rooms/' + room_id);
        return onValue(room_ref, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (!data) return;
                setFetchedMessages(data);
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        });
    }, [data?.uid, user_uid]);


    const handleMessageSent = async () => {
        const message_input = document.getElementById("typing").value;
        if (!message_input && mediaURL === "") return;
        document.getElementById("typing").value = "";
        if (auth.currentUser?.uid && data.uid) {
            const current_time = new Date().toLocaleString();
            const message = {
                sender_id: auth.currentUser.uid,
                sender_name: auth.currentUser.displayName,
                sender_email: auth.currentUser.email,
                content: message_input,
                time: current_time,
                media_url: mediaURL,
                media_type: mediaType
            }
            setMediaURL("");
            setMediaType("");
            const response = await writeMessageData(auth.currentUser.uid, data.uid, message);
            if (response !== "success") {
                toast.error(`Unable to send message ${response}`);
            }
        } else {
            toast.error("Unable to Authenticate")
        }
    }

    const myWidget = window.cloudinary.createUploadWidget(
        {
            cloudName: process.env.REACT_APP_cloudName,
            uploadPreset: "cyteebxa",
            folder: "Chat_App",
            maxImageFileSize: 10000000,
            multiple: false
        },
        (error, result) => {
            if (!error && result && result.event === "success") {
                setMediaURL(result.info.secure_url);
                setMediaType(result.info.resource_type);
            }
        }
    );

    const handleImageSent = () => {
        myWidget.open();
    }

    return (
        <div id="chat">
            <PopUp />
            {
                location?.state?.friend_data && <>
                    <Header>
                        <IconButton className="click" variant="contained" size="small" onClick={() => navigate("/home")}>
                            <ArrowBackIosRoundedIcon />
                        </IconButton>
                        <Avatar alt={data?.name} src={data?.profile_picture} referrerPolicy="no-referrer" />
                        <Typography>{data?.name || "Unknown"} </Typography>
                    </Header>
                    <Main>
                        {
                            fetchedMessages.map((msg_obj) => (
                                <ChatCard key={msg_obj.time} data={msg_obj} user_uid={user_uid} />
                            ))
                        }
                        <ExpandCircleDownIcon fontSize="large" style={{ color: "white", position: "sticky", bottom: "5%", left: "2%", zIndex: 2 }} 
                        onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })} />
                        <div ref={messagesEndRef} style={{ float: "left", clear: "both" }}> </div>
                    </Main>
                    <Footer>
                        <Button onClick={handleImageSent}><AddCircleRoundedIcon style={{ color: "#fff" }} fontSize="large" /></Button>
                        <OutlinedInput name="typing" type="text" id="typing" placeholder="Message" />
                        <Button onClick={handleMessageSent} ><Send style={{ color: "#fff" }} fontSize="large" /></Button>
                    </Footer>
                </>
            }
        </div>
    )
}

export default Chat;

const Header = styled(Box)`
    display: flex;
    align-items: center;
    border-bottom: 1px solid black;
    padding: 1rem 0;
    gap: 0.5rem;
    width: 100%;
`;

const Footer = styled(Box)`
    padding: .5rem;
    padding-bottom: 5%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 10fr 1fr;
    gap: 0.5rem;
    & > div {
        border-radius: 25px;
    };
    & > button {
        border-radius: 50px;
    }
`;

const Main = styled(Box)`
    padding: 0.5rem 1rem;
    height: 75%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    position: relative;
`