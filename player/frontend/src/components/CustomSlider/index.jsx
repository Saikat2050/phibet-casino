"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
import Img1 from '../../assets/guest-lobby/img1.jpg';
import Img2 from '../../assets/guest-lobby/img2.jpg'
import Img3 from '../../assets/guest-lobby/img3.jpg'

const bannerTextContent = [
  {
    id: '1',
    img: Img1,
    heading: 'Dead or Alive2 Feature buy Dead or Alive2 Feature buy',
  },
  {
    id: '2',
    img: Img3,
    heading: 'Dead or Alive2 Feature buy',
  },
  {
    id: '3',
    img: Img3,
    heading: 'Dead or Alive2 Feature buy',
  },
  {
    id: '4',
    img: Img1,
    heading: 'Dead or Alive2 Feature buy Dead or Alive2 Feature buy',
  },
  {
    id: '5',
    img: Img3,
    heading: 'Dead or Alive2 Feature',
  },
  {
    id: '6',
    img: Img1,
    heading: 'Dead or Alive2 Feature buy',
  },
  {
    id: '7',
    img: Img3,
    heading: 'Dead or Alive2 Feature buy',
  },
  {
    id: '8',
    img: Img1,
    heading: 'Dead or Alive2 Feature buy',
  },
  {
    id: '9',
    img: Img3,
    heading: 'Dead or Alive2 Feature buy',
  }
]

const CustomSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      slidesToScroll: 1,
      align: "start",
      loop: true,
    },
    // [Autoplay({ playOnInit: true, delay: 30000, stopOnInteraction: false })],
    // [AutoScroll({ playOnInit: true, stopOnInteraction: false })]
  );

  return (
    <section className="banner-section">
      <div className="banner-wrap">
        <div className="embla">
          <div className="embla__viewport overflow-hidden pt-10 xl:pt-14 pb-10 px-2 xl:w-[calc(100%_+_1rem) xl:-ml-4" ref={emblaRef}>
            <div className="embla__container xl:-ml-0 xl:[&>.embla-slide]:px-3 -ml-0 [&>.embla-slide]:px-3 flex touch-pan-y touch-pinch-zoom [&>.embla-slide]:min-w-0 [&>.embla-slide]:flex-[0_0_calc(100%_/_6)] max-xl:[&>.embla-slide]:flex-[0_0_calc(100%_/_5)] max-nlg:[&>.embla-slide]:flex-[0_0_calc(100%_/_4)] max-md:[&>.embla-slide]:flex-[0_0_calc(100%_/_3)] max-sm:[&>.embla-slide]:flex-[0_0_calc(100%_/_3)] max-mxs:[&>.embla-slide]:flex-[0_0_calc(100%_/_2)] max-xxm:[&>.embla-slide]:flex-[0_0_calc(100%_/_1.1)] ">
              {bannerTextContent.map((item, index) => (
                <div className="embla__slide embla-slide group" key={index}>
                  <div className="border border-solid border-primary-border group-hover:shadow-slideShadow group-hover:border-secondary-400 rounded-md bg-background overflow-hidden cursor-pointer group-hover:scale-[1.05] xl:group-hover:scale-[1.12] origin-bottom transition-all duration-200 ease-in-out">
                    <div className="px-2 pt-2 pb-2.5 ">
                      <Image src={item.img} alt='' className="rounded-md mx-auto" />
                    </div>
                    <div className="relative ">
                      <span className="bg-secondary-500 group-hover:bg-tertiary-300 w-[88%] h-4.5 rounded-px_30 relative z-[1] flex mx-auto"></span>
                      <div className="-mt-4 bg-primary-50 transition-all duration-300 ease-in-out group-hover:bg-secondary-400 backdrop-blur-[36.13px] pt-3.5 px-3 pb-5 flex flex-col items-center justify-center relative z-[2]">
                        <h3 className=" w-full text-center text-white text-16 xl:text-18 !leading-tight font-bold line-clamp-2 h-11">{item.heading}</h3>
                        <p className="mt-3 text-12 text-tertiary-300 uppercase">Our original</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CustomSlider