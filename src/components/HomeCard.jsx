import { Avatar, Box, Typography, styled } from "@mui/material";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { useNavigate } from "react-router-dom";

const Card = styled(Box)`
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid gray;
    width: 100%;    
    padding: 1rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
`
const Verified = styled(Typography)`
    position: absolute;
    right: 1rem;
    top: 1rem
`

const HomeCard = ({ data }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/chat", { state: { friend_data: data } });
    }

    return (
        <Card onClick={handleClick}>
            <Avatar alt={data.name} src={data.profile_picture} referrerPolicy="no-referrer" />
            <Box>
                <Verified style={data.email_verified ? { color: "green" } : { color: "red" }}>{
                    data.email_verified ? <VerifiedUserIcon fontSize="small" /> : <PrivacyTipIcon fontSize="small" />
                }</Verified>
                <Typography>{data.name}</Typography>
                <Typography>{data.email}</Typography>
            </Box>
        </Card>
    )
}

export default HomeCard;