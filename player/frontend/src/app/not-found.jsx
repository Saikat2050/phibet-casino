import Image from "next/image";
import Link from "next/link";
import nofound from "../../public/assets/img/png/not-found.png";
import { PrimaryButton } from "@/components/Common/Button";

export default function NotFound() {
  return (
    <div className="text-white py-8 z-50">
      <div className="relative">
        <Image
          src={nofound}
          className="h-full w-[80%] mx-xl:w-[60%] m-auto"
          alt="Not-Found"
        />
        <div className="text-center">
          <Link href="/">
            <PrimaryButton className="!min-w-20 sm:min-w-036 w-auto max-w-sm:[80px] [&>.thirdSpan]:max-sm:flex [&>.thirdSpan]:max-sm:justify-center  [&>.thirdSpan]:max-sm:max-w-[80px] [&>.thirdSpan]:text-sm [&>.secondSpan]:max-sm:max-w-[80px] [&>.firstSpan]:max-sm:max-w-[80px]">
              Go To Homepage
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
