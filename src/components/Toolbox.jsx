import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logOut } from "../firebase/auth";
import { auth } from "../firebase/config";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';


const Toolbox = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(auth);

    useEffect(() => {
        setCurrentUser(auth);
    }, [auth])

    const handleLogout = async () => {
        await logOut(currentUser);
        navigate("/", { replace: true });
    }

    const ITEM_HEIGHT = 50;

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 5,
                        width: 'auto',
                    },
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar alt="Remy Sharp" src={currentUser?.currentUser?.photoURL} referrerPolicy="no-referrer" />
                </MenuItem>
                <MenuItem onClick={handleClose}>{currentUser?.currentUser?.displayName}</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
            </Menu>
        </div>
    )
}

export default Toolbox;