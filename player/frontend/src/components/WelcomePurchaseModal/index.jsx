import Cross from "@/assets/images/Cross";
import useCheckoutStore from "@/store/useCheckoutStore";
import useModalsStore from "@/store/useModalsStore";
import useUserStore from "@/store/useUserStore";
import { getCookie } from "@/utils/clientCookieUtils";
import { useIP } from "@/utils/ipUtils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import modalImg from "../../../public/assets/img/png/verify-email.png";
import logo from "../../assets/images/logo/logo.svg";
import { PrimaryButton } from "../Common/Button";
import ShowPaymentMethodsModal from "../Modals/ShowPaymentMethodsModal";
import DailyBonusTimer from "./DailyBonusTimer";

const WelcomePurchaseModal = () => {
  const { user, setUser, userIp,setUserIp } = useUserStore();
  useIP(setUserIp);

  const userToken = getCookie("accessToken");
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal, openModal, clearModals } = useModalsStore();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const { setCheckoutData } = useCheckoutStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.welcomePurchaseBonus) {
      setSelectedPackage(user?.welcomePurchaseBonus);
      setRemainingTime(user?.welcomePurchaseBonus?.welcomePurchaseBonusEndTime);
    }
  }, [user]);

  const claimBonus = async () => {
    try {
      setIsLoading(true);
      const result = await claimWelcomeBonusAction({ userIp });
      if (result?.success) {
        toast.success("Bonus successfully claimed!");
        setUser(await getProfile());
        closeModal();
      } else {
        toast.error(result?.message || "Failed to claim bonus.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (userToken) {
      // const initPayData = {
      //   amount: selectedPackage?.amount,
      //   packageId: selectedPackage?.packageId,
      //   paymentType: "deposit",
      //   promocode: null,
      // };
      let pkg = {
        amount: selectedPackage?.amount,
        packageId: selectedPackage?.packageId,
      };
      closeModal(<WelcomePurchaseModal />);
      openModal(<ShowPaymentMethodsModal pkg={pkg} />);
      // const { success, data, message } = await initPay(initPayData);
      // console.log(data?.limitCheck?.message, ":::::::::::::::::::::data?.limitCheck?.message")

      // if (success) {
      //   let pkg={
      //     packageId: selectedPackage?.packageId,
      //   }

      //   setCheckoutData({
      //     pkg,
      //     userData: user,
      //     paymentData: data.paymentData,
      //   });

      //   router.push("/checkout");
      //   clearModals();

      //   // openModal(
      //   //   <CheckoutCard
      //   //     pkg={pkg}
      //   //     userData={user}
      //   //     data={data.paymentData}
      //   //     onClose={closeModal}
      //   //   />
      //   // );
      //   // clearModals()
      // } else {

      //   toast.error(message);

      // }
    }
  };

  return (
    <div className="max-w-[766px] w-full   rounded-lg p-2">
      <div className="  rounded-lg p-6 max-sm:p-4 flex items-center justify-center relative">
        <Image
          src={logo}
          alt="Phibet Logo"
          width={1000}
          height={1000}
          className="max-w-64"
        />
        <button
          onClick={clearModals}
          className="absolute top-3 right-3 hover:rotate-90 transition-transform duration-200"
        >
          <Cross />
        </button>
      </div>

      <div className="max-w-[605px] justify-between w-full mx-auto flex flex-col md:flex-row items-center gap-9 p-7">
        <div className="max-w-48 w-full relative before:absolute before:w-3/4 before:h-3/4 before:bg-white before:blur-[61px] before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2">
          <Image
            src={modalImg}
            alt="Phibet Logo"
            width={1000}
            height={1000}
            className="w-full relative z-[2]"
          />
        </div>

        <div className="max-w-[294px] w-full text-center">
          <div className="flex-col items-center justify-center">
            <h2 className="text-yellow-400 text-lg font-semibold mb-2">
              Offer ends in:
            </h2>
            <DailyBonusTimer eventDateTime={remainingTime} />
          </div>
          <h3 className="text-white text-xl font-bold mt-4">
            {selectedPackage?.welcomePurchasePercentage}% Welcome Purchase Bonus
            Available for a{" "}
          </h3>
          <p className="text-yellow-400 font-bold text-xl">
            limited time only!
          </p>

          <p className="text-white text-lg font-bold my-4">
            Buy{" "}
            <span className="text-yellow-400">
              "{selectedPackage?.gcCoin} GC"
            </span>{" "}
            + FREE{" "}
            <span className="text-white00">
              "{selectedPackage?.scCoin} SC"
            </span>{" "}
            for{" "}
            <span className="text-yellow-400">
              "${selectedPackage?.amount}"
            </span>
          </p>

          <PrimaryButton
            onClick={handleBuyNow}
            disabled={isLoading}
            className="w-full mt-4"
          >
            {isLoading ? "Loading..." : "Grab Your Bonus Coins Now"}
          </PrimaryButton>

          {/* <button className="  text-sm mt-3 underline">
            Skip now
          </button> */}

          <div className="mt-4 text-xs  ">
            <p className="text-yellow-400">Terms and Conditions</p>
            <div className="flex flex-col gap-3">
              <p className="mb-0">Offer valid until timer expires</p>
              <p className="mb-0">One-time use per user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePurchaseModal;
