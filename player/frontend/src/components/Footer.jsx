import LogoGray from "../assets/images/logo/logo-gray.svg";
import { getCmsLinks } from "@/actions";
import Image from "next/image";
import Link from "next/link";
import Contact from "./Contact";
import { cookies } from "next/headers";
import InstagramIcon from '../assets/icons/InstagramIcon';
import YoutubeIcon from '../assets/icons/YoutubeIcon';
import DiscordIcon from '../assets/icons/DiscordIcon';
import TwitterIcon from '../assets/icons/TwitterIcon';
import TelegramIcon from '../assets/icons/TelegramIcon';

export default async function Footer() {
  const accessToken = cookies().get("accessToken");

  let cmsLinks = await getCmsLinks();
  let cmsLinksArray = cmsLinks?.data?.filter(
    (cmsLink) => cmsLink?.slug !== "VCSR1.0.pdf"
  );

  if (accessToken && accessToken?.value != "") {
    cmsLinksArray = cmsLinks?.data;
  }
  let footer_desctiption = cmsLinksArray?.find(
    (cmsLink, i) => cmsLink?.slug === "footer"
  );
  return (
    <footer className="w-full bg-footer-bg">
      <div className="mx-auto max-w-container-width w-full space-y-8 px-4 py-6 sm:py-10 lg:py-16 lg:space-y-16">
        <div className="flex gap-8 2xl:gap-16 max-lg:flex-wrap">
          <div className="max-w-[31.625rem] max-xl:max-w-72 max-lg:max-w-full max-lg:text-center w-full">
            <h2 className="text-24 sm:text-30 2xl:text-40 font-black uppercase grow shrink-0">
              Winzy <span className="text-transparent bg-primaryButtonGradient bg-clip-text">play</span>
            </h2>
            <p className="max-w-2xl max-lg:mx-auto w-full text-white text-12 md:text-16 px-1.5 mt-4">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>

            <ul className="mt-8 flex gap-3 items-center max-lg:justify-center">
            <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-14 text-tertiary-300 font-medium"
                >
                  <span className="sr-only">Twitter</span>

                  <TelegramIcon className='size-6' />
                </a>
              </li>

              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-14 text-tertiary-300 font-medium"
                >
                  <span className="sr-only">GitHub</span>

                  <DiscordIcon className='size-6' />
                </a>
              </li>

              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-14 text-tertiary-300 font-medium"
                >
                  <span className="sr-only">Dribbble</span>

                  <TwitterIcon className='size-6' />
                </a>
              </li>

              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-14 text-tertiary-300 font-medium"
                >
                  <span className="sr-only">Facebook</span>

                 <InstagramIcon className='size-6' />
                </a>
              </li>

              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-14 text-tertiary-300 font-medium"
                >
                  <span className="sr-only">Instagram</span>

                  <YoutubeIcon className='size-6' />
                </a>
              </li>
            </ul>
          </div>

          <div className="flex gap-x-2 gap-y-5 sm:gap-5 grow max-nlg:flex-wrap max-nlg:justify-center">
            <div className="max-w-fit nlg:max-w-[313px] w-full">
              <p className="text-20 text-white font-semibold">About Us</p>

              <ul className="mt-6 space-y-2.5">
                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    About Us
                  </a>
                </li>

                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    Accounts Review
                  </a>
                </li>

                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    HR Consulting
                  </a>
                </li>

                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    How To Play
                  </a>
                </li>
              </ul>
            </div>

            <div className="max-w-fit nlg:max-w-[313px] w-full">
              <p className="text-20 text-white font-semibold">Contact</p>

              <ul className="mt-6 space-y-2.5">
                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    Support : <span className="text-white">support@tmf.com</span>
                  </a>
                </li>

                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    Partners : <span className="text-white">partners@tmf.com</span>
                  </a>
                </li>

                <li>
                  <a href="#" className="text-14 text-tertiary-300 font-medium">
                    Legal : <span className="text-white">legal@tmf.com</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="max-w-[313px] w-full shrink-0">
              <Contact />
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
