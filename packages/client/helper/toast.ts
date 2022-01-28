import { ToastOptions, ToastContent, toast } from "react-toastify";

// const showToast = (content: ToastContent, options?: ToastOptions<any>) =>
//   toast(content, {
//     position: "top-center",
//     hideProgressBar: true,
//     type: "success",
//     ...options,
//   });
const showToast = {
  success: (content: ToastContent, options?: ToastOptions<any>) =>
    toast(content, {
      position: "top-center",
      hideProgressBar: true,
      type: "success",
      ...options,
    }),
  error: (content: ToastContent, options?: ToastOptions<any>) =>
    toast(content, {
      position: "top-center",
      hideProgressBar: true,
      type: "error",
      ...options,
    }),
  warning: (content: ToastContent, options?: ToastOptions<any>) =>
    toast(content, {
      position: "top-center",
      hideProgressBar: true,
      type: "warning",
      ...options,
    }),
  info: (content: ToastContent, options?: ToastOptions<any>) =>
    toast(content, {
      position: "top-center",
      hideProgressBar: true,
      type: "info",
      ...options,
    }),
};
export default showToast;
