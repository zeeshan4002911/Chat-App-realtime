import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Error from "./pages/Error";

const App = () => {
    const getWindowWidth = () => {
        return window.innerWidth || document.documentElement.clientWidth || document.body.innerWidth;
    }
    const width = getWindowWidth();
    return (
        <div id="main">
            <BrowserRouter>
                <Routes>
                    { (width >= 500) ?
                    <Route index element={
                        <>
                            <Landing />
                            <Chat />
                        </>
                    } />
                    :
                    <>
                    <Route index element={<Landing />} />
                    <Route index path="/chat" element={<Chat />} />
                    </>
                    }
                    <Route path="*" element={<Error />}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;