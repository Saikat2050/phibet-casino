/* import React from 'react'
import Image from "next/image";
import ClubImg from "../../assets/images/promotion/clubImg.png";
const ShowPromotionalSection = ({image_url,name,description}) => {
  return (
    <>
     <div className="max-w-mw406 max-xl:max-w-none w-full rounded-lg relative pb-7 pt-[1px] bg-pc1 bg-cover bg-center text-center h-full">
    <div className="mx-auto px-6 max-xl:px-3 pb-11">
      <Image
        src={image_url ||ClubImg}
        className="mt-[-3.563rem] mx-auto max-w-[266px] max-xl:max-w-[200px] w-full"
        width={266} 
          height={200} 
        alt="logo"
      />
      <h2 className="text-center text-[2.5rem] max-2xl:text-[2.125rem] max-md:text-3xl font-bold text-white mb-[1.25rem] font-geometrics-bold uppercase">
        {name}
      </h2>
      <p className="text-center text-xl max-2xl:text-base font-bold text-white mb-[1.25rem] mx-auto w-full max-w-[18.25rem]">
      {description}
      </p>
     
    </div>
    </div>
  
   </>
  )
}

export default ShowPromotionalSection */

import React from "react";
import Image from "next/image";
import ClubImg from "../../assets/images/promotion/clubImg.png";
import PinkBlueGradient from "../../../public/assets/img/jpg/pc-1.jpg";
const ShowPromotionalSection = ({ image_url, name, description }) => {
  return (
    <>
      <div className="relative rounded-lg pt-[1px] h-full border border-solid border-[#212537]">
        <Image
          src={image_url}
          className=""
          alt="logo"
          width={1000}
          height={1000}
          priority
        />
        <div className="mx-auto px-6 max-xl:px-3 pb-11 absolute top-0 left-0 w-full h-full flex justify-center">
          {/* <Image
            src={ClubImg}
            className="mt-[-3.563rem] mx-auto max-w-[266px] max-xl:max-w-[200px] w-full"
            width={266}
            height={200}
            alt="logo"
          /> */}
          <div>
            <h2 className="text-center text-[2.5rem] max-2xl:text-[2.125rem] max-md:text-3xl font-bold text-white mb-[1.25rem] font-geometrics-bold uppercase">
              {name}
            </h2>
            <p className="text-center text-xl max-2xl:text-base font-bold text-white mb-[1.25rem] mx-auto w-full max-w-[18.25rem]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowPromotionalSection;
