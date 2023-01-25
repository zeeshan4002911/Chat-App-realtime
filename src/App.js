import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Landing from "./pages/Landing";
import Error from "./pages/Error";
import ToolBox from "./components/Toolbox";

const App = () => {
    const getWindowWidth = () => {
        return window.innerWidth || document.documentElement.clientWidth || document.body.innerWidth;
    }
    const width = getWindowWidth();
    return (
        <div id="main">
            <BrowserRouter>
                <Routes>
                    <Route path="test" element={<ToolBox />} />
                    <Route index element={<Landing />} />
                    {(width >= 500) ?
                        <Route path="/home" element={
                            <>
                                <Home />
                                <Chat />
                            </>
                        } />
                        :
                        <>
                            <Route path="/home" element={<Home />} />
                            <Route path="/chat" element={<Chat />} />
                        </>
                    }
                    <Route path="*" element={<Error />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;