import { create } from "zustand";

const useCheckoutStore = create((set) => ({
  checkoutData: null,
  setCheckoutData: (data) => set({ checkoutData: data }),
  clearCheckoutData: () => set({ checkoutData: null }),
}));

export default useCheckoutStore;
