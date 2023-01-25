import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signIn, signUp } from "../firebase/auth";
import { auth } from "../firebase/config";
import { Box, Button, styled, Typography, TextField } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Main = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    flex-direction: column;
`

const LoginButton = styled(Button)`
    &:hover {
        border-radius: 5px;
}
`;

const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    & > div, & > button {
        margin: 1rem 0;
    }
`;

export default function Landing() {
    const navigate = useNavigate();
    const [isLoginClick, setIsLoginClick] = useState(false);
    const [userInput, setUserInput] = useState({
        email: "",
        password: "",
        confirm_password: ""
    })

    const handleInput = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value });
    }

    const handleLogin = async (type, email, password) => {
        const user = await signIn(auth, type, email, password);
        if (!user) return console.log("Unable to connect with firebase", user);
        console.log("user", user);
        navigate("/home", { replace: true })
    }

    const handleSignUp = async () => {
        const email = userInput.email.toLowerCase();
        if (userInput.password !== userInput.confirm_password) {
            return console.log("Password are not same")
        }
        const password = userInput.password;
        const user = await signUp(auth, email, password);
        if (!user) return console.log("Unable to connect with firebase", user);
        console.log("user registered", user);
        navigate("/home", { replace: true })
    }

    return (
        <div id="landing">
            <Main>
                <Typography variant="h1">Welcome</Typography>
                <Typography variant="h6">&lt; /Chat &gt;</Typography>
                {!isLoginClick ?
                    <Container>
                        <TextField variant="outlined" label="Email" name="email" onKeyUp={(e) => handleInput(e)}></TextField>
                        <TextField variant="outlined" label="Password" name="password" onKeyUp={(e) => handleInput(e)}></TextField>
                        <Button variant="contained" onClick={() => handleLogin("EMAIL/PASSWORD", userInput.email, userInput.password)} >Login</Button>
                        <Button variant="outlined" onClick={() => setIsLoginClick(true)}>Sign up</Button>
                    </Container>
                    :
                    <Container>
                        <TextField variant="outlined" label="Email" name="email" onKeyUp={(e) => handleInput(e)}></TextField>
                        <TextField variant="outlined" label="Password" name="password" onKeyUp={(e) => handleInput(e)}></TextField>
                        <TextField variant="outlined" label="Confirm Password" name="confirm_password" onKeyUp={(e) => handleInput(e)}></TextField>
                        <Button variant="contained" onClick={handleSignUp}>Sign Up</Button>
                        <Button variant="outlined" onClick={() => setIsLoginClick(false)}>Login</Button>
                    </Container>
                }
                <LoginButton onClick={() => handleLogin("GOOGLE")}>Login using Goo< GoogleIcon />le</LoginButton>
            </Main>
        </div>
    )
} 