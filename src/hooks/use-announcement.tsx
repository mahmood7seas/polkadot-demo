/** @format */
import { useSnackbar } from "notistack";

interface UseIntersectionObserverReturn {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const useAnnouncement = (): UseIntersectionObserverReturn => {
  const { enqueueSnackbar } = useSnackbar();

  const success = (message: string) => {
    enqueueSnackbar(message, {
      variant: "success",
    });
  };

  const error = (message: string) => {
    enqueueSnackbar(message, {
      variant: "error",
    });
  };

  const info = (message: string) => {
    enqueueSnackbar(message, {
      variant: "info",
    });
  };

  const warning = (message: string) => {
    enqueueSnackbar(message, {
      variant: "warning",
    });
  };

  return { success, error, info, warning };
};

export { useAnnouncement };
