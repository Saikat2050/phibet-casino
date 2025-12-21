"use client";

import {
  getDailyBonus,
  getPackages,
  getProfile,
  getSignUpPermissions,
  getUserProfile,
  getWelcomeBonus,
  logoutUser,
  paysafePay,
  submitProfileAction
} from "@/actions";
import Arrow from "@/assets/images/Arrow";
import USD from "@/assets/images/coins/USD";
import GCGray from "@/assets/images/coins/GCGray";
// import USD from "@/assets/images/coins/USD";
import SCGray from "@/assets/images/coins/SCGray";
import UserImage from "@/assets/images/default-profile.svg";
import Help from "@/assets/images/Help";
import useLocationStore from "@/store/useLocationStore";
import useMaintenanceStore from "@/store/useMaintenanceStore";
import useModalsStore from "@/store/useModalsStore";
import useUserStore from "@/store/useUserStore";
import { deleteAllClientCookies, getCookie } from "@/utils/clientCookieUtils";
import { formatCompactNumber } from "@/utils/helper";
import { useIP } from "@/utils/ipUtils";
import { adminSocket, walletSocket } from "@/utils/socket";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import reverse from "../../assets/images/reverse.svg";
import reverseGC from "../../assets/images/reverseGC.svg";
import BlockSignUpModel from "../Auth/BlockSignUpModel";
import Login from "../Auth/Login";
import OtpVerification from "../Auth/OtpVerification";
import Signup from "../Auth/Signup";
import { PrimaryButton, SecondaryButton } from "../Common/Button";
import CompletedKycModal from "../CompleteKycModal";
import CompleteYourProfileModal from "../CompleteYourProfileModal";
import DailyBonus from "../DailyBonus";
import CardPurchaseModal from "../Modals/CardPurchaseModal";
import ShowCoinPackageMoal from "../ShowCoinsPackagesModal";
import TermsAndConditionsModal from '../TermsAndConditionsModal';
import WelcomeBonus from "../WelcomeBonus";
// import Cookies from 'js-cookie';

const MenuItems = [
  { label: "Profile", href: "/user/profile" },
  { label: "My Favorite", href: "/favorite" },
  // { label: "Prefrences", href: "/user/profile" },
];
const HeaderOptions = () => {
  const router = useRouter();
  const {
    setSelectedCoin,
    selectedCoin,
    logout,
    clearAllData,
    forceLogout,
    user,
    setUserWallet,
    setUser,
    setUserIp,
    userIp,
    isLoggedIn,
  } = useUserStore();
  const { openModal, closeModal, setIsCloseNeed, clearModals } =
    useModalsStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [CoinsPackages, setCoinsPackages] = useState([]);
  const pathname = usePathname();
  const userToken = getCookie("accessToken");
  const { setMaintenanceMode, maintenanceMode } = useMaintenanceStore();

  useIP(setUserIp);

  // const hasIncompleteProfile = user?.kycStatus === "K1" || user?.kycStatus === "K2" || !user?.phoneVerified;
  const hasIncompleteProfile = user?.profileCompleted == false || user?.phoneVerified == false;
  const hasIncompleteKyc = user?.kycStatus === "K1" || user?.kycStatus === "K2";
  const { fetchStateListing, fetchCityListing, stateListing, cityListing } =
    useLocationStore();


    useEffect(() => {
      if (user?.isKycRequired && (user?.kycStatus != "K4" && user?.kycStatus != "K5")) {
  
        setSelectedCoin("USD");
      }
    }, [user])

  // useEffect(() => {
  //   fetchStateListing();
  //   fetchCityListing();
  // }, []);




  // function formatStateOptions2(stateListing) {
  //   return stateListing.map((state) => ({
  //     value: state.state_id,
  //     label: state.name,
  //   }));
  // }

  // useEffect(() => {
  //   if (user?.isKycRequired) {
  //     if (user?.kycStatus !== "K4" && user?.kycStatus !== "K5") {
  //       setSelectedCoin("USD");
  //       setIsRotated(true);
  //     }
  //     else {
  //       setIsRotated(false);
  //     }
  //   }
  // }, [user?.isKycRequired]);

  const toggleCoin = () => {
    if (hasIncompleteProfile) {
      openModal(<CompleteYourProfileModal close={true} />);
      return;
    }

    if (!user?.phoneVerified) {
      openModal(<CompleteYourProfileModal close={true} />);
      return;
    }

    // If KYC is required, check if user has completed KYC (K4 or K5)
    if (user?.isKycRequired) {
      if (user?.kycStatus !== "K4" && user?.kycStatus !== "K5") {
        setSelectedCoin("USD");
        setIsRotated(true);
        openModal(<CompletedKycModal close={true} />);
        return;
      }
    }

    setSelectedCoin("USD");
    setIsRotated(!isRotated);
  };

  // const handleLogout = async () => {

  //   // router.replace("/");
  //   setSelectedCoin("USD");
  //   await logoutUser();
  //   deleteAllClientCookies();
  //   logout();
  //   /*  setTimeout(() => {
  //     window.location.reload();
  //   }, 500); */
  //   router.refresh();
  // };

  // useEffect(() => {
  //   window.dataLayer = window.dataLayer || [];
  //   window.dataLayer.push({
  //     event: "page_view",
  //     page: window.location.href,
  //   });
  // }, [pathname]);

  // const onCoinUpdate = (data) => {
  //   const updatedWallet = user.userWallet;
  //   let updateData = false;
  //   if (data?.data?.gcCoin !== undefined) {
  //     updatedWallet.gcCoin = data?.data?.gcCoin;
  //     updateData = true;
  //   }
  //   if (data?.data?.status == "SUCCESS") {
  //     toast.success("Payment Successfully Done!");
  //   }

  //   if (data?.data?.scCoin !== undefined) {
  //     updatedWallet.totalScCoin = data?.data?.scCoin;
  //     updateData = true;
  //   }
  //   if (data?.data?.wsc !== undefined) {
  //     updatedWallet.scCoin.wsc = data?.data?.wsc;
  //     updateData = true;
  //   }
  //   if (data?.data?.bsc !== undefined) {
  //     updatedWallet.scCoin.bsc = data?.data?.bsc;
  //     updateData = true;
  //   }
  //   setUser({ ...user, userWallet: { ...updatedWallet } });
  // };

  // const handleBan = (data) => {
  //   if (data?.data?.message === "Ban") {
  //     handleLogout();
  //   }

  //   if (data?.data?.isRestrict == true) {
  //     setUser({ ...user, isRestrict: true });
  //   } else {
  //     setUser({ ...user, isRestrict: false });
  //   }
  // };

  // const handleInActiveForceLogout = (data) => {
  //   if (data?.data?.message === "InActive") {
  //     handleLogout();
  //   }
  // };

  // const handleDuplicate = (data) => {
  //   if (data) {
  //     handleLogout();
  //   }
  // };

  // const handleForcedLogout = (data) => {
  //   handleLogout();
  // };
  // const handleKYCStatus = (data) => {
  //   if (data?.data?.kycStatus === "K4" || data?.data?.kycStatus === "K5") {
  //     let kycStatus = data?.data?.kycStatus;
  //     let sumsubKycStatus = data?.data?.sumsubKycStatus;
  //     setUser({
  //       ...user,
  //       kycStatus: kycStatus,
  //       sumsubKycStatus: sumsubKycStatus,
  //     });
  //   }
  // };

  // const handleKYCCheckAfterSumSub = async (data) => {

  //   // if (data?.data?.sumsubKycStatus == "completed") {
  //   //   toast.success("KYC verification completed successfully!");
  //   // }
  //   if (data?.data?.kycStatus == "K5" || data?.data?.kycStatus == "K4") {
  //     toast.success("KYC verification completed successfully!");

  //     const res1 = await getProfile();
  //     setUser(res1);

  //     const payload = {
  //       firstName: user?.firstName,
  //       lastName: user?.lastName,
  //       dateOfBirth: user?.dateOfBirth,
  //       gender: user?.gender,
  //       city: user?.city,
  //       state: formatStateOptions2(stateListing).find(
  //         (item) => user?.state == item.value
  //       ),
  //       country: user?.country,
  //       postalCode: user?.zipCode,
  //       zipCode: user?.zipCode,
  //     };
  //     const res = await submitProfileAction(payload, userIp);
  //   }
  //   else if (data?.data?.kycStatus == "K8") {
  //     toast.error("KYC verification failed!");
  //   }
  //   else {
  //     toast.info("KYC verification pending!");
  //   }
  //   /*  */
  // };

  // const handlePaymentStatus = async (data) => {
  //   if (data?.data?.status === "SUCCESS") {
  //     const transactionResult = await paysafePay(data?.data?.transactionId);
  //     const payload = {};

  //     // if (!transactionResult?.data?.isFirstDeposit) {
  //     //   return;
  //     // }
  //     const affiliateId = user?.affiliate_id || "Affiliate ID not available";
  //     const clickId =
  //       user?.affiliateCode || user?.clickId || "Click ID not available";
  //     if (transactionResult?.data?.isFirstDeposit) {
  //       window.dataLayer.push({
  //         event: "purchase",
  //         ecommerce: {
  //           transaction_id: data?.data?.transactionId,
  //           currency: "USD",
  //           value: parseFloat(transactionResult?.data?.amount),
  //           items: [
  //             {
  //               item_id: transactionResult?.data?.packageId,
  //               item_name: `${transactionResult?.data?.amount} Package`,
  //               quantity: 1,
  //               amount: parseFloat(transactionResult?.data?.amount),
  //               price: parseFloat(transactionResult?.data?.amount),
  //             },
  //           ],
  //           scCoin: transactionResult?.data?.scCoin,
  //           gcCoin: transactionResult?.data?.gcCoin,
  //           payment_type: "Deposit",
  //           user_id: user?.user_id,
  //           affiliate_id: affiliateId,
  //           click_id: clickId,
  //         },
  //       });
  //     }

  //     window.dataLayer.push({
  //       event: "purchaseall",
  //       ecommerce: {
  //         transaction_id: data?.data?.transactionId,
  //         currency: "USD",
  //         value: parseFloat(transactionResult?.data?.amount),
  //         items: [
  //           {
  //             item_id: transactionResult?.data?.packageId,
  //             item_name: `${transactionResult?.data?.amount} Package`,
  //             quantity: 1,
  //             amount: parseFloat(transactionResult?.data?.amount),
  //             price: parseFloat(transactionResult?.data?.amount),
  //           },
  //         ],
  //         scCoin: transactionResult?.data?.scCoin,
  //         gcCoin: transactionResult?.data?.gcCoin,
  //         payment_type: "Deposit",
  //         user_id: user?.user_id,
  //         affiliate_id: affiliateId,
  //         click_id: clickId,
  //       },
  //     });

  //     setTimeout(async () => {
  //       closeModal(<CardPurchaseModal />);
  //       const user_profile = await getProfile();
  //       setUser(user_profile);
  //       clearModals();
  //     }, 800);

  //     if (transactionResult?.data?.transactionStatus === 1) {
  //       (payload.currency = "USD"),
  //         (payload.value = parseFloat(transactionResult?.data?.amount)),
  //         (payload.transactionId = data?.paymentData?.transactionId);
  //       (payload.item_id = transactionResult?.data?.packageId),
  //         (payload.user_id = user?.userId);
  //       payload.affiliate_id = user?.affiliateId;
  //       payload.click_id = user?.clickId;
  //       payload.item_name = `${transactionResult?.data?.amount} Package`;
  //       payload.quantity = 1;
  //       payload.amount = parseFloat(transactionResult?.data?.amount);
  //       payload.price = parseFloat(transactionResult?.data?.amount);
  //       payload.scCoin = transactionResult?.data?.scCoin;
  //       payload.gcCoin = transactionResult?.data?.gcCoin;
  //       payload.payment_type = "Deposit";
  //     }
  //   }
  // };

 

  // const handleRequire = (data) => {
  //   setUser({
  //     ...user,
  //     isKycRequired: data.data.isKycRequired,
  //   });

  //   // If KYC is required, force switch to USD
  //   if (data.data.isKycRequired) {
  //     if (user?.kycStatus != "K4" && user?.kycStatus != "K5") {
  //       setSelectedCoin("USD");
  //       setIsRotated(true);
  //       openModal(<CompletedKycModal close={true} />);
  //     }
  //     else {
  //       setIsRotated(false);
  //     }
  //   }
  // }


  // const onAdminNotificationWillStart = (data) => {
  //   if (data?.data?.message) {
  //     toast.warn(data?.data?.message);
  //   }
  // }


  // const onAdminNotificationStart = (data) => {
  //    if (data?.data?.message) {
  //     toast.warn(data?.data?.message);
  //     setMaintenanceMode(true);
  //     handleLogout();
  //     router.push('/maintenance');
  //   }
  // }

  // const onAdminNotificationEnd = (data) => {
  //   console.log("MAINTENANCE_ENDED")
  //   if (data?.data?.message) {
  //     toast.info(data?.data?.message);
  //     setMaintenanceMode(false);
  //     router.push('/')
  //   }
  // }

  // useEffect(() => {
  //   adminSocket.connect();
  //   adminSocket.on('MAINTENANCE_NOTICE', onAdminNotificationWillStart);
  //   adminSocket.on('MAINTENANCE_STARTED', onAdminNotificationStart);
  //   adminSocket.on('MAINTENANCE_ENDED', onAdminNotificationEnd);

  //   return () => {
  //     adminSocket.off('MAINTENANCE_NOTICE');
  //     adminSocket.off('MAINTENANCE_STARTED');
  //     adminSocket.off('MAINTENANCE_ENDED');
  //     adminSocket.disconnect();
  //   };
  // }, [])

  // useEffect(() => {
  //   if (userToken && user) {
  //     walletSocket.auth = { token: userToken };
  //     walletSocket.connect();
  //     walletSocket.on("USER_WALLET_BALANCE", onCoinUpdate);
  //     walletSocket.on("KYC_STATUS_UPDATE", handleKYCCheckAfterSumSub);
  //     walletSocket.on("BAN", handleBan);
  //     walletSocket.on('KYC_REQUIRED', handleRequire)
  //     walletSocket.on("DUPLICATE_LOGIN", handleDuplicate);
  //     walletSocket.on("IN_ACTIVE", handleInActiveForceLogout);
  //     walletSocket.on("KYC_STATUS", handleKYCStatus);
  //     walletSocket.on("PAYMENT_STATUS", handlePaymentStatus);
  //     walletSocket.on("FORCE_LOGOUT", handleForcedLogout);
  //   }

  //   return () => {
  //     walletSocket.off("USER_WALLET_BALANCE", onCoinUpdate);
  //     walletSocket.off("BAN", handleBan);
  //     walletSocket.off('KYC_REQUIRED', handleRequire)
  //     walletSocket.off("DUPLICATE_LOGIN", handleDuplicate);
  //     walletSocket.off("IN_ACTIVE", handleInActiveForceLogout);
  //     walletSocket.off("KYC_STATUS", handleInActiveForceLogout);
  //     walletSocket.off("PAYMENT_STATUS");
  //     walletSocket.off("KYC_STATUS_UPDATE");
  //     walletSocket.off("FORCE_LOGOUT");
  //     // PAYMENT_STATUS: "PAYMENT_STATUS";
  //     walletSocket.disconnect();
  //   };
  // }, [userToken, user]);

  // useEffect(() => {
  //   const checkIfAccessAllowed = async () => {
  //     await getAccessAllowed(userIp);
  //   };
  //   checkIfAccessAllowed();
  // }, []);

  /*   const CallGetPackages = async () => {
    const response = await getPackages();
    setCoinsPackages(response);
  }; */


//  if token is expired redirect user to main screen::

/*   useEffect(() => {
    async function callProfileExist() {
      const userProfile = await getUserProfile();
      if (
        userProfile?.errors?.[0]?.name == "Unauthorized or Forbidden" ||
        userProfile?.errors?.[0]?.name == "UnAuthorize" ||
        userProfile?.apiErrors == "Unauthorized or Forbidden"
      ) {
       toast.error(
          "You have been logged out!"
        );
        clearAllData();
        router.replace("/");
        // logout();
      }
    }
    if (isLoggedIn) {
      callProfileExist();
    }
  }, [userToken]); */

  // useEffect(() => {
  //   async function callUserProfile() {
  //     const userProfile = await getProfile();
  //     setUser(userProfile);
  //   }

  //   if (userToken) {
  //     callUserProfile();
  //   }
  // }, [userToken]);

  // useEffect(() => {
  //   /*  const getUserProfile = async () => {
  //     const res = await getProfile();
  //     setUser(res);
  //   };
  //   getUserProfile(); */

  //   async function getPackagesData() {
  //     let userPackages = await getPackages();
  //     setCoinsPackages(userPackages);
  //   }
  //   if (userToken) {
  //     getPackagesData();
  //   }
  //   // CallGetPackages();
  // }, [user, userToken]);

  useEffect(() => {
    if (user && user?.isEmailVerified == false) {
      openModal(<OtpVerification email={user?.email} />);
    }
  }, [user]);

  const handleBuyButtonClick = () => {
    if (maintenanceMode) {
      toast.warn('Site is under maintenance');
      return;
    }
    if (hasIncompleteProfile) {
      openModal(<CompleteYourProfileModal close={true} />);
    } else {
      openModal(
        <ShowCoinPackageMoal close={true} CoinsPackages={CoinsPackages} />
      );
    }
  };
  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const dailyBonus = await getDailyBonus();
        const welcomeBonus = await getWelcomeBonus();

        if (
          Object.keys(dailyBonus || {}).length > 0 &&
          user?.isDailyBonusAllowed &&
          !user.isDailyBonusClaimed &&
          user.isEmailVerified
          // isHrsPassed
        ) {
          openModal(
            <DailyBonus
              bonusName={dailyBonus.bonusName}
              gcAmount={dailyBonus.gcAmount}
              scAmount={dailyBonus.scAmount}
              description={dailyBonus.description}
              btnText={dailyBonus.btnText}
              termCondition={dailyBonus.termCondition}
              imageUrl={dailyBonus.imageUrl}
              closeModal={closeModal}
            />,
            "dailyBonus"
          );
        }

        if (
          Object.keys(welcomeBonus || {}).length > 0 &&
          user?.isWelcomeBonusAllowed &&
          !user.isWelcomeBonusClaimed &&
          user.isEmailVerified
        ) {
          openModal(
            <WelcomeBonus
              bonusName={welcomeBonus.bonusName}
              gcAmount={welcomeBonus.gcAmount}
              scAmount={welcomeBonus.scAmount}
              description={welcomeBonus.description}
              btnText={welcomeBonus.btnText}
              termCondition={welcomeBonus.termCondition}
              imageUrl={welcomeBonus.imageUrl}
              closeModal={closeModal}
            />,
            "welcomeBonus"
          );
        }
      } catch (error) {
        console.error("Error fetching bonuses", error);
      }
    };

    if (userToken && user?.isEmailVerified) {
      if (maintenanceMode) {
        return;
      }
      fetchBonuses();
    }
  }, [
    user,
    userToken,
    openModal,
    closeModal,
    user?.isDailyBonusClaimed,
    user?.isWelcomeBonusClaimed,
  ]);
  /*   useEffect(() => {
    const initializeNSureSDK = () => {
      if (typeof window !== "undefined" && window.nSureSDK) {
        window.nSureSDK.init({
          appId: "9JBW2RHC7JNJN8ZQ",
          partnerId: "PHIBET", // Replace with the actual partnerId
        });
      }
    };

    const scriptId = "nsure-sdk-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://sdk.nsureapi.com/sdk.js";
      script.async = true;
      script.onload = initializeNSureSDK;
      document.body.appendChild(script);
    } else {
      // If the script already exists, reinitialize the SDK
      initializeNSureSDK();
    }

    return () => {
      // Optionally clean up the script if needed
      // document.getElementById(scriptId)?.remove();
    };
  }, []); */

  // const deviceId = window?.nSureSDK?.getDeviceId();
  /*   useEffect(() => {
    if (typeof window !== "undefined" && deviceId) {
      // Set cookie with 7 days expiry
      // Cookies.set('deviceId', deviceId, {  path: '/' });
    }
  }, [deviceId]) */
  const hideBalance = !pathname.includes("/game/");

  /*   useEffect(() => {
      const hasSearchParams = router?.query && Object.keys(router?.query).length > 0;
      if(hasSearchParams){
      if(!pathname.includes("/user/forgotPassword")){
        if (!userToken) {
          forceLogout();
          router.replace("/");
        }
      }
    }
    }, [userToken]); */

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const searchParams = new URLSearchParams(window.location.search);

  //     const hasSpecificSearchParams =
  //       searchParams.has("cid") ||
  //       searchParams.has("click_id") ||
  //       searchParams.has("pid");

  //     if (
  //       !hasSpecificSearchParams &&
  //       !pathname.includes("/user/forgotPassword")
  //     ) {
  //       if (!userToken) {
  //         forceLogout();
  //         if (pathname !== "/") {
  //           router.replace("/");
  //         }
  //       }
  //     }
  //   }
  // }, [userToken, pathname, router]);

  const handleHelpRedirect = () => {
    // window.location.href = 'https://help.phibet.com/';
    window.open("https://help.phibet.com/", "_blank");
  };
  /*  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef(null);

useEffect(() => {
  const showTooltip = () => setTooltipVisible(true);
  const hideTooltip = () => setTooltipVisible(false);

  const button = tooltipRef.current;
  if (button) {
    button.addEventListener("mouseenter", showTooltip);
    button.addEventListener("mouseleave", hideTooltip);
  }

  return () => {
    if (button) {
      button.removeEventListener("mouseenter", showTooltip);
      button.removeEventListener("mouseleave", hideTooltip);
    }
  };
}, []); */

  useEffect(() => {
    const trackPageView = () => {
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "page_view",
          page_path: pathname,
          page_name: getPageName(pathname),
          user_id: user?.userId || "anonymous",
        });
      }
    };
    const getPageName = (path) => {
      const pathSegments = path.replace(/^\//, "").split("/");

      const pageNameMap = {
        "": "Home",
        favorite: "Favorites",
        vip: "VIP",
        "not-authorized-user": "Not Authorized",
        category: "Category",
        game: "Game",
        "user/forgot-password": "Forgot Password",
        "user/game-history": "Game History",
        "user/kyc": "KYC Verification",
        "user/password": "Change Password",
        "user/profile": "User Profile",
        "user/redeem": "Redeem",
        "user/responsible-gaming": "Responsible Gaming",
        "user/transaction": "Transactions",
      };

      const fullPathName = pageNameMap[path.replace(/^\//, "")];
      if (fullPathName) return fullPathName;

      if (pathSegments[0] === "category" && pathSegments.length > 1) {
        return `Category: ${decodeURIComponent(pathSegments[1])}`;
      }

      if (pathSegments[0] === "game" && pathSegments.length > 1) {
        return `Game: ${decodeURIComponent(pathSegments[1])}`;
      }

      return (
        pathSegments
          .map((segment) =>
            segment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          )
          .join(" > ") || "Unknown Page"
      );
    };
    trackPageView();
  }, [pathname, user]);

  const handleRegisterModel = async () => {
    const isPermissionValid = await getSignUpPermissions(userIp);
    if (isPermissionValid?.success) {
      if (isPermissionValid?.registrationBlocked) {
        openModal(<BlockSignUpModel />);
      } else {
        openModal(<Signup />);
      }
    }
  };
  const openLoginModel = () => {
    setIsCloseNeed(true);
    openModal(<Login />);
  };

  useEffect(() => {
    if (user && user?.isEmailVerified && !user?.isTermsAccepted && userToken && user?.isEmailVerified) {
      openModal(<TermsAndConditionsModal closeModal={() => closeModal(<TermsAndConditionsModal />)} />);
    }
  }, [user]);

  return (
    <>
      {/* Auth Buttons */}
      {(!userToken || (userToken && user?.isEmailVerified == false)) && (
        <div className="flex flex-row gap-2 2xl:gap-4 max-sm:gap-2 items-center h-full grow justify-end">
          <SecondaryButton
            onClick={openLoginModel}
            className="max-w-32 w-full"
          >
            Login
          </SecondaryButton>
          <PrimaryButton
            onClick={() => openModal(<Signup />)}
            // onClick={handleRegisterModel}
            className="max-w-32 w-full"
          >
            Register
          </PrimaryButton>
        </div>
      )}

      {/* ToggleSwitch */}
      {userToken && user?.isEmailVerified == true && (
        <>
          <div
            className={`relative hidden sm:grid grid-cols-2 ${hideBalance ? "w-[230px] lg:w-[280px] xl:w-[369px]" : ""
              } h:[44px] xl:h-[54px] bg-blackOpacity-250 p-[5px] rounded-full gap-[5px]`}
          >
            {/* Animated Toggle Background */}
            <div
              className={`absolute top-[5px] left-0 h-[40px] xl:h-[44px] w-1/2 rounded-full transition-transform duration-300 ease-in-out ${selectedCoin === "USD"
                ? "bg-[#FFC048] shadow-custom-gc translate-x-0"
                : "bg-[#33D9B2] shadow-custom-sc translate-x-full"
                }`}
            ></div>

            {/* USD Button */}
            <div
              onClick={toggleCoin}
              className={`relative flex items-center cursor-pointer h-[40px] xl:h-[44px] font-bold py-1 px-1 justify-center rounded-full z-10`}
            >
              {/* {selectedCoin == "USD" ? <USD /> : <GCGray />} */}
              {hideBalance && (
                <span className="ml-2 text-base lg:text-[20.71px] text-[#303545] font-bold">
                 $ {formatCompactNumber(user?.userWallet?.gcCoin)}
                </span>
              )}
              <span className="ml-auto text-base lg:text-[20.71px] pr-2 text-black font-bold">
                USD
              </span>
            </div>

            {/* USD Button */}
            {/* <div
              onClick={toggleCoin}
              className={`relative flex items-center cursor-pointer h-[40px] xl:h-[44px] font-bold py-1 px-1 justify-center rounded-full z-10`}
            >
              {selectedCoin == "USD" ? <USD /> : <SCGray />}
              {hideBalance && (
                <span className="ml-2 text-base md:text-sm lg:text-[20.71px] text-[#303545] font-bold">
                  {user?.userWallet?.totalScCoin
                    ? formatCompactNumber(+user?.userWallet?.totalScCoin)
                    : formatCompactNumber(
                      user?.userWallet?.scCoin?.bsc +
                      user?.userWallet?.scCoin?.psc +
                      user?.userWallet?.scCoin?.wsc
                    )}
                </span>
              )}
              <span className="ml-auto text-base lg:text-[20.71px] pr-2 text-black font-bold">
                USD
              </span>
            </div> */}
          </div>

          <div className="hidden sm:flex flex-row gap-2 lg:gap-4">
            <button
              onClick={handleBuyButtonClick}
              className="bg-[#F23A57] text-xs lg:text-sm xl:text-base text-white font-bold py-2 px-2 lg:px-4 rounded-full hover:scale-110 transition-all duration-300"
            >
              BUY COINS NOW
            </button>
            <div className="relative" title="Help">
              <button
                onClick={handleHelpRedirect}
                // ref={tooltipRef}
                className="h-10 w-10 text-whiteOpacity-300 bg-transparent border-none outline-none hover:scale-110 transition-transform duration-300"
                style={{ cursor: "pointer" }}
              >
                <Help />
              </button>
              {/* {tooltipVisible && (
                <div
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-700 text-white text-sm rounded-full"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Help
                </div>
              )} */}
            </div>

            <div className="relative ">
              <div
                className="flex flex-row gap-2 lg:gap-4 items-center cursor-pointer"
                onClick={() => {
                  if (maintenanceMode) {
                    toast.warn('Site is under maintenance');
                    return;
                  }
                  setIsMenuOpen((prev) => !prev);
                }}
              >
                <Image
                  src={UserImage}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="h-auto rounded-full border-2 border-green-300 "
                />
                <Arrow
                  className={`fill-green-300 ${isMenuOpen ? "rotate-180" : ""}`}
                />
              </div>
              {isMenuOpen && (
                <div className="absolute top-14 -right-2 w-[220px] rounded-lg px-5 py-3 bg-primary-100 z-[60]">
                  {MenuItems?.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMenuOpen((prev) => !prev)}
                      className="group flex py-2.5 cursor-pointer justify-between items-center"
                    >
                      <p className="mb-0 font-normal text-base group-hover:font-semibold group-hover:scale-105 transition-transform duration-300 text-white">
                        {item.label}
                      </p>
                      <Arrow className="-rotate-90 fill-gray-200 group-hover:fill-green-300" />
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="group flex py-2.5 cursor-pointer justify-between items-center bg-transparent w-full"
                  >
                    <p className="mb-0 font-normal text-base group-hover:font-semibold  group-hover:scale-105 transition-transform duration-300 text-white">
                      Logout
                    </p>
                    {/* <Arrow className="-rotate-90 fill-gray-200 group-hover:fill-green-300" /> */}
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* for mobile view only */}
          <div
            className={`sm:hidden flex items-center ${hideBalance ? "w-[230px] lg:w-[280px] xl:w-[369px]" : ""
              } h:[44px] xl:h-[54px] bg-blackOpacity-250 p-[5px] rounded-full gap-[10px]`}
          >
            <div
              onClick={toggleCoin}
              className={`flex items-center cursor-pointer h-[40px] xl:h-[44px] font-bold py-1 px-1 justify-center rounded-full duration-300 ease-in-out ${hideBalance ? "w-[176px]" : ""
                } ${selectedCoin == "USD"
                  ? "bg-[#FFC048] shadow-custom-gc"
                  : "bg-[#33D9B2] shadow-custom-sc"
                }`}
            >
              {selectedCoin == "USD" ? <USD /> : <USD />}
              {hideBalance && (
                <span className="ml-2 text-base md:text-sm text-[20.71px] text-[#303545] font-bold">
                  {selectedCoin === "USD"
                    ? formatCompactNumber(user?.userWallet?.gcCoin)
                    : formatCompactNumber(
                      +user?.userWallet?.scCoin?.bsc +
                      user?.userWallet?.scCoin?.psc +
                      user?.userWallet?.scCoin?.wsc
                    )}
                </span>
              )}
              <span className="ml-auto text-base text-[20.71px] pr-2 text-black font-bold">
                {selectedCoin === "USD" ? "USD" : "USD"}
              </span>
            </div>
            <Image
              src={selectedCoin === "USD" ? reverseGC : reverse}
              width={24}
              height={24}
              className={`max-h-6 cursor-pointer transform transition-transform duration-300 ease-in-out ${isRotated ? "rotate-180" : ""
                }`}
              alt=""
              onClick={toggleCoin}
            />
          </div>
        </>
      )}
    </>
  );
};

export default HeaderOptions;
