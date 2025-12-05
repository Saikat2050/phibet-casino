import { create } from "zustand";
import { persist,createJSONStorage } from "zustand/middleware";

const useFavGameStore = create(
  persist(
    (set) => ({
      games: [],
      currentPage: 1,
      totalFavoritesCount: 0,
      isLoading: false,

      setGames: (games) =>
        set(() => ({
          games,
        })),

      setTotalFavoritesCount: (count) =>
        set(() => ({
          totalFavoritesCount: count,
        })),

      updateGames: (gameId) =>
        set((state) => ({
          games: state.games.map((g) =>
            g.masterCasinoGameId === gameId
              ? { ...g, FavoriteGames: !g.FavoriteGames }
              : g
          ),
        })),

      updateFavGames: (gameId) =>
        set((state) => ({
          games: state.games.filter((g) => g.masterCasinoGameId !== gameId),
          totalFavoritesCount: state.totalFavoritesCount - 1,
        })),

      setIsLoading: (isLoading) =>
        set(() => ({
          isLoading,
        })),

      setCurrentPage: (page) => set(() => ({ currentPage: page })),

      removeFavoriteGame: (gameId) =>
        set((state) => ({
          games: state.games.filter((g) => g.masterCasinoGameId !== gameId),
          totalFavoritesCount: state.totalFavoritesCount - 1,
          currentPage: 1,
        })),

      resetGames: () =>
        set(() => ({
          games: [],
          currentPage: 1,
          totalFavoritesCount: 0,
          isLoading: false,
        })),
    }),
    {
      name: "games-storage",
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default useFavGameStore;
