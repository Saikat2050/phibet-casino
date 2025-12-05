'use client';
import BannerSection from "@/components/BannerSection";
import React from "react";
import CustomTabs from '../CustomTabs/index';
import AllGames from '../AllGames/index';
import RewardSection from '../RewardSection/index';
import GameProviderSlider from '../GameProviderSlider/index';
import DetailSection from '../DetailSection/index';


const NotLoggedInPage =  () => {

  return (
    <div className="">
      <BannerSection />
      <DetailSection />
      <CustomTabs />
      <AllGames />
      <RewardSection />
      <AllGames className="pt-0"/>
      <GameProviderSlider />
    </div>
  );
};

export default NotLoggedInPage;
