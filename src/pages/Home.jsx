import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        window.onresize = () => {
            navigate("/", { replace: true })
        }
    }, [navigate])
    return (
        <div id="home">
            <button className="click" onClick={() => navigate("/chat")}>chat</button>
        </div>
    )
}