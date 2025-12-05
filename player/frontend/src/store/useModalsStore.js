import { create } from 'zustand';

const useModalsStore = create((set) => ({
  components: [],
  keys: [],
  isCloseNeed:false,
  setIsCloseNeed:(data) => set({isCloseNeed: true }),
  openModal: (component, key = '') => {
    set((state) => ({
      // A basic caching for modals
      components:
        (key !== '' && state.keys?.includes(key))
          ? [...state.components]
          : [...state.components, component],
      keys: state.keys?.length ? [...state.keys, key] : [key]
    }));
  },
  closeModal: (key = '') =>
    set((state) => ({
      components: state.components.slice(0, -1),
      keys: state.keys.filter(k => k !== key),
      isCloseNeed: false,
    })),
  clearModals: () => set({ components: [], keys: [],isCloseNeed: false }),
}));

export default useModalsStore;