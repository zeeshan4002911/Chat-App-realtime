import { useNavigate } from "react-router-dom"

const Chat = () => {
    const navigate = useNavigate();
    return (
        <div id="chat">
            <button className="click" onClick={() => navigate("/")}>back</button>
        </div>
    )
}

export default Chat;