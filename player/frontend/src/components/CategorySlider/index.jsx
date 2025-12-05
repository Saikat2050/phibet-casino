"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import useSubCategoryStore from "@/store/useSubCategoryStore";
import { getSubCategories } from "@/actions";
import LobbyIcon from "../../../public/assets/img/svg/category-img/LobbyIcon";
import Image from "next/image";

function CategorySlider(props) {
  const {
    setSubcategoriesData,
    subCategoriesData,
    setSelectedSubcategoryGames,
    clearSearchedGames,
    setSelectedProvider,
    setSearchTerm,
    setSelectedProviderName,
    selectedProviderId,
    setMasterGameSubCategoryId,
    setMasterGameSubCategoryName,
  } = useSubCategoryStore();
  /*   const { setSelectedProvider, fetchGames ,searchTerm,clearSearchedGames,setSearchTerm,setSelectedSubcategoryGames,setSelectedProviderName} = useSubCategoryStore(); */

  // Initialize with proper options for visibility calculation
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Lobby");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (selectedProviderId) {
      setSelectedCategory("Lobby");
    }
  }, [selectedProviderId]);

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const subCategories = await getSubCategories();
        if (subCategories) {
          setSubcategoriesData(subCategories);

          const lobbyCategory = {
            name: "Lobby",
            icon: LobbyIcon,
          };

          const mappedCategories = (subCategories || []).map((subCategory) => ({
            name: subCategory?.name?.EN,
            icon: subCategory?.imageUrl?.thumbnail,
            masterGameSubCategoryId: subCategory?.masterGameSubCategoryId,
          }));

          setCategories([lobbyCategory, ...mappedCategories]);
        }
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
      }
    };
    fetchSubCategory();
  }, [setSubcategoriesData]);
  useEffect(() => {
    const fetchAndSetSubcategories = async () => {
      if (selectedCategory !== "Lobby") {
        const matchingCategory = subCategoriesData?.find(
          (category) => category.name.EN === selectedCategory
        );

        if (matchingCategory) {
          const params = {
            page: 1,
            limit: 24,
            subCategoryId: matchingCategory?.masterGameSubCategoryId,
          };

          try {
            const subCategories = await getSubCategories(params);
            setSelectedSubcategoryGames(subCategories[0]?.subCategoryGames);
          } catch (error) {
            console.error("Error fetching subcategories:", error);
          }
        }
      } else {
        setSelectedSubcategoryGames([]);
      }
    };
    fetchAndSetSubcategories();
  }, [selectedCategory, subCategoriesData, setSelectedSubcategoryGames]);

  // Update scroll buttons visibility
  const updateScrollButtons = useCallback(() => {
    if (!emblaApi) return;

    const scrollSnaps = emblaApi.scrollSnapList();
    const currentIndex = emblaApi.selectedScrollSnap();

    setCanScrollPrev(currentIndex > 0);
    setCanScrollNext(currentIndex < scrollSnaps.length - 1);
  }, [emblaApi]);

  // Scroll functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", updateScrollButtons);
    emblaApi.on("reInit", updateScrollButtons);
    updateScrollButtons();

    return () => {
      emblaApi.off("select", updateScrollButtons);
      emblaApi.off("reInit", updateScrollButtons);
    };
  }, [emblaApi, updateScrollButtons]);

  return (
    <div className={`${props?.className} w-full mx-auto relative`}>
      <div className="flex items-center">
        {canScrollPrev && (
          <button
            className="hidden absolute z-[1] -left-3 bottom-2 h-[40px] w-[40px] sm:flex items-center rounded-lg justify-center text-white bg-transparent hover:text-white"
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
        )}

        <div className="embla w-full mx-4">
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div className="embla__container -ml-2 flex [&>.embla-slide]:pl-2 [&>.embla-slide]:min-w-0 [&>.embla-slide]:flex-[0_0_calc(100%_/_8)] max-xl:[&>.embla-slide]:flex-[0_0_calc(100%_/_6)] max-lg:[&>.embla-slide]:flex-[0_0_calc(100%_/_5)] max-md:[&>.embla-slide]:flex-[0_0_calc(100%_/_3)] max-sm:[&>.embla-slide]:flex-[0_0_calc(100%_/_2)]">
              {categories.map((category, index) => {
                return (
                  <div className="embla__slide embla-slide" key={index}>
                    <div className="embla__slide__inner embla-slide-inner pt-9">
                      <div
                        onClick={async () => {
                          setSelectedCategory(category.name);
                          await setMasterGameSubCategoryId(
                            category.masterGameSubCategoryId
                          );
                          await setMasterGameSubCategoryName(category.name);
                          await clearSearchedGames();
                          await setSearchTerm("");
                          // await setSelectedSubcategoryGames([])
                          await setSelectedProvider(null);
                          await setSelectedProviderName("");
                        }}
                        className={`cursor-pointer relative rounded-lg p-1.5 h-14 w-full flex items-center flex-col justify-end gap-3 hover:bg-white ${
                          selectedCategory === category.name
                            ? "bg-white"
                            : "  hover:scale-105 hover:shadow-lg transition-transform duration-300"
                        }`}
                      >
                        {category.name === "Lobby" ? (
                          <LobbyIcon className=" w-12 h-16 absolute -top-8 " />
                        ) : (
                          <Image
                            src={category.icon}
                            width={40}
                            height={40}
                            alt={`${category.name} icon`}
                            className="absolute -top-5"
                          />
                        )}
                        <h2 className="text-xs font-bold text-white capitalize">
                          {category.name}
                        </h2>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {canScrollNext && (
          <button
            className="hidden absolute z-[1] -right-3 bottom-2 h-[40px] w-[40px] sm:flex items-center rounded-lg justify-center text-white bg-transparent hover:text-white"
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
        )}
      </div>
    </div>
  );
}

export default CategorySlider;
