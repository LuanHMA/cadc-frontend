import { ToastContainer, Zoom } from "react-toastify"

export function ToastifyProvider() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            transition={Zoom}
            draggable
            pauseOnHover={false}
        />
    )
}