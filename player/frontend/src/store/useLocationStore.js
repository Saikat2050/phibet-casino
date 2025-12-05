import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getStateListingAction, getCityListingAction } from "@/actions";

const useLocationStore = create(
  persist(
    (set) => ({
      stateListing: [],
      cityListing: [],
      setStateListing: (data) => set(() => ({ stateListing: data })),
      setCityListing: (data) => set(() => ({ cityListing: data })),

      fetchStateListing: async () => {
        try {
          const response = await getStateListingAction();
          if (response?.success) {
            set(() => ({ stateListing: response?.data?.data }));
          } else {
            console.error("Failed to fetch state listing:", response.message);
          }
        } catch (error) {
          console.error("Error fetching state listing:", error);
        }
      },

      fetchCityListing: async () => {
        try {
          const response = await getCityListingAction();
          if (response?.success) {
            set(() => ({ cityListing: response.data }));
          } else {
            console.error("Failed to fetch city listing:", response.message);
          }
        } catch (error) {
          console.error("Error fetching city listing:", error);
        }
      },
    }),
    { name: "useLocationStore" }
  )
);

export default useLocationStore;
