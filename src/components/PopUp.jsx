import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const PopUp = () => {
    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    )
}

export default PopUp;

/*
Toast types---
info
success
warning
error
*/