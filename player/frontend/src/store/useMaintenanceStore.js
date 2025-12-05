import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMaintenanceStore = create(
  persist(
    (set) => ({
      maintenanceMode: false,
      setMaintenanceMode: (mode) => set(() => ({ maintenanceMode: mode })),
    }),
    {
      name: 'maintenance-mode-storage', // localStorage key
    }
  )
);

export default useMaintenanceStore; 