import { getBanners, getProviderListing } from "@/actions";
import BannerSection from "@/components/BannerSection";
import React from "react";
// import TestimonialSlider from "./testimonial";

import cardOne from "../../../public/assets/img/png/chinaslots.png";
import cardTwo from "../../../public/assets/img/png/egyptgold.png";
import cardThree from "../../../public/assets/img/png/goldrushslots.png";
import cardFour from "../../../public/assets/img/png/santaslots.png";
import OperationImg from "../../../public/assets/img/png/usa-operation.png";
import SupportImg from "../../../public/assets/img/png/support-img.png";
import PromoGift from "../../../public/assets/img/png/promo-gift.png";
import ProviderOne from "../../../public/assets/img/png/provider-1.png";
import ProviderTwo from "../../../public/assets/img/png/provider-2.png";
import ProviderThree from "../../../public/assets/img/png/provider-3.png";
import ProviderFour from "../../../public/assets/img/png/provider-4.png";
import LabelOne from "../../../public/assets/img/png/label-1.png";
import LabelTwo from "../../../public/assets/img/png/label-2.png";
import LabelThree from "../../../public/assets/img/png/label-3.png";
import DemoGame from "../../components/DemoGame";
import GetStarted from "../../components/GetStarted";

import Image from "next/image";
import { SecondaryButton } from "@/components/Common/Button";
import GameCard from "@/components/GameCard";
import { useRouter } from "next/dist/client/router";
import useModalsStore from "@/store/useModalsStore";
import NotLoggedInPage from "../../components/NotLoggedInPage"

const Page = async () => {
  const bannersData = await getBanners();

  let promotionalBanner = [];
  if (bannersData) {
    if (Array.isArray(bannersData)) {
      promotionalBanner =
        (bannersData || []).filter(
          (banner) => banner.pageName === "promotionPage"
        ) || [];
    } else {
      promotionalBanner = [];
    }
  }

  let lobbySlider = [];
  if (bannersData) {
    if (Array.isArray(bannersData)) {
      lobbySlider =
        (bannersData || [])?.filter(
          (banner) => banner?.pageName == "lobbySlider"
        ) || [];
    } else {
      lobbySlider = [];
    }
  }

  const getAllProviders = await getProviderListing();

  const providerOptions = [
    { value: null, label: "All" },
    ...(getAllProviders && Array.isArray(getAllProviders)
      ? getAllProviders
          .filter((provider) => provider.isActive)
          .map((provider) => ({
            value: provider.masterCasinoProviderId,
            label: provider.name,
          }))
      : []),
  ];

  const providers = [
    { id: 1, image: ProviderOne, altText: "Red Rake Gaming" },
    { id: 2, image: ProviderTwo, altText: "Hacksaw Gaming" },
    { id: 3, image: ProviderThree, altText: "3 Oaks Gaming" },
    { id: 4, image: ProviderFour, altText: "Mancala Gaming" },
  ];

  const demoGamesList = [
    { id: 1, imageUrl: cardOne, name: "chinatownslot" },
    { id: 2, imageUrl: cardTwo, name: "egyptslot" },
    { id: 3, imageUrl: cardThree, name: "goldrushslot" },
    { id: 4, imageUrl: cardFour, name: "christmasslot" },
  ];

  return (
    <>
      <NotLoggedInPage />
    </>
  );
};

export default Page;
