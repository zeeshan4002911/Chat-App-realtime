import { Box, Typography, styled, Container } from "@mui/material"

const ChatCard = ({ data, user_uid }) => {

    const rightFloat = () => {
        // return (data.sender_id === user_uid) ? { textAlign: "right", alignSelf: "flex-end" } : { textAlign: "left" };
        return (data.sender_id === user_uid) ? { float: "right" } : { float: "left" };
    }

    const download = () => {
        let file_name = data.media_url.split("/");
        return (file_name[file_name.length - 1]);
    }

    return (
        <Box>
            <Card style={rightFloat()}>
                <Typography >{data.content}</Typography>
                {data.media_url &&
                    <Container maxWidth="100%">
                        <a download href={download()} target="_blank" rel="noreferrer">
                            {(data.media_type === "image") ?
                                <img src={data.media_url} alt="" width="100%" height="100%" />
                                : (data.media_type === "audio") ?
                                    <audio src={data.media_url} alt="" controls width="100%" />
                                    : (data.media_type === "video") ?
                                        <video src={data.media_url} alt="" controls width="100%" />
                                        :
                                        <div>{data.media_url}</div>
                            }
                        </a>
                    </Container>
                }
                <Typography fontSize="8px" >{data.time}</Typography>
            </Card>
        </Box>
    )
}

export default ChatCard;


const Card = styled(Box)`
    background-color: white;
    margin: 0.5rem 0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    width: fit-content;
    max-width: 80%;
    overflow-wrap: break-word;
    clear: both;
`