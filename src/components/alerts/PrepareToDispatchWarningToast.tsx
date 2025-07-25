import { useEffect } from "react";
import { toast } from "react-toastify";

export const PrepareToDispatchWarningToast = () => {
  useEffect(() => {
    console.log("start");
    const checkTimeAndShowToast = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      // const seconds = now.getSeconds(); // COMMENT JUST TO DEBUG

      // if (seconds % 10 === 0) { // COMMENT JUST TO DEBUG
      if ((hours === 9 || hours === 14) && minutes === 0) {
        const message =
          hours === 9
            ? "Atenção! Prepare as ordens de serviço que serão despachadas às 10h"
            : "Atenção! Prepare as ordens de serviço que serão despachadas às 15h";

        toast.warning(message, {
          position: "top-left",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className:
            "bg-red-500 text-white font-semibold p-4 rounded-lg shadow-lg",
          bodyClassName: "text-sm p-4 ",
          style: {
            minWidth: "fit-content",
          },
          bodyStyle: {
            minWidth: "max-content",
          },
        });
      }
    };

    // Check time every minute
    const interval = setInterval(checkTimeAndShowToast, 60 * 1000);
    // const interval = setInterval(checkTimeAndShowToast, 1000);// COMMENT JUST TO DEBUG

    return () => clearInterval(interval);
  }, []);

  return null; // No UI, just triggers the toast
};
