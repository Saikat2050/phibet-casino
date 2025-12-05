"use client";

import { getProfile, launchGame } from "@/actions";
import useUserStore from "@/store/useUserStore";

import { useRef, useState } from "react";
import { useEffect } from "react";
import Cross from "@/assets/images/Cross";
import { useRouter } from "next/navigation";
import useSubCategoryStore from "@/store/useSubCategoryStore";
import Link from "next/link";

export default function Page({ params }) {
  const {
    clearSearchedGames,
    setSearchTerm,
    setSelectedSubcategoryGames,
    setSelectedProvider,
    setSelectedProviderName,
  } = useSubCategoryStore();
  const [gameData, setGameData] = useState();
  const { selectedCoin, setUser } = useUserStore();
  const router = useRouter();

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef(null);

  const getGameData = async () => {
    const data = {
      gameId: +params.slug,
      coin: selectedCoin,
      // isMobile,
      // isDemo,
      // tournamentId,
    };
    try {
      const response = await launchGame(data);
      setGameData(response);
    } catch (error) {
      console.log(error, "::::::::::::::::::::::::::error 1233445");
    }
  };

  useEffect(() => {
    getGameData();
  }, [selectedCoin]);

  useEffect(() => {
    const showTooltip = () => setTooltipVisible(true);
    const hideTooltip = () => setTooltipVisible(false);

    const button = tooltipRef.current;
    if (button) {
      button.addEventListener("mouseenter", showTooltip);
      button.addEventListener("mouseleave", hideTooltip);
    }

    return () => {
      if (button) {
        button.removeEventListener("mouseenter", showTooltip);
        button.removeEventListener("mouseleave", hideTooltip);
      }
    };
  }, []);

  const handleBackToMenu = async () => {
    try {
      const userProfile = await getProfile();
      if (userProfile) {
        setUser(userProfile);
      }


      await clearSearchedGames();
      await setSearchTerm("");
      await setSelectedSubcategoryGames([]);
      await setSelectedProvider(null);
      await setSelectedProviderName("");

      setTimeout(() => router.replace("/"), 700);
    } catch (error) {
      console.error("Error in handleBackToMenu:", error);
    }
  };

  return (
    <div className="max-w-full h-[calc(100dvh_-_170px)] w-full ">
      <div className="relative flex justify-end">
        <button
          ref={tooltipRef}
          onClick={handleBackToMenu}
          className="inline-block cursor-pointer hover:rotate-90 transition-transform duration-200"
        >
          <Cross />
        </button>
        {tooltipVisible && (
          <div
            className="absolute top-full right-0 mt-0 transform -translate-x-1   text-white text-sm p-1 rounded flex justify-end"
            style={{ whiteSpace: "nowrap" }}
          >
            Back to menu
          </div>
        )}
      </div>
      <iframe
        src={gameData?.data?.gameUrl}
        frameborder="0"
        className="w-full h-full"
      ></iframe>
    </div>
  );
}
