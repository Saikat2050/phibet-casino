"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import Crown from "../../assets/images/casino/crown.svg";
import GameCard from "@/components/GameCard";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import useGamesStore from "@/store/useGameStore";
import { getSubCategories, updateFavorite } from "@/actions";
import { toast } from 'react-toastify';
const ITEMS_PER_PAGE = 24;
import { PrimaryButton } from "../Common/Button";
import useModalsStore from "@/store/useModalsStore";
import Login from "../Auth/Login";
import { motion } from "framer-motion";


export default function SubCategoryGame({ params, result }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const { isLoggedIn } = useUserStore();
  const router = useRouter();

  const {
    games,
    addGames,
    resetGames,
    currentPage,
    hasMore,
    setHasMore,
    setIsLoading,
    isLoading,
    setCurrentPage,
    updateGames
  } = useGamesStore();
  const { openModal } = useModalsStore();
  useEffect(() => {
    resetGames();


    // Check if subCategoryGames is present and not an empty array
    if (result?.subCategoryGames?.length > 0) {
      addGames(result.subCategoryGames);
    }

    setHasMore(result.isMoreGame || false);  // Fallback to false if undefined
  }, [result]);

  const loadMoreGames = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const params = {
        page: currentPage + 1,
        limit: ITEMS_PER_PAGE,
        subCategoryId: result.masterGameSubCategoryId,
      };
      const subCategoryData = await getSubCategories(params);

      // Debugging: Log the response to check the structure

      // Extract new games
      const newGames = subCategoryData[0]?.subCategoryGames || [];

      // Debugging: Check if newGames is an array
      if (!Array.isArray(newGames)) {
        console.error("newGames is not an array:", newGames);
        return;  // Exit if newGames is not an array
      }

      // Add new games to the store
      addGames(newGames);

      // Update hasMore and currentPage
      setHasMore(subCategoryData[0]?.isMoreGame);
      setCurrentPage(currentPage + 1);  // Increment currentPage here
    } catch (error) {
      console.error("Error loading more games:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasMore, isLoading, result.masterGameSubCategoryId]);



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
      updateGames(gameId)
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex items-center gap-2">
        <Image src={Crown} width={32} height={32} alt="Crown" />
        <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-white">
          {result.name?.EN || "Games"}
        </h2>
      </div>

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
      }}
      >
        {games.map((game) => {

          return (
          <motion.div key={game.masterCasinoGameId}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}>
            <GameCard game={game} handleGameClick={handleGameClick} toggleFav={toggleFav} />
          </motion.div>
        )})}
      </motion.div>

      {hasMore && (
        <div className="mt-4">
          <PrimaryButton
             onClick={loadMoreGames}
             disabled={isLoading}
          >
          {isLoading ? "Loading..." : "Load More"}
        </PrimaryButton>
        </div>
      )}
    </div>
  );
}
