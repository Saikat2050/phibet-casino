import React from 'react'
import GameIcon from '../../assets/icons/GameIcon'
import Image from 'next/image'
import Game1 from '../../assets/guest-lobby/game1.jpg'
import Game2 from '../../assets/guest-lobby/game2.jpg'
import Game3 from '../../assets/guest-lobby/game3.jpg'
import Game4 from '../../assets/guest-lobby/game4.jpg'
import Game5 from '../../assets/guest-lobby/game5.jpg'
import Game6 from '../../assets/guest-lobby/game6.jpg'
import Game7 from '../../assets/guest-lobby/game7.jpg'
import Game8 from '../../assets/guest-lobby/game8.jpg'
import Game9 from '../../assets/guest-lobby/game9.jpg'

const gameGrid = [
  {
    id: '1',
    img: Game1,
  },
  {
    id: '2',
    img: Game2,
  },
  {
    id: '3',
    img: Game3,
  },
  {
    id: '4',
    img: Game4,
  },
  {
    id: '5',
    img: Game5,
  },
  {
    id: '6',
    img: Game6,
  },
  {
    id: '7',
    img: Game7,
  },
  {
    id: '8',
    img: Game8,
  },
  {
    id: '9',
    img: Game9,
  },
  {
    id: '10',
    img: Game1,
  },
  {
    id: '11',
    img: Game2,
  },
  {
    id: '12',
    img: Game3,
  },
  {
    id: '13',
    img: Game4,
  },
  {
    id: '14',
    img: Game5,
  },
]

const AllGames = ({className=''}) => {
  return (
    <section className={`max-w-container-width w-full mx-auto px-4 pt-5 ${className}`}>
      <h4 className='text-26 text-whtie font-medium capitalize flex items-center gap-3.5'>
        <span className='bg-primary-50 border border-solid border-primary-border rounded size-9.5 flex items-center justify-center p-1'><GameIcon className='size-6.5' /></span>
        All Game
      </h4>

      <div className='mt-5'>
        <div className='bg-dividerLineGradient h-px w-full'></div>
        <div className='relative'>
          <div className='absolute top-0 left-0 bg-dividerBgGradient h-[27.8125rem] w-full opacity-40'></div>
          <div className='flex items-center gap-3 sm:gap-5.5 justify-center flex-wrap relative z-[2] py-6 sm:py-10 lg:py-16 2xl:py-20'>
            {gameGrid.map((item, index) => (
              <div className='basis-[calc(100%_/_2_-_0.5rem)] xxm:basis-[calc(100%_/_3_-_0.5rem)] sm:basis-[calc(100%_/_4_-_1.1875rem)] md:basis-[calc(100%_/_5_-_1.1875rem)] lg:basis-[calc(100%_/_6_-_1.1875rem)] xl:basis-[calc(100%_/_7_-_1.1875rem)]' key={index}>
                <Image src={item.img} alt='game image' className='rounded-md' />
              </div>
            ))}
          </div>
          <div className='absolute bottom-0 left-0 bg-dividerBgGradient h-[27.8125rem] w-full opacity-40 -rotate-180'></div>
        </div>
        <div className='bg-dividerLineGradient h-px w-full'></div>
      </div>
    </section>
  )
}

export default AllGames