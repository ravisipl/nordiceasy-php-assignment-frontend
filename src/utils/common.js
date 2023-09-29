import { toast } from 'react-toastify';

export const notify = {
    success: (msg) => {
      toast.clearWaitingQueue();
      toast.dismiss();
  
      toast.success(msg, {
        position: "top-right",
        closeOnClick: true,
        pauseOnHover: true,
      });
    },
    error: (msg) => {
      toast.clearWaitingQueue();
      toast.dismiss();
  
      toast.error(msg, {
        position: "top-right",
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };