import create from "zustand";
import { combine } from "zustand/middleware";

export const useNotificationsStore = create(
  combine(
    {
      notifications: [],
    },
    (set) => ({
      // Append notification to the end of the array
      setNotification: (notification) =>
        set((prev) => ({
          notifications: [...prev.notifications, notification],
        })),
    })
  )
);
