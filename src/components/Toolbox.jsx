import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logOut, deleteAccount } from "../firebase/auth";
import { deleteUserData } from "../firebase/IO";
import { auth } from "../firebase/config";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from "react-toastify";


const Toolbox = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(auth);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (!user) return;
            setCurrentUser(user.auth);
        })
    }, [])

    const handleLogout = async () => {
        await logOut(currentUser);
        navigate("/", { replace: true });
    }

    const handleDelete = async () => {
        const db_response = await deleteUserData(auth);
        if (db_response) return toast.error(`Failed to delete ${db_response}`)
        const response = await deleteAccount(auth);
        if (response) return toast.error(`Failed to delete ${response}`);
        navigate("/");
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
                <MenuItem onClick={handleClose}>{currentUser?.currentUser?.displayName || "Anonymous"}</MenuItem>
                <MenuItem onClick={handleDelete} style={{ color: "red" }}>Delete Account</MenuItem>
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
            </Menu>
        </div>
    )
}

export default Toolbox;