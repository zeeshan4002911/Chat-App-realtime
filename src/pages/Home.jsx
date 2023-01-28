import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Toolbox from "../components/Toolbox";
import { Box, styled, IconButton, TextField, Typography, Container, Button } from "@mui/material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
import { readFriendData, readUserData } from "../firebase/IO";
import HomeCard from "../components/HomeCard";
import { auth } from "../firebase/config";


export default function Home() {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [clickedAddFriend, setClickedAddFriend] = useState(false);

    useEffect(() => {
        (() => {
            auth.onAuthStateChanged(async (user) => {
                const users = await readFriendData(user.auth);
                setFriendList(users);
            })
        })();
        if (userList.length === 0 && clickedAddFriend) {
            (async () => {
                console.log("fetch user data trigger")
                const user_data = await readUserData();
                setUserList(user_data);
            })();
        }
    }, [clickedAddFriend])

    useEffect(() => {
        window.onresize = () => {
            window.location.reload();
        }
    }, [navigate])

    const handleAddFriend = () => {
        console.log("clicked");

        // TODO
    }

    return (
        <div id="home">
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
                            <TextField label="Firend's Email" />
                            <Button variant="contained" onClick={handleAddFriend}>Connect</Button>
                        </FriendSearch>
                }
                {friendList.length === 0 ? <Empty>Nothing's Here</Empty> : <></>}
            </Box>
            <IconButton style={{ position: "absolute", bottom: "1rem", right: "1rem", zIndex: 1 }} onClick={() => setClickedAddFriend(!clickedAddFriend)}>
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