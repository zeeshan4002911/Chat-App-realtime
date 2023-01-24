import { useNavigate } from "react-router-dom"

export default function Landing() {
    const navigate = useNavigate();
    return (
        <div id="landing">
            <button className="click" onClick={() => navigate("/chat")}>chat</button>
        </div>
    )
}