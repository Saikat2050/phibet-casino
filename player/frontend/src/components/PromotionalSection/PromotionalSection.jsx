"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getBanners } from "@/actions";
import useUserStore from "@/store/useUserStore";
import useEmblaCarousel from "embla-carousel-react";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import ShowPromotionalSection from "./ShowPromotionalSection";
import { getCookie } from "@/utils/clientCookieUtils";
const PromotionalSection = ({ promotionalBanner }) => {
  const { isLoggedIn, user } = useUserStore();
  const [banners] = useState(() => promotionalBanner || []);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 2,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const trackConsentEvent = () => {
    const consentStatus = localStorage.getItem("cookie_consent");
    const cookieConsentStatus = getCookie("cookie_consent");
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "consent",
        cookie_consent: consentStatus
          ? consentStatus
          : cookieConsentStatus == true
          ? "accepted"
          : cookieConsentStatus == false
          ? "declined"
          : null,
        user_id: user?.userId || "anonymous",
      });
    }
  };

  const scrollSnaps = useMemo(
    () => emblaApi?.scrollSnapList() || [],
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", onSelect);
      return () => emblaApi.off("select", onSelect);
    }
  }, [emblaApi, onSelect]);

  useEffect(() => {
    trackConsentEvent();
  }, []);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col items-center relative mb-10">
      <div className="embla m-auto w-full">
        <div className="embla__viewport overflow-hidden" ref={emblaRef}>
          <div className="embla__container -ml-5 max-xl:-ml-5 max-md:-ml-2.5 flex touch-pan-y touch-pinch-zoom [&>.embla-slide]:pl-5 max-xl:[&>.embla-slide]:pl-5 max-md:[&>.embla-slide]:pl-2.5  [&>.embla-slide]:min-w-0 [&>.embla-slide]:flex-[0_0_calc(100%_/_3)] max-xl:[&>.embla-slide]:flex-[0_0_calc(100%_/_3)] max-lg:[&>.embla-slide]:flex-[0_0_calc(100%_/_3)] max-md:[&>.embla-slide]:flex-[0_0_calc(100%_/_2)] max-sm:[&>.embla-slide]:flex-[0_0_calc(100%_/_2)] max-xxs:[&>.embla-slide]:flex-[0_0_calc(100%_/_1)]">
            {banners.map((banner, index) => {
              return (
                <div
                  className={`embla__slide embla-slide ${
                    index === selectedIndex ? "is-selected" : ""
                  }`}
                  key={index}
                >
                  <div className="embla__slide__inner embla-slide-inner h-full">
                    <ShowPromotionalSection
                      image_url={banner.desktopImageUrl}
                      name={banner.name}
                      description={banner.textThree}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center gap-2 mt-4">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className="flex items-center justify-center p-1 focus:outline-none"
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === selectedIndex ? (
              <FaCircle className="w-3 h-3 text-white" />
            ) : (
              <FaRegCircle className="w-3 h-3 text-slate-300" />
            )}
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default PromotionalSection;
