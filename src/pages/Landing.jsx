import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signIn, signUp, logOut } from "../firebase/auth";
import { auth } from "../firebase/config";
import { Box, Button, styled, Typography, TextField } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from 'react-toastify';
import PopUp from "../components/PopUp";


export default function Landing() {
    const navigate = useNavigate();
    const [isLoginClick, setIsLoginClick] = useState(false);
    const [userInput, setUserInput] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const handleInput = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value });
    }

    const handleLogin = async (type, email, password) => {
        if (auth.currentUser === null) {
            const user = await signIn(auth, type, email, password);
            if (!user) return toast.error("Unable to connect with firebase");
        }
        navigate("/home", { state: { friend_data: null } });
    }

    const handleSignUp = async () => {
        const email = userInput.email.toLowerCase();
        if (userInput.password !== userInput.confirm_password) {
            return toast.warn("Password are not same")
        }
        const password = userInput.password;
        const name = userInput.name;
        const user = await signUp(auth, email, password, name);
        if (!user) return toast.error("Unable to connect with firebase");
        toast.success("Successfully registered");
        await logOut(auth);
        setIsLoginClick(false);
    }

    return (
        <div id="landing">
            <PopUp />
            <Main>
                <Title variant="h1">Welcome</Title>
                <Typography variant="h6" fontWeight="bold">&lt; /Chat &gt;</Typography>
                {!isLoginClick ?
                    <Container>
                        <TextField variant="outlined" label="Email" name="email" onKeyUp={(e) => handleInput(e)}></TextField>
                        <TextField variant="outlined" label="Password" name="password" type="password" onKeyUp={(e) => handleInput(e)}></TextField>
                        <ButtonCustom variant="contained" onClick={() => handleLogin("EMAIL/PASSWORD", userInput.email, userInput.password)} >Login</ButtonCustom>
                        <ButtonCustom2 variant="outlined" onClick={() => setIsLoginClick(true)}>Sign up</ButtonCustom2>
                        <ButtonCustom3 onClick={() => handleLogin("GOOGLE_LOGIN")}>Login using Goo< GoogleIcon />le</ButtonCustom3>
                    </Container>
                    :
                    <Container>
                        <TextField variant="outlined" label="Name" name="name" onKeyUp={(e) => handleInput(e)}></TextField>
                        <TextField variant="outlined" label="Email" name="email" onKeyUp={(e) => handleInput(e)}></TextField>
                        <TextField variant="outlined" label="Password" name="password" type="password" onKeyUp={(e) => handleInput(e)}></TextField>
                        <TextField variant="outlined" label="Confirm Password" name="confirm_password" type="password" onKeyUp={(e) => handleInput(e)}></TextField>
                        <ButtonCustom variant="contained" onClick={handleSignUp}>Sign Up</ButtonCustom>
                        <ButtonCustom2 variant="outlined" onClick={() => setIsLoginClick(false)}>Login</ButtonCustom2>
                        <ButtonCustom3 onClick={() => handleLogin("GOOGLE_SIGNUP")}>Sign Up using Goo< GoogleIcon />le</ButtonCustom3>
                    </Container>
                }
            </Main>
        </div>
    )
}

const Title = styled(Typography)`
    color: rgba(255, 73, 73, 0.3);
    font-size: 58px;
`;

const Main = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    flex-direction: column;
`;

const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    & > div, & > button {
        margin: 1rem 0;
    }
`;

const ButtonCustom = styled(Button)`
    color: white;
    background-color: #e56a6a; 
    &:hover {
        background-color: #f18f8f;
    }
`;

const ButtonCustom2 = styled(Button)`
    color: white;
    background-color: #f18f8f;
    border-color: #f18f8f;
    &:hover {
        background-color: #f18f8f;
        border-color: #f18f8f;
    }
`;

const ButtonCustom3 = styled(Button)`
    color: black;
`;