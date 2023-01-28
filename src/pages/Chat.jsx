import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react";
import { IconButton, Box, styled, Avatar, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { writeFriendData } from "../firebase/IO";
import { auth } from "../firebase/config";

const Header = styled(Box)`
    display: flex;
    align-items: center;
    border-bottom: 1px solid black;
    padding: 1rem 0;
    gap: 0.5rem;
`;

const Chat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location?.state?.friend_data;

    useEffect(() => {
        window.onresize = () => {
            window.location.reload();
        }
    }, [navigate])

    return (
        <div id="chat">
            {
                location?.state?.friend_data && <>
                    <Header>
                        <IconButton className="click" variant="contained" size="small" onClick={() => navigate("/home")}>
                            <ArrowBackIosRoundedIcon />
                        </IconButton>
                        <Avatar alt={data?.name} src={data?.profile_picture} referrerPolicy="no-referrer" />
                        <Typography>{data?.name}</Typography>
                    </Header>
                </>
            }
        </div>
    )
}

export default Chat;