import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Toolbox from "../components/Toolbox";
import { Box, styled, IconButton, TextField, Typography, Container, Button } from "@mui/material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
import { readFriendData, readUserData, writeFriendData } from "../firebase/IO";
import HomeCard from "../components/HomeCard";
import { auth } from "../firebase/config";
import { toast } from 'react-toastify';
import PopUp from "../components/PopUp";


export default function Home() {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [clickedAddFriend, setClickedAddFriend] = useState(false);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        (() => {
            // To Avoid getting auth as null on reload
            auth.onAuthStateChanged(async (user) => {
                if (!user) return;
                window.localStorage.setItem("chat_uid", user.auth.currentUser.uid);
                const users = await readFriendData(user.auth);
                setFriendList(users);
            })
        })();
        if (userList.length === 0 && clickedAddFriend) {

            // Will Only Run Once on clicking the bottom people button
            (async () => {
                const user_data = await readUserData();
                setUserList(user_data);
            })();
        }
    }, [clickedAddFriend, userList])

    useEffect(() => {
        window.onresize = () => {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.innerWidth;
            if (width >= 500) window.location.reload();
        }
    }, [navigate])

    const handleAddFriend = () => {
        const input = document.getElementById("friend-search").value;
        setUserInput("");
        if (!input) return;
        if (!input.match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/)) return toast.info("Not a Valid Email");
        const search_email = input.toLowerCase();
        let match = false;
        let match_user = null;
        userList.forEach(obj => {
            if (obj.value.email === search_email) {
                match = true;
                match_user = obj.value;
                return;
            }
        })
        if (!match) return toast.error(`User with ${search_email} doesn't exists`);
        (async () => {
            // Need to implement logic here for two way handshake friend request/accept feature

            const response = await writeFriendData(auth.currentUser, match_user);
            const response2 = await writeFriendData(match_user, {
                uid: auth.currentUser.uid,
                name: auth.currentUser.displayName,
                email_verified: auth.currentUser.emailVerified,
                email: auth.currentUser.email,
                profile_picture: auth.currentUser.photoURL,
            });
            if (response === "exists" || response2 === "exists") return toast.info(`${match_user.email} is already your friend`);
            else if (response === "success" && response2 === "success") {
                setClickedAddFriend(false);
                return toast.success(`${match_user.email} is now your friend`)
            }
            else return toast.error(`Unable to connect ${response}`);
        })();
    }

    return (
        <div id="home">
            <PopUp />
            <Box style={{ borderBottom: "1px solid gray", position: "sticky", top: 0 }}>
                <Header>
                    <IconButton className="click" variant="contained" size="small" onClick={() => navigate("/")}>
                        <ArrowBackIosRoundedIcon />
                    </IconButton>
                    <Box></Box>
                    <Toolbox />
                </Header>

                <Typography variant="h4" style={{ padding: "0 1rem", fontWeight: "bold" }}>Chats</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', padding: "0 1rem 1.5rem" }}>
                    <SearchIcon sx={{ color: 'action.active', mr: 0.5, my: 0.25 }} />
                    <TextField id="search" variant="standard" placeholder="search...." />
                </Box>
            </Box>
            <Box>
                {
                    !clickedAddFriend ?
                        friendList.map(obj => {
                            return <HomeCard key={obj.email} data={obj} />
                        })
                        :
                        <FriendSearch>
                            <Typography variant="h6">Connect with your friend 😺</Typography>
                            <TextField label="Friend's Email" id="friend-search" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
                            <Button variant="contained" onClick={handleAddFriend}>Connect</Button>
                        </FriendSearch>
                }
                {friendList.length === 0 && !clickedAddFriend ? <Empty>Nothing's Here</Empty> : <></>}
            </Box>
            <IconButton style={{ position: "absolute", bottom: "3rem", right: "1rem", zIndex: 1 }} onClick={() => setClickedAddFriend(!clickedAddFriend)}>
                <SupervisedUserCircleRoundedIcon fontSize="large" style={{ color: "black" }} />
            </IconButton>
        </div>
    )
}

const Header = styled(Box)`
    text-align: right;
    display: flex;
    justify-content: space-between
`;

const FriendSearch = styled(Container)`
    text-align: center;
    padding: 2rem 0;
    & > h6, & > div {
        margin-top: 1rem;
    }
    & > button {
        display: block;
        margin: 1rem auto;
        background-color: #f18f8f;
    }
    & > button:hover {
        background-color: #e56a6a;
    }
`

const Empty = styled(Box)`
    text-align: center;
    color: gray;
    padding: 1rem;
`