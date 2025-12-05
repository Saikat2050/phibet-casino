"use client";

import React from 'react'
import GameIcon from '../../assets/icons/GameIcon'
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import Image from 'next/image'
import Img1 from '../../assets/guest-lobby/game-provider-img/evolution-img.webp'
import Img2 from '../../assets/guest-lobby/game-provider-img/microgaming-img.webp'
import Img3 from '../../assets/guest-lobby/game-provider-img/netent-img.webp'
import Img4 from '../../assets/guest-lobby/game-provider-img/playgo-img.webp'
import Img5 from '../../assets/guest-lobby/game-provider-img/pragmaticpaly-img.webp'
import Img6 from '../../assets/guest-lobby/game-provider-img/relagaming-img.webp'

const gameProviderSlide = [
    {
        id: '1',
        img: Img1,
    },
    {
        id: '2',
        img: Img2,
    },
    {
        id: '3',
        img: Img3,
    },
    {
        id: '4',
        img: Img4,
    },
    {
        id: '5',
        img: Img5,
    },
    {
        id: '6',
        img: Img6,
    },
    {
        id: '7',
        img: Img1,
    },
]

const GameProviderSlider = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        slidesToScroll: 1,
        align: "start",
      });

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className='max-w-container-width w-full mx-auto px-4 my-12'>
            <h4 className='text-26 text-whtie font-medium capitalize flex items-center gap-3.5 pb-4 md:pb-8 xl:pb-11'>
                <span className='bg-primary-50 border border-solid border-primary-border rounded size-9.5 flex items-center justify-center p-1'>
                    <GameIcon className='size-6.5' />
                </span>
                Providers
            </h4>

            <div className='flex items-center gap-4'>
                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                <div className="embla grow">
                    <div className="embla__viewport overflow-hidden" ref={emblaRef}>
                        <div className="embla__container  flex touch-pan-y touch-pinch-zoom -ml-7 [&>.embla-slide]:pl-7 max-xl:-ml-2 max-xl:[&>.embla-slide]:pl-2 [&>.embla-slide]:min-w-0 [&>.embla-slide]:flex-[0_0_calc(100%_/_6)] max-xl:[&>.embla-slide]:flex-[0_0_calc(100%_/_5)]  max-md:[&>.embla-slide]:flex-[0_0_calc(100%_/_4)] max-sm:[&>.embla-slide]:flex-[0_0_calc(100%_/_3)] max-mxs:[&>.embla-slide]:flex-[0_0_calc(100%_/_2)] ">
                            {gameProviderSlide.map((item, index) => (
                                <div className="embla__slide embla-slide flex items-center justify-center" key={index}>
                                    <div className='relative max-w-[20rem] w-full aspect-[23_/_14] provider-box-mask'>
                                            <Image src={item.img} alt='provider image' className='max-w-[20rem] w-full aspect-[23_/_14]'/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>
        </section>
    )
}

export default GameProviderSlider