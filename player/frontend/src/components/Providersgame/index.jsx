/* 'use client'
import React from 'react'

const ProviderGameListing = ({params,result}) => {
  return (
    <div>

    </div>
  )
}

export default ProviderGameListing */


"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Crown from "../../assets/images/casino/crown.svg";
import GameCard from "@/components/GameCard";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { getCasinoGamesAction, getFavoriteGames, updateFavorite } from "@/actions";
import { toast } from 'react-toastify';
import { PrimaryButton } from "../Common/Button";
import useFavGameStore from "@/store/useFavGameStore";
import Login from "../Auth/Login";
import useModalsStore from "@/store/useModalsStore";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 24;

function ProviderGameListing({result,name,id}) {
  const { isLoggedIn } = useUserStore();

  const router = useRouter();

  const {
    games,
    setGames,  // Changed to use setGames instead of addGames
    resetGames,
    currentPage,
    totalFavoritesCount,
    setTotalFavoritesCount,
    setIsLoading,
    isLoading,
    setCurrentPage,
    updateGames,
  } = useFavGameStore();
  const { openModal } = useModalsStore();
  // Load initial favorite games
  useEffect(() => {
    const loadInitialGames = async () => {
      try {
        resetGames();
        // const params = { page: 1, limit: ITEMS_PER_PAGE };
        // const result = await getFavoriteGames(params);
        setGames(result.rows); // Replace existing games instead of adding
        setTotalFavoritesCount(result.count);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading initial games:", error);
        toast.error("Failed to load favorite games");
      }
    };

    // if (isLoggedIn) {
      loadInitialGames();
    // }
  }, [isLoggedIn]);

  // Load more games
/*   const loadMoreGames = useCallback(async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const params = {
        page: 1,
        limit: ITEMS_PER_PAGE * (currentPage+1),
        masterCasinoProviderId:id
      };


      const favoriteGames = await getCasinoGamesAction(params);
      const newGames = favoriteGames.rows || [];

      const existingGameIds = new Set(games.map(game => game.masterCasinoGameId));


      const uniqueNewGames = newGames.filter(
        game => !existingGameIds.has(game.masterCasinoGameId)
      );

      if (uniqueNewGames.length > 0) {
        setGames([...games, ...uniqueNewGames]);
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      console.error("Error loading more games:", error);
      toast.error("Failed to load more games");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, games, setGames, setCurrentPage]); */

  const loadMoreGames = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Incremental fetching by increasing the page number
      const params = {
        page: (currentPage + 1), // Increase page number
        limit: ITEMS_PER_PAGE, // Keep limit fixed
        masterCasinoProviderId: id,
      };
      const favoriteGames = await getCasinoGamesAction(params);
      const newGames = favoriteGames.rows || [];

      // Filter out duplicates using existing game IDs
      const existingGameIds = new Set(games.map(game => game.masterCasinoGameId));
      const uniqueNewGames = newGames.filter(
        game => !existingGameIds.has(game.masterCasinoGameId)
      );

      if (uniqueNewGames.length > 0) {
        setGames([...games, ...uniqueNewGames]);
        setCurrentPage(currentPage + 1); // Update the page count
      }
    } catch (error) {
      console.error("Error loading more games:", error);
      toast.error("Failed to load more games");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, games, setGames, setCurrentPage]);


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
      await updateGames(gameId);
      // const params = {
      //   page:  1,
      //   limit: ITEMS_PER_PAGE * currentPage,
      //   masterCasinoProviderId:id
      // };


      // const favoriteGames = await getCasinoGamesAction(params);
      // setGames(favoriteGames.rows || []);

    } catch (error) {
      console.error("Failed to update favorite:", error);
      toast.error("Failed to update favorite game");
    }
    finally{
      setIsLoading(false);
    }
  };

/*   const toggleFav = async (isFavorite, gameId) => {
    if (!isLoggedIn) {
      toast.error("Please login to add games to favorites");
      return;
    }

    try {
      await updateFavorite({ request: !isFavorite, gameId });
      // Remove the game from the list immediately
      const updatedGames = games.filter(game => game.masterCasinoGameId !== gameId);
      setGames(updatedGames);
      let totalFavoritesCount_ = totalFavoritesCount - 1
      setTotalFavoritesCount(totalFavoritesCount_);
    } catch (error) {
      console.error("Failed to update favorite:", error);
      toast.error("Failed to update favorite game");
    }
  }; */

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Image src={Crown} alt="Crown" className="w-6 h-6" />
          <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-white"><span className="capitalize">{name}</span> games</h2>
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
         }}>
          { games.length > 0 && games && games.map((game) => (
            <motion.div key={game.masterCasinoGameId}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}>
            <GameCard
              key={game.masterCasinoGameId}
              game={game}
              handleGameClick={() => handleGameClick(game.masterCasinoGameId)}
              toggleFav={() => toggleFav(game.FavoriteGames, game.masterCasinoGameId)}
            />
            </motion.div>
          ))}

        </motion.div>
        {games.length == 0  &&
            <span className=" ">No games found!</span>
          }

        {games.length < totalFavoritesCount && (
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
    </div>
  );
}
export default ProviderGameListing