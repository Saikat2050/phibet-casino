"use client";

import React from 'react'
import GameIcon from '../../assets/icons/GameIcon'
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names'
import { NextButton, PrevButton, usePrevNextButtons } from '../GameProviderSlider/EmblaCarouselArrowButtons'
import Image from 'next/image'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import HeroGirlImg from '../../assets/guest-lobby/hero-girl-img.webp'
import { PrimaryButton } from "../Common/Button";

const heroSlide = [
  {
    id: '1',
    img: HeroGirlImg,
  },
  {
    id: '2',
    img: HeroGirlImg,
  },
  {
    id: '3',
    img: HeroGirlImg,
  },
]

const HeroSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 1,
    align: "start",
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)


  return (
    <section className='relative'>
        <div className="embla grow">
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div className="embla__container -ml-7 max-mxs:-ml-2 flex touch-pan-y touch-pinch-zoom [&>.embla-slide]:pl-7 max-mxs:[&>.embla-slide]:pl-2 [&>.embla-slide]:min-w-0 [&>.embla-slide]:flex-[0_0_calc(100%_/_1)] ">
              {heroSlide.map((item, index) => (
                <div className="embla__slide embla-slide flex items-center justify-center bg-heroBgImg bg-no-repeat bg-right bg-cover" key={index}>
                  <div className="max-w-container-width w-full mx-auto px-4 grid grid-cols-2 gap-5 pt-10">
                    <div className='pt-10'>
                      <p className='text-24 2xl:text-34 text-white pb-3 font-extralight'>WELCOME <span className='font-medium text-transparent bg-clip-text bg-heroTextGradient'>PhiBet</span></p>
                      <h2 className='text-white text-48 2xl:text-64 font-black'>MULTIPLY YOUR WINS</h2>
                      <p className='text-tertiary-300 text-48 2xl:text-64 font-black'>TRY YOUR LUCK</p>
                      <p className='text-24 2xl:text-28 text-secondary-600 font-normal'>+1 BONUS CARD</p>
                      <PrimaryButton className='max-w-44 w-full mt-6'>play now</PrimaryButton>
                    </div>
                    <div className="flex items-end justify-center relative">
                      <Image src={item.img} alt='img' className="max-w-[50.6875rem] w-full relative" />
                      <span className='absolute w-full h-[4.3125rem] bottom-0 left-0 bg-heroImgOverly'></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="embla__dots flex justify-center items-center gap-1 absolute bottom-[2%] left-1/2 -translate-x-1/2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot transition-all duration-300 ease-in-out '.concat(
                index === selectedIndex ? ' embla__dot--selected bg-secondary-500 w-[4.5rem] h-1 rounded-2xl' : ' bg-secondary-200 w-4 h-1 rounded-2xl'
              )}
            />
          ))}
        </div>
        </div>

        <div className='absolute z-[2] flex gap-5 bottom-[5%] left-[10%]'>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
    </section>
  )
}

export default HeroSlider