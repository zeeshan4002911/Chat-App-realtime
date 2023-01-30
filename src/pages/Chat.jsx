import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
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


const Chat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location?.state?.friend_data;
    const [fetchedMessages, setFetchedMessages] = useState([]);


    useEffect(() => {
        window.onresize = () => {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.innerWidth;
            if (width >= 500) window.location.reload();
        }
    }, [navigate]);

    useEffect(() => {
        const user_uid = window.localStorage.getItem("chat_uid");
        const friend_uid = data?.uid;
        const db = database;
        const room_id = (user_uid > friend_uid) ? `${user_uid}&${friend_uid}` : `${friend_uid}&${user_uid}`;
        const room_ref = ref(db, 'rooms/' + room_id);
        return onValue(room_ref, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (!data) return;
                setFetchedMessages(data);
            }
        });
    }, [data?.uid]);


    const handleMessageSent = async () => {
        const message_input = document.getElementById("typing").value;
        if (!message_input) return;
        document.getElementById("typing").value = "";
        if (auth.currentUser?.uid && data.uid) {
            const current_time = new Date().toLocaleString();
            const message = {
                sender_id: auth.currentUser.uid,
                sender_name: auth.currentUser.displayName,
                sender_email: auth.currentUser.email,
                content: message_input,
                time: current_time,
            }
            const response = await writeMessageData(auth.currentUser.uid, data.uid, message);
            if (response !== "success") {
                toast.error(`Unable to send message ${response}`);
            }
        } else {
            toast.error("Unable to Authenticate")
        }
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
                    <main>
                        <h1> </h1>
                        {
                            fetchedMessages.map((msg_obj) => (
                                <div key={msg_obj.time}>{msg_obj.content}</div>
                            ))
                        }
                    </main>
                    <Footer>
                        <Button><AddCircleRoundedIcon style={{ color: "#fff" }} fontSize="large" /></Button>
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
    position: absolute;
    top: 0;
    width: 100%;
`;

const Footer = styled(Box)`
    position: absolute;
    bottom: 0;
    padding: .5rem;
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