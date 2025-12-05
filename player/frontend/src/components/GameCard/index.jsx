"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PrimaryButton } from "../Common/Button";
import Fav from "@/assets/images/Fav";
import FavBlank from "@/assets/images/FavBlank";
import GameCardDefaultImage from "@/assets/images/GameCard.svg";
import useUserStore from "@/store/useUserStore";
import { toast } from 'react-toastify';
import { isLoggedIn } from "@/utils/helper";

const GameCard = ({ game, handleGameClick, toggleFav, isDemo=false }) => {
  const { user } = useUserStore();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn());
  }, [user]);

  if (game?.imageUrl) {
    return (
      <div className="rounded-xl peer hover:shadow-gameHoverShadow relative overflow-hidden w-full">
        <Image
          src={game?.imageUrl}
          className="relative cursor-pointer rounded-xl w-full"
          alt={game?.name}
          width="10000"
          height="10000"
        />
        {!isDemo && (
          <div
            onClick={() =>
              toggleFav(game.FavoriteGames, game.masterCasinoGameId, game)
            }
            className="cursor-pointer absolute top-2 z-20 right-2 w-6 h-6   flex justify-center items-center rounded-full"
          >
            {isUserLoggedIn && game.FavoriteGames ? <Fav /> : <FavBlank />}
          </div>
        )}
        <div className='flex flex-col  00 items-center justify-center absolute top-0 left-0 w-full h-full z-10 opacity-0 peer-hover:z-10 hover:z-10 hover:opacity-100 peer-hover:opacity-100 after:content-[""] after:absolute after:w-full after:h-full after:shadow-gameHoverShadow after:z-[1] after:opacity-100 transition-all duration-200'>
          <div className="flex flex-col items-center justify-center flex-grow relative z-10">
            <PrimaryButton
              className=""
              onClick={() => {
                user?.isRestrict
                  ? toast.error(
                      "You are restricted, Please contact administrator"
                    )
                  : handleGameClick(game?.masterCasinoGameId);
              }}
            >
              Play
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl peer hover:shadow-gameHoverShadow relative overflow-hidden w-full">
      <Image
        src={GameCardDefaultImage}
        className="relative cursor-pointer rounded-xl w-full "
        alt={game?.name}
        width="10000"
        height="10000"
      />
      {!isDemo && (
        <div
          onClick={() =>
            toggleFav(game.FavoriteGames, game.masterCasinoGameId, game)
          }
          className="cursor-pointer absolute top-2  z-20 right-2 w-6 h-6   flex justify-center items-center rounded-full"
        >
          {isUserLoggedIn && game.FavoriteGames ? <Fav /> : <FavBlank />}
        </div>
      )}
      <div className='flex flex-col  00 items-center justify-center absolute top-0 left-0 w-full h-full z-10 opacity-0 peer-hover:z-10 hover:z-10 hover:opacity-100 peer-hover:opacity-100 after:content-[""] after:absolute after:w-full after:h-full after:shadow-gameHoverShadow after:z-[1] after:opacity-100 transition-all duration-200'>
        <div className="flex flex-col items-center justify-center flex-grow relative z-10">
          <PrimaryButton
            className=""
            onClick={() => {
              user?.isRestrict
                ? toast.error(
                    "You are restricted, Please contact administrator"
                  )
                : handleGameClick(game?.masterCasinoGameId);
            }}
          >
            Play
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
