import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Toolbox from "../components/Toolbox";
import { Box, styled, IconButton, TextField, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import SearchIcon from '@mui/icons-material/Search';

const Header = styled(Box)`
    text-align: right;
    display: flex;
    justify-content: space-between
`

export default function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        window.onresize = () => {
            window.location.reload();
        }
    }, [navigate])
    return (
        <div id="home">
            <Header>
                <IconButton className="click" variant="contained" size="small" onClick={() => navigate("/")}>
                    <ArrowBackIosRoundedIcon />
                </IconButton>
                <Box></Box>
                <Toolbox />
            </Header>
            <Typography variant="h4" style={{padding: "0 1rem", fontWeight: "bold"}}>Chats</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', padding: "0 1rem 4rem" }}>
                <SearchIcon sx={{ color: 'action.active', mr: 0.5, my: 0.25 }} />
                <TextField id="search" variant="standard" placeholder="search...." />
            </Box>
        </div>
    )
}