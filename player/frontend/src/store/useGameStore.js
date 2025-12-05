import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useGamesStore = create(
  persist(
    (set) => ({
      games: [],
      currentPage: 1,
      hasMore: true,
      isLoading: false,

      addGames: (newGames) => set((state) => ({
        games: [...state.games, ...newGames],
      })),

      updateGames: (gameId) => {
        let updatedGames;

        set((state) => {
          updatedGames = state.games.map((g) =>
            g.masterCasinoGameId === gameId
              ? { ...g, FavoriteGames: !g.FavoriteGames }
              : g
          );
          return { games: updatedGames };
        });

        return updatedGames;
      },

      updateFavGames: (gameId) => {
        let updatedGames;
      
        set((state) => {
          
          updatedGames = state.games.filter((g) => g.masterCasinoGameId !== gameId);
          return { games: updatedGames };
        });
      
       
        return updatedGames;
      },
      



      setHasMore: (hasMore) => set(() => ({
        hasMore,
      })),

      setIsLoading: (isLoading) => set(() => ({
        isLoading,
      })),

      setCurrentPage: (page) => set(() => ({
        currentPage: page,
      })),

      resetGames: () => set(() => ({
        games: [],
        currentPage: 1,
        hasMore: true,
        isLoading: false,
      })),
    }),
    {
      name: "games-storage", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default useGamesStore;
