"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import Crown from "@/assets/images/casino/crown.svg";
import { useRouter } from "next/navigation";
import { getSubCategories, updateFavorite } from "@/actions";
import GameCard from "../GameCard";
import useUserStore from "@/store/useUserStore";
import useModalsStore from "@/store/useModalsStore";
import Login from "../Auth/Login";
import { toast } from 'react-toastify';
import { useGettingSlugName } from "@/store/useGettingSlug";
import { revalidateCategory } from "@/actions";
function GameSlider(props) {
  const { openModal } = useModalsStore();
  const { isLoggedIn } = useUserStore();
  const { setParamsName } = useGettingSlugName();
  const router = useRouter();
  const [subCategoryGames, setSubCategoryGames] = useState(
    props?.subCategoryGames
  ); // Initialize state with props data

  useEffect(() => {
    setSubCategoryGames(props?.subCategoryGames)
  }, [props])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 2,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleGameClick = (gameId) => {
    if (isLoggedIn) {
      router.push(`/game/${gameId}`);
    } else {
      toast.error("Please login to play this game.");
      openModal(<Login />);
    }
  };

  const toggleFav = async (isFavorite, gameId, game) => {

    if (!isLoggedIn) {
      toast.error("Please login to add games to favorites");
    } else {
      props.toggleFavSubCat(isFavorite, gameId, game);
    }
/*     try {
      await updateFavorite({ request: !isFavorite, gameId });
      const subCategories = await getSubCategories();

      const updatedGames = subCategoryGames.map((g) =>
        g.masterCasinoGameId === gameId
          ? { ...g, FavoriteGames: !g.FavoriteGames }
          : g
      );
      setSubCategoryGames(updatedGames);
    } catch (error) {
      console.error("Failed to update favorite:", error);
    } */
  };
  // const handleRevalidate = () => {
  //   router.refresh();
  // };
  const handleRevalidate = async (path) => {
    // const path = `/category/${title?.split(" ").join("-")}`;
    await revalidateCategory(path);
  };

  return (
    <div className={`${props?.className} w-full mx-auto`}>
      <div className="flex justify-between item mb-3">
        <div className="flex items-center gap-2">
          <Image src={props.icon || Crown} width={32} height={32} alt="" />
          <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-white">
            {props?.title}
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-4">
            <Link
              href={{
                pathname: `/category/${props?.title?.split(" ").join("-")}`,
                query: { id: props.masterGameSubCategoryId },
              }}
              onClick={() => {handleRevalidate(`/category/${props?.title?.split(" ").join("-")}`);setParamsName(props?.title?.split(" ").join("-"))}}
              className="embla__button embla__button--prev  100 hover:text-white   h-[40px] w-fit px-2.5 flex items-center rounded-lg justify-center border border-green-600 hover:border-green-300 transition"
              prefetch={true}
              // onClick={handleRevalidate}
            >
              See all
            </Link>
            <button
              className={`hidden md:flex embla__button embla__button--prev border ${canScrollPrev
                  ? "text-white   hover:border-green-300 hover:text-white transition"
                  : " 00  00 cursor-not-allowed"
                } h-[40px] w-[40px] items-center rounded-lg justify-center`}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
            >
              {canScrollPrev ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="opacity-50"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              )}
            </button>
            <button
              className={`hidden md:flex embla__button embla__button--next border ${canScrollNext
                  ? "text-white   hover:border-green-300 hover:text-white transition"
                  : " 00  00 cursor-not-allowed"
                } h-[40px] w-[40px] rounded-lg items-center justify-center`}
              onClick={scrollNext}
              disabled={!canScrollNext}
            >
              {canScrollNext ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="opacity-50"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="embla m-auto overflow-hidden py-4">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container -ml-5 max-mxs:-ml-2 flex touch-pan-y touch-pinch-zoom [&>.embla-slide]:pl-5 max-mxs:[&>.embla-slide]:pl-2 [&>.embla-slide]:min-w-0 [&>.embla-slide]:flex-[0_0_calc(100%_/_8)] max-xl:[&>.embla-slide]:flex-[0_0_calc(100%_/_7)] max-lg:[&>.embla-slide]:flex-[0_0_calc(100%_/_6)] max-md:[&>.embla-slide]:flex-[0_0_calc(100%_/_5)] max-sm:[&>.embla-slide]:flex-[0_0_calc(100%_/_4)] max-mxs:[&>.embla-slide]:flex-[0_0_calc(100%_/_3)] ">
            {subCategoryGames?.map((game, index) => {

              return (
                <div
                  className={`embla__slide embla-slide ${index === selectedIndex ? "is-selected" : ""
                    }`}
                  key={index}
                >
                  <div className="embla__slide__inner embla-slide-inner">
                    <div className="embla__slide__content">
                      <GameCard
                        game={game}
                        handleGameClick={handleGameClick}
                        toggleFav={toggleFav}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameSlider;
