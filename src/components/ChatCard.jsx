import { Box, Typography, styled } from "@mui/material"

const ChatCard = ({ data, user_uid }) => {

    const rightFloat = () => {
        return (data.sender_id === user_uid) ? { textAlign: "right", alignSelf: "flex-end" } : { textAlign: "left" };
    }

    return (
        <Card style={rightFloat()}>
            <Typography >{data.content}</Typography>
            <Typography fontSize="8px" >{data.time}</Typography>
        </Card>
    )
}

export default ChatCard;


const Card = styled(Box)`
    background-color: white;
    margin: 0.5rem 0;
    padding: 0 0.25rem;
    border-radius: 4px;
    width: fit-content;
    max-width: 80%;
    overflow-wrap: break-word;
`