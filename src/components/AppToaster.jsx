import { createContext, useCallback, useContext } from "react";
import {
  Box,
  HStack,
  Toaster,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastIndicator,
  ToastCloseTrigger,
  createToaster,
} from "@chakra-ui/react";

const ToastContext = createContext(null);

const toastStore = createToaster({
  placement: "top-end",
  gap: 16,
});

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={toastStore}>
      {children}
      <Toaster
        toaster={toastStore}
        placement="top-end"
        gap="3"
        label="Notifications"
      >
        {(toast) => (
          <ToastRoot
            key={toast.id}
            bg="gray.900"
            color="white"
            borderRadius="md"
            boxShadow="lg"
            px="4"
            py="3"
            _light={{ bg: "gray.800" }}
            _dark={{ bg: "gray.700" }}
          >
            <HStack align="flex-start" spacing="3">
              <ToastIndicator />
              <Box flex="1">
                <ToastTitle fontWeight="semibold" fontSize="sm" />
                <ToastDescription fontSize="sm" mt="1" />
              </Box>
              {toast.closable !== false && <ToastCloseTrigger />}
            </HStack>
          </ToastRoot>
        )}
      </Toaster>
    </ToastContext.Provider>
  );
}

export function useAppToast() {
  const toaster = useContext(ToastContext);
  if (!toaster) {
    throw new Error("useAppToast must be used within a ToastProvider");
  }

  const notify = useCallback(
    ({
      status = "info",
      title,
      description,
      duration,
      closable = true,
      id,
      ...rest
    } = {}) => {
      const payload = { title, description, duration, closable, id, ...rest };
      switch (status) {
        case "success":
          return toaster.success(payload);
        case "error":
          return toaster.error(payload);
        case "warning":
          return toaster.warning(payload);
        case "loading":
          return toaster.loading(payload);
        case "info":
        default:
          return toaster.info(payload);
      }
    },
    [toaster]
  );

  notify.dismiss = (id) => toaster.dismiss(id);
  notify.closeAll = () => toaster.dismiss();
  notify.close = (id) => toaster.dismiss(id);
  notify.update = (id, data) => toaster.update(id, data);
  notify.promise = (promise, options, shared) =>
    toaster.promise(promise, options, shared);
  notify.isActive = (id) => toaster.isVisible(id);

  return notify;
}
