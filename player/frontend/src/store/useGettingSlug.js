import { create } from 'zustand';
import { persist,createJSONStorage } from 'zustand/middleware';

export const useGettingSlugName = create(
  persist(
    (set) => ({
      param_name: '',

      setParamsName: (data) => {
        set({ param_name: data });
      },
    }),
    {
      name: 'slug-name-storage', // name of the storage item (localStorage key)
      storage: createJSONStorage(() => localStorage),
    }
  )
);
