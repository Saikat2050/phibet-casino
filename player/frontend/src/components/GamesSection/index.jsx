"use client";
import { useEffect, useState } from "react";
import GameCard from "../GameCard";
import PromotionalSection from "../PromotionalSection/PromotionalSection";
import GameSlider from "../GameSlider";
import useSubCategoryStore from "@/store/useSubCategoryStore";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import useModalsStore from "@/store/useModalsStore";
import {
  getSubCategories,
  revalidateCategory,
  updateFavorite,
} from "@/actions";
import { toast } from 'react-toastify';
import Login from "../Auth/Login";
import Link from "next/link";
import { getCookie } from "@/utils/clientCookieUtils";
import { useGettingSlugName } from "@/store/useGettingSlug";
import useGamesStore from "@/store/useGameStore";
import { motion } from "framer-motion";

function GamesSection({ subCategories }) {
  const {
    selectedSubcategoryGames,
    searchedGames,
    isSearched,
    searchTerm,
    selectedProviderId,
    fetchGames,
    selectedProviderName,
    masterGameSubCategoryTitle,
    masterGameSubCategoryId,
    setSelectedSubcategoryGames,
  } = useSubCategoryStore();
  const { setParamsName } = useGettingSlugName();
  const [subCatShow, setSubCatShow] = useState(subCategories);
  const { isLoggedIn } = useUserStore();
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await getSubCategories();
        setSubCatShow(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories(); // Call the function here, outside itself
  }, [isLoggedIn]);
  const { openModal } = useModalsStore();
  const router = useRouter();
  const userToken = getCookie("accessToken");
  const handleGameClick = (gameId) => {
    if (userToken) {
      router.push(`/game/${gameId}`);
    } else {
      toast.error("Please login to play this game.");
      openModal(<Login />);
    }
  };

  const toggleFav = async (isFavorite, gameId, game) => {
    if (!userToken) {
      toast.error("Please login to add games to favorites");
      return;
    }
    try {
      await updateFavorite({ request: !isFavorite, gameId });
      if (
        !selectedProviderId &&
        masterGameSubCategoryTitle !== "Lobby" &&
        masterGameSubCategoryTitle !== ""
      ) {
        const params = {
          page: 1,
          limit: 24,
          subCategoryId: masterGameSubCategoryId,
        };
        const result = await getSubCategories(params);
        // setSubCatShow(result?.subCategoryGames)
        setSelectedSubcategoryGames(result[0]?.subCategoryGames);
      }
      fetchGames();
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const handleRevalidate = async (path) => {
    // const path = `/category/${title?.split(" ").join("-")}`;
    await revalidateCategory(path);
  };

  const renderGames = (games) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1, // Adds delay between each child animation
        },
      },
    };




    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
      <>
        <motion.div
          className="grid grid-cols-8 text-white gap-4 max-mxs:gap-2 max-xl:grid-cols-7 max-lg:grid-cols-6 max-md:grid-cols-4 max-mxs:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {games?.map((game, i) => (
            <motion.div
              key={i}
              className="embla__slide__content"
              variants={itemVariants}
            >
              <GameCard
                game={game}
                handleGameClick={handleGameClick}
                toggleFav={toggleFav}
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="mt-9">
          {/* href={{
            pathname: `/category/${props?.title?.split(" ").join("-")}`,
            query: { id: props.masterGameSubCategoryId },
          }} */}
          {selectedSubcategoryGames?.length !== 0 && selectedProviderId ? (
            <Link
              href={{
                pathname: `/provider`,
                query: { id: selectedProviderId, name: selectedProviderName },
              }}
              onClick={() =>
                handleRevalidate(
                  `/provider?id=${selectedProviderId}&name=${selectedProviderName}`
                )
              }
              className="embla__button embla__button--prev  100 hover:text-white   h-[40px] w-fit px-2.5 flex items-center rounded-lg justify-center border border-green-600 hover:border-green-300 transition"
            >
              See all
            </Link>
          ) : (
            selectedSubcategoryGames?.length !== 0 &&
            masterGameSubCategoryId && (
              <Link
                href={{
                  pathname: `/category/${masterGameSubCategoryTitle
                    ?.split(" ")
                    .join("-")}`,
                  query: { id: masterGameSubCategoryId },
                }}
                // onClick={() => {handleRevalidate(`/category/${props?.title?.split(" ").join("-")}`);setParamsName(props?.title?.split(" ").join("-"))}}
                onClick={() => {

                  handleRevalidate(
                    `/category/${masterGameSubCategoryTitle}`
                  );
                  setParamsName(masterGameSubCategoryTitle?.split(" ").join("-"));
                }}
                className="embla__button embla__button--prev  100 hover:text-white   h-[40px] w-fit px-2.5 flex items-center rounded-lg justify-center border border-green-600 hover:border-green-300 transition"
              >
                See all
              </Link>
            )
          )}
        </motion.div>
      </>
    );
  };

  if (isSearched && searchTerm) {
    return renderGames(searchedGames.rows);
  }

  if (selectedSubcategoryGames && selectedSubcategoryGames?.length > 0) {
    return renderGames(selectedSubcategoryGames);
  }

  if (
    selectedSubcategoryGames &&
    selectedSubcategoryGames?.length == 0 &&
    selectedProviderId
  ) {
    fetchGames();
    return renderGames(selectedSubcategoryGames);
  }

  const toggleFavSubCat = async (isFavorite, gameId, game) => {
    if (!isLoggedIn) {
      toast.error("Please login to add games to favorites");
    }
    try {
      // Call the API to toggle the favorite status
      await updateFavorite({ request: !isFavorite, gameId });
      const subCategories = await getSubCategories();
      setSubCatShow(subCategories);
      // Update the local state to reflect the new favorite status
      /*  const updatedGames = subCategoryGames.map((g) =>
         g.masterCasinoGameId === gameId
           ? { ...g, FavoriteGames: !g.FavoriteGames }
           : g
       );
       setSubCategoryGames(updatedGames);  */
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {subCatShow?.length >= 1 &&
        subCatShow?.map((subCategory, i) => (
          <div key={i}>
            {/* {i === 2 && <PromotionalSection />} */}
            <GameSlider
              icon={subCategory.imageUrl?.thumbnail}
              title={subCategory?.name?.EN}
              masterGameSubCategoryId={subCategory.masterGameSubCategoryId}
              subCategoryGames={subCategory.subCategoryGames}
              toggleFavSubCat={toggleFavSubCat}
            />
          </div>
        ))}
    </div>
  );
}

export default GamesSection;
