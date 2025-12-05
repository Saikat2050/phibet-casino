"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Crown from "../../assets/images/casino/crown.svg";
import GameCard from "@/components/GameCard";
import { useRouter } from "next/navigation";
import { getFavoriteGames, updateFavorite } from "@/actions";
import { toast } from 'react-toastify';
import { PrimaryButton } from "../Common/Button";
import InfiniteScroll from "react-infinite-scroll-component";
import Login from "../Auth/Login";
import useUserStore from "@/store/useUserStore";
import useModalsStore from "@/store/useModalsStore";
import { motion } from "framer-motion";
const ITEMS_PER_PAGE = 24;

export default function FavouriteGamesShow() {
  const { isLoggedIn } = useUserStore();
  const { openModal } = useModalsStore();
  const router = useRouter();

  const [games, setGames] = useState([]);
  const [totalFavoritesCount, setTotalFavoritesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadInitialGames = async () => {
      try {
        setGames([]);
        setIsLoading(true);
        const params = { page: 1, limit: ITEMS_PER_PAGE };
        const result = await getFavoriteGames(params);
        setGames(result?.rows);
        setTotalFavoritesCount(result.count);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading initial games:", error);
        toast.error("Failed to load favorite games");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      loadInitialGames();
    }
  }, [isLoggedIn]);

  const loadMoreGames = useCallback(async () => {
    if (isLoading || games.length >= totalFavoritesCount) return;

    try {
      setIsLoading(true);
      const params = { page: currentPage + 1, limit: ITEMS_PER_PAGE };
      const result = await getFavoriteGames(params);
      setGames((prevGames) => [...prevGames, ...result.rows]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading more games:", error);
      toast.error("Failed to load more games");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, games?.length, totalFavoritesCount]);

  const handleGameClick = (gameId) => {
    if (isLoggedIn) {
      router.push(`/game/${gameId}`);
    } else {
      toast.error("Please login to play this game.");
      openModal(<Login />);
    }
  };

  const toggleFav = async (isFavorite, gameId) => {
    if (!isLoggedIn) {
      toast.error("Please login to add games to favorites");
      return;
    }

    try {
      await updateFavorite({ request: !isFavorite, gameId });

      // Update the game list locally
      setGames((prevGames) =>
        prevGames.filter((game) => game.masterCasinoGameId !== gameId)
      );
      setTotalFavoritesCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Failed to update favorite:", error);
      toast.error("Failed to update favorite game");
    }
  };

  if (isLoading && games.length === 0) {
    return (
      <div className="loading-state">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Image src={Crown} alt="Crown" className="w-6 h-6" />
          <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-white">
            Favorite games
          </h2>
        </div>

        {games.length > 0 ? (
          <InfiniteScroll
            dataLength={games.length}
            next={loadMoreGames}
            hasMore={games.length < totalFavoritesCount}
            loader={<h4 className="text-white">Loading...</h4>}
            endMessage={
              <p className="text-white text-center mt-4">
                <b>No more games to load</b>
              </p>
            }
          >
            <motion.div className="grid grid-cols-8 text-white gap-4 max-mxs:gap-2 max-xl:grid-cols-7 max-lg:grid-cols-6 max-md:grid-cols-4 max-mxs:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1, duration: 0.5 },
              },
            }}>
              {games.map((game) => (
                 <motion.div key={game.masterCasinoGameId}
                 variants={{
                   hidden: { opacity: 0, y: 20 },
                   visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                 }}>
                <GameCard
                  key={game.masterCasinoGameId}
                  game={game}
                  handleGameClick={() => handleGameClick(game.masterCasinoGameId)}
                  toggleFav={() =>
                    toggleFav(game.FavoriteGames, game.masterCasinoGameId)
                  }
                />
                </motion.div>
              ))}
            </motion.div>
          </InfiniteScroll>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-white">
            <div className="w-24 h-24 mb-6 relative">
              <Image
                src={Crown}
                alt="Empty Favorites"
                className="opacity-50"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Favorite Games Yet
            </h3>
            <p className="text-white/60 max-w-md mb-6">
              Start adding your favorite games to keep track of them and access them quickly!
            </p>
            <PrimaryButton
              onClick={() => router.push('/')}
              // className="px-6 py-3"
            >
              Browse Games on Home Screen
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
