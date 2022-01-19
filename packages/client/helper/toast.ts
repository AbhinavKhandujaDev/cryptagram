import { ToastOptions, ToastContent, toast } from "react-toastify";

const showToast = (content: ToastContent, options?: ToastOptions<any>) =>
  toast(content, {
    position: "top-center",
    hideProgressBar: true,
    type: "success",
    ...options,
  });
export default showToast;
