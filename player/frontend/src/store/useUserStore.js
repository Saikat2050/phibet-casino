import { create } from "zustand";
import { persist } from "zustand/middleware";
import { deleteBrowserCookie } from "@/utils/clientCookieUtils";

const useUserStore = create(
  persist(
    (set, get) => ({
      // --- Auth/User State ---
      user: null,
      accessToken: null,
      joiningBonus: null,
      activeBonus: null,
      amoeBonus: null,
      getWelcomePackage: null,
      isAuthenticated: false,
      // --- Other State ---
      userIp: null,
      setUserIp: (data) => set(() => ({ userIp: data })),
      selectedCoin: "USD",
      setSelectedCoin: (data) => set(() => ({ selectedCoin: data })),
      welcomeBonusPurchase: null,
      setWelcomeBonusPurchase: (data) => set(() => ({ welcomeBonusPurchase: data })),
      // --- Auth Setters ---
      setAuthData: (authResponse) => {
        // Only allow setting if not already authenticated or if new data is provided
        if (!get().isAuthenticated || (authResponse && authResponse.accessToken)) {
          set({
            user: authResponse.user || null,
            accessToken: authResponse.accessToken || null,
            joiningBonus: authResponse.joiningBonus || null,
            activeBonus: authResponse.activeBonus || null,
            amoeBonus: authResponse.amoeBonus || null,
            getWelcomePackage: authResponse.getWelcomePackage || null,
            isAuthenticated: !!authResponse.accessToken,
          });
        }
      },
      clearAuthData: () => {
        set({
          user: null,
          accessToken: null,
          joiningBonus: null,
          activeBonus: null,
          amoeBonus: null,
          getWelcomePackage: null,
          isAuthenticated: false,
          selectedCoin: "USD",
          welcomeBonusPurchase: null,
        });
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          joiningBonus: null,
          activeBonus: null,
          amoeBonus: null,
          getWelcomePackage: null,
          isAuthenticated: false,
          selectedCoin: "USD",
          welcomeBonusPurchase: null,
        });
        deleteBrowserCookie("accessToken");
        useUserStore.persist.clearStorage();
      },
    }),
    {
      name: "useUserStore",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        joiningBonus: state.joiningBonus,
        activeBonus: state.activeBonus,
        amoeBonus: state.amoeBonus,
        getWelcomePackage: state.getWelcomePackage,
        isAuthenticated: state.isAuthenticated,
        selectedCoin: state.selectedCoin,
        welcomeBonusPurchase: state.welcomeBonusPurchase,
        userIp: state.userIp,
      }),
    }
  )
);

export default useUserStore;
