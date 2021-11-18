import create from "zustand";
import { combine } from "zustand/middleware";

export const useAuthStore = create(
  combine(
    {
      user: null,
      tokenId: null,
    },
    (set) => ({
      setUser: (user) => set(() => ({ user })),
      setTokenId: (tokenId) => set(() => ({ tokenId })),
    })
  )
);
