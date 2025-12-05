"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import Crown from "@/assets/images/casino/crown.svg";
import { useRouter } from "next/navigation";
import { updateFavorite } from "@/actions";
import SliderImg from "../../../public/assets/img/jpg/coin-img1.jpg";
import GCIcon from "../../../public/assets/img/svg/GCIcon";
import useUserStore from "@/store/useUserStore";
import { toast } from 'react-toastify';
import { revalidateCategory } from "@/actions";
function GameCoinSlider(props) {
  const { isLoggedIn } = useUserStore();
  const router = useRouter();
  const [subCategoryGames, setSubCategoryGames] = useState(
    props?.subCategoryGames
  ); // Initialize state with props data
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 2,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
    router.push(`/game/${gameId}`);
  };

  const toggleFav = async (isFavorite, gameId, game) => {
    if (!isLoggedIn) {
      toast.error("Please login to add games to favorites");
    }
    try {
      // Call the API to toggle the favorite status
      await updateFavorite({ request: !isFavorite, gameId });

      // Update the local state to reflect the new favorite status
      const updatedGames = subCategoryGames.map((g) =>
        g.masterCasinoGameId === gameId
          ? { ...g, FavoriteGames: !g.FavoriteGames } // Toggle the favorite status in the local state
          : g
      );
      setSubCategoryGames(updatedGames); // Update the state with the modified data
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };
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
              href={`/category/${props?.title?.split(" ").join("-")}`}
              className="embla__button embla__button--prev text-white   h-[40px] w-fit px-2.5 flex items-center rounded-lg justify-center"
              prefetch={true}
              onClick={handleRevalidate(`/category/${props?.title?.split(" ").join("-")}`)}
            >
              See all
            </Link>
            <button
              className="hidden md:flex embla__button embla__button--prev text-white   h-[40px] w-[40px] items-center rounded-lg justify-center"
              onClick={scrollPrev}
            >
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
            </button>
            <button
              className="hidden md:flex embla__button embla__button--next text-white   h-[40px] w-[40px] rounded-lg items-center justify-center"
              onClick={scrollNext}
            >
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
            </button>
          </div>
        </div>
      </div>
      <div className="embla m-auto overflow-hidden py-4">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container -ml-8 flex touch-pan-y touch-pinch-zoom [&>.embla-slide]:pl-8 [&>.embla-slide]:min-w-0 [&>.embla-slide]:flex-[0_0_calc(100%_/_8)] max-xl:[&>.embla-slide]:flex-[0_0_calc(100%_/_6)] max-lg:[&>.embla-slide]:flex-[0_0_calc(100%_/_5)] max-md:[&>.embla-slide]:flex-[0_0_calc(100%_/_3)] max-sm:[&>.embla-slide]:flex-[0_0_calc(100%_/_2)]">
            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className={`embla__slide embla-slide `}>
              <div className="embla__slide__inner embla-slide-inner">
                <div className="embla__slide__content rounded-lg   text-center">
                  <Image
                    src={SliderImg}
                    width={1000}
                    height={1000}
                    alt=""
                    className="rounded-lg"
                  />
                  <div className="pt-4 pb-2.5 px-1">
                    <p className="text-orangeShade-1 flex items-center gap-1 justify-center text-xl font-bold">
                      <GCIcon /> 100
                    </p>
                    <h6 className="text-sm mt-2 max-w-24 mx-auto font-bold text-white capitalize">
                      Clark Kent
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCoinSlider;
