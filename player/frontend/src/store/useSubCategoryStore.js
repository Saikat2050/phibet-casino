import { create } from "zustand";
import { getCasinoGamesAction, getSubCategories } from "@/actions";

const useSubCategoryStore = create((set) => ({
  // Subcategories Data
  subCategoriesData: [],
  selectedSubcategoryGames: [],
  setSubcategoriesData: (data) => set(() => ({ subCategoriesData: data })),
  setSelectedSubcategoryGames: (data) =>
    set(() => ({ selectedSubcategoryGames: data })),

  // Searched Games Data
  searchedGames: [],
  searchTerm: "",
  isSearched: false,
  setIsSearched: (status) => set(() => ({ isSearched: status })),
  setSearchedGames: (games) => set(() => ({ searchedGames: games })),
  setSearchTerm: (terms) => set(() => ({ searchTerm: terms })),
  clearSearchedGames: () =>
    set(() => ({ searchedGames: [], isSearched: false })),

  // Provider Filtering
  selectedProviderId: null,
  selectedProviderName: "",
  setSelectedProvider: (providerId) => set(() => ({ selectedProviderId: providerId })),
  setSelectedProviderName: (providerName) => set(() => ({ selectedProviderName: providerName })),
  masterGameSubCategoryId:"",
  masterGameSubCategoryTitle:"",
  setMasterGameSubCategoryId:(masterId)=>set(()=> ({masterGameSubCategoryId:masterId})),
  setMasterGameSubCategoryName:(masterName)=>set(()=> ({masterGameSubCategoryTitle:masterName})),
  // Fetch Games
  fetchGames: async () => {
    const { searchTerm, selectedProviderId, setSearchedGames, setIsSearched, clearSearchedGames } = useSubCategoryStore.getState();

    const data = {
      search: searchTerm,
      limit: 24,
      page: 1,
    };

    if (selectedProviderId) {
      data.masterCasinoProviderId = selectedProviderId;
    }

    try {
      const games = await getCasinoGamesAction(data);

      if (searchTerm) {
        setSearchedGames(games); 
        setIsSearched(true);
      } else if (selectedProviderId) {
        set({ selectedSubcategoryGames: games.rows }); 
      } 
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  },

}));

export default useSubCategoryStore;
