'use client'
import PromoIcon from '@/assets/images/menuBottom/PromoIcon'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ShowCoinPackageMoal from '../ShowCoinsPackagesModal';
import useModalsStore from '@/store/useModalsStore';
import CompleteYourProfileModal from '../CompleteYourProfileModal';
import useUserStore from '@/store/useUserStore';
import CompletedKycModal from "../CompleteKycModal";
const BuyCoinMobileComponent = ({userPackages}) => {
    const { openModal } = useModalsStore();

    const [CoinsPackages, setCoinsPackages] = useState(userPackages || []);
    const {
      user
    } = useUserStore();

    useEffect(() => {
        setCoinsPackages(userPackages);
    }, [userPackages])
    

    // const hasIncompleteProfile = user?.kycStatus === "K1" || user?.kycStatus === "K2" || !user?.phoneVerified;
    const hasIncompleteProfile = user?.profileCompleted == false || user?.phoneVerified == false;
    // const hasIncompleteKyc = user?.kycStatus === "K2" || user?.kycStatus === "K3";
    const handleBuyButtonClick = () => {

        // openModal(<CoinsPackage />)
       
          // openModal(
          //   <ShowCoinPackageMoal close={true} CoinsPackages={CoinsPackages} />
          // );
          if (
            hasIncompleteProfile
          ) {
            openModal(<CompleteYourProfileModal close={true} />);
          } else {
            openModal(
              <ShowCoinPackageMoal close={true} CoinsPackages={CoinsPackages} />
            );
          }
       
      };
  return (
    <div onClick={handleBuyButtonClick} className="text-center font-bold text-[13px] leading-[18px] flex flex-col items-center justify-center gap-y-2 mb-1">
    <PromoIcon />
    Buy Coin
  </div>
  )
}

export default BuyCoinMobileComponent