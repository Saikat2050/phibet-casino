import { create } from 'zustand';

const useGeneralStore = create((set) => ({
    isLoggedIn: false,
    setIsLoggedIn: (data) => set(() => ({ isLoggedIn: data })),
    user: {},
    setUser: (data) => set(() => ({ user: data })),
    logout: () => {
        window.location.href = '/';
        return set(() => ({ user: {}, isLoggedIn: false }))
    },
    // --- Maintenance Mode ---
    maintenanceMode: false,
    setMaintenanceMode: (mode) => set(() => ({ maintenanceMode: mode })),
}));

export default useGeneralStore;