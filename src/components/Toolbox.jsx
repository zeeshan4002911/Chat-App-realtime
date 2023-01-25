import { useNavigate } from "react-router-dom";
import { logOut } from "../firebase/auth";
import { auth } from "../firebase/config";
import { Button, Avatar } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useState, useEffect } from "react";

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

    return (
        <>
            <PopupState variant="popover" popupId="popup-menu" >
                {(popupState) => (
                    <>
                        <Button variant="contained" {...bindTrigger(popupState)} /* style={{ width: "fit-content" }} */>
                            Dashboard
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={popupState.close}>
                                <Avatar alt="Remy Sharp" src={currentUser?.currentUser?.photoURL} referrerPolicy="no-referrer"/>
                            </MenuItem>
                            <MenuItem onClick={popupState.close}>{currentUser?.currentUser?.displayName}</MenuItem>
                            <MenuItem onClick={popupState.close}>My account</MenuItem>
                            <MenuItem onClick={() => { popupState.close(); handleLogout() }}>Logout</MenuItem>
                        </Menu>
                    </>
                )}
            </PopupState>
        </>
    )
}

export default Toolbox;