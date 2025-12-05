import { useState, useEffect, useRef } from "react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useActionState } from "react";
import {
  appleLogin,
  facebookLogin,
  getWelcomePurchaseBonus,
  googleLogin,
  signupAction,
} from "@/actions";
import { toast } from 'react-toastify';
import useModalsStore from "@/store/useModalsStore";
import useUserStore from "@/store/useUserStore";
import { useGoogleLogin } from "@react-oauth/google";
import OtpVerification from "@/components/Auth/OtpVerification";
import ForcedEmailModal from "@/components/Auth/ForcedEmailModal";
import { useIP } from "@/utils/ipUtils";
import { useSearchParams } from "next/navigation";
import { getCookie, setBrowserCookie } from "@/utils/clientCookieUtils";
import Signup from "@/components/Auth/Signup";

export default function useSignup() {
  const { data: visitorData } = useVisitorData(
    { extendedResult: false, ignoreCache: true },
    { immediate: true },
  );
  const [appleScriptLoaded, setAppleScriptLoaded] = useState(false);
  const { clearModals, openModal, closeModal } = useModalsStore();
  const [formState, formAction, isPending] = useActionState(signupAction, null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingFacebook, setIsLoadingFacebook] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState({
    termsAndConditions: false,
    ageTerm: false,
  });
  const { setAuthData, clearAuthData, logout, setUserIp, setWelcomeBonusPurchase, userIp } = useUserStore();
  const searchParams = useSearchParams();
  useIP(setUserIp);
  let pid = searchParams.get("pid");
  let cid = searchParams.get("cid");
  let click_id = searchParams.get("click_id");
  const sokul_id = getCookie("sokul_X73ysdf4s") || null;
  const signupHandledRef = useRef(false);

  const trackSignUpEvent = (signUpData) => {
    try {
      if (typeof window === "undefined" || !window.dataLayer) {
        console.warn("DataLayer not available");
        return;
      }
      window.dataLayer.push({
        event: "sign_up",
        user_fingerprint_id: visitorData?.fingerprintId,
        requestId: visitorData?.requestId,
        user_id: signUpData.userId,
        affiliate_id: signUpData.affiliateId,
        click_id: signUpData.clickId,
      });
    } catch (error) {
      console.error("Error tracking sign-up event:", error);
    }
  };

  const updateTermsAccepted = (key, value) => {
    setIsTermsAccepted((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isTermsAccepted, "::::::::::isTermsAccepted")
    if (isTermsAccepted.termsAndConditions) {
      // if (!visitorData) {
      //   toast.error("Please disable your ad blocker or privacy shields and refresh the page to continue. Our security system requires device verification.");
      //   return;
      // }
      // if (!visitorData?.visitorId || !visitorData?.requestId) {
      //   toast.error("Device verification in progress. Please wait a moment and try again.");
      //   return;
      // }
      // const new_sokul_id = getCookie("sokul_X73ysdf4s") || null;
      const formData = new FormData(e.target);
      const formDataObject = Object.fromEntries(formData.entries());
      // formDataObject["fingerprintVisitorId"] = visitorData?.visitorId;
      // formDataObject["fingerprintRequestId"] = visitorData?.requestId;
      formDataObject["platform"] = navigator.platform;
      formDataObject["browser"] = navigator.appCodeName;
      formDataObject["isTermsAccepted"] = isTermsAccepted.termsAndConditions;
      if (pid) formDataObject["affiliateId"] = pid;
      if (cid) formDataObject["affiliateCode"] = cid;
      if (click_id) formDataObject["affiliateCode"] = click_id;
      // if (new_sokul_id) formDataObject["sokulId"] = new_sokul_id;
      await formAction({ ...formDataObject, userIp });
    } else {
      toast.error("All terms and conditions must be accepted.");
    }
  };

  useEffect(() => {
    console.log(formState, ":::::::::::::::formState")
    // Prevent duplicate handling
    if (formState?.data && !signupHandledRef.current) {
      signupHandledRef.current = true;
      toast.success(formState?.message);
      // Store the full signup response in Zustand
      setAuthData(formState.data);
      // Store the accessToken in a browser cookie for axios
      if (formState.data.accessToken) {
        setBrowserCookie("accessToken", formState.data.accessToken);
      }
      closeModal()
      clearModals();
      // openModal(<OtpVerification email={formState?.data?.user?.email} />);
    } else if (formState?.apiErrors) {
      toast.error(formState?.apiErrors);
    }
  }, [formState, setAuthData, clearModals, openModal]);

  const fetchData = async (data) => {
    const new_sokul_id = getCookie("sokul_X73ysdf4s") || null;
    if (pid) data["affiliateId"] = pid;
    if (cid) data["affiliateCode"] = cid;
    if (click_id) data["affiliateCode"] = click_id;
    if (new_sokul_id) data["sokulId"] = new_sokul_id;
    const res = await googleLogin(data, userIp);
    if (res?.success) {
      toast.success("Successfully logged in");
      clearModals();
      setUserIp(res?.data?.user?.ip);
      setWelcomeBonusPurchase(res?.data?.user?.welcomeBonusPurchase);
      setAuthData(res?.data);
      if (res?.data?.user?.newGtmUser) {
        trackSignUpEvent({
          userId: res?.data?.user?.userId,
          affiliateId: pid,
          clickId: click_id || cid,
        });
      }
    } else {
      toast.error(res?.message || "Failed to login with google");
    }
    clearModals();
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (tokenResponse) {
        if (!visitorData) {
          toast.error("Please disable your ad blocker or privacy shields and refresh the page to continue. Our security system requires device verification.");
          return;
        }
        if (!visitorData?.visitorId || !visitorData?.requestId) {
          toast.error("Device verification in progress. Please wait a moment and try again.");
          return;
        }
        const userData = {
          credential: tokenResponse.access_token,
          isSignup: true,
          isTermsAccepted: true,
          fingerprintVisitorId: visitorData?.visitorId,
          fingerprintRequestId: visitorData?.requestId,
        };
        fetchData(userData);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => setAppleScriptLoaded(true);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFacebookClick = () => {
    FB.login(
      function (response) {
        if (response && response.authResponse && response.authResponse.userID) {
          FB.api(
            `/${response.authResponse.userID}`,
            { fields: ["first_name", "last_name", "email"] },
            function (_response) {
              responseFacebook(_response);
            }
          );
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const responseFacebook = (response) => {
    if (response) {
      if (!visitorData) {
        toast.error("Please disable your ad blocker or privacy shields and refresh the page to continue. Our security system requires device verification.");
        return;
      }
      if (!visitorData?.visitorId || !visitorData?.requestId) {
        toast.error("Device verification in progress. Please wait a moment and try again.");
        return;
      }
      const userData = {
        firstName: response.first_name,
        lastName: response.last_name,
        userId: response.id,
        email: response.email,
        isSignup: true,
        isTermsAccepted: true,
        isForceEmail: false,
        fingerprintVisitorId: visitorData?.visitorId,
        fingerprintRequestId: visitorData?.requestId,
      };
      const new_sokul_id = getCookie("sokul_X73ysdf4s") || null;
      if (new_sokul_id) userData["sokulId"] = new_sokul_id;
      if (response && response.email) {
        handleFaceBookLogin(userData);
      } else {
        closeModal(<Signup />);
        openModal(
          <ForcedEmailModal
            userData={userData}
            handleFaceBookLogin={handleFaceBookLogin}
            isForceEmail={true}
            userIp={userIp}
          />
        );
      }
    }
  };

  const handleFaceBookLogin = async (userData) => {
    const new_sokul_id = getCookie("sokul_X73ysdf4s") || null;
    if (pid) userData["affiliateId"] = pid;
    if (cid) userData["affiliateCode"] = cid;
    if (click_id) userData["affiliateCode"] = click_id;
    if (new_sokul_id) userData["sokulId"] = new_sokul_id;
    const res = await facebookLogin(userData, userIp);
    if (res?.data?.data?.user) {
      const bonus = await getWelcomePurchaseBonus();
      setWelcomeBonusPurchase(bonus);
      setUserIp(res?.data?.user?.ip);
      setAuthData(res?.data);
      clearModals();
      if (res?.data?.user?.newGtmUser) {
        trackSignUpEvent({
          userId: res?.data?.data?.user?.userId,
          affiliateId: pid,
          clickId: click_id || cid,
        });
      }
    } else if (res?.success) {
      toast.error(res?.data?.errors[0]?.description);
    } else {
      toast.error("Something went wrong.");
    }
  };

  const handleAppleLogin = async (response) => {
    const new_sokul_id = getCookie("sokul_X73ysdf4s") || null;
    if (response && !response.error) {
      if (!visitorData) {
        toast.error("Please disable your ad blocker or privacy shields and refresh the page to continue. Our security system requires device verification.");
        return;
      }
      if (!visitorData?.visitorId || !visitorData?.requestId) {
        toast.error("Device verification in progress. Please wait a moment and try again.");
        return;
      }
      const userData = {
        ...response,
        isSignup: true,
        fingerprintVisitorId: visitorData?.visitorId,
        fingerprintRequestId: visitorData?.requestId,
      };
      if (pid) userData["affiliateId"] = pid;
      if (cid) userData["affiliateCode"] = cid;
      if (click_id) userData["affiliateCode"] = click_id;
      if (new_sokul_id) userData["sokulId"] = new_sokul_id;
      const result = await appleLogin(userData, userIp);
      if (result && result?.success) {
        const bonus = await getWelcomePurchaseBonus();
        setWelcomeBonusPurchase(bonus);
        setUserIp(result?.data?.user?.ip);
        setAuthData(result?.data);
        clearModals();
        if (result?.data?.user?.newGtmUser) {
          trackSignUpEvent({
            userId: result?.data?.user?.userId,
            affiliateId: pid,
            clickId: click_id || cid,
          });
        }
        toast.success("Successfully logged in with Apple.");
      } else {
        toast.error(result?.message || "Failed to login with Apple.");
      }
    } else {
      toast.error("Apple login failed. Please try again.");
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleGoogleLoginWithDelay = async () => {
    setIsLoadingGoogle(true);
    await delay(3500);
    handleGoogleLogin();
    setIsLoadingGoogle(false);
  };

  const handleFacebookClickWithDelay = async () => {
    setIsLoadingFacebook(true);
    await delay(3500);
    handleFacebookClick();
    setIsLoadingFacebook(false);
  };

  return {
    appleScriptLoaded,
    formState,
    isInitialLoading,
    isPending,
    isLoadingGoogle,
    isLoadingFacebook,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    isPasswordVisible,
    setIsPasswordVisible,
    isTermsAccepted,
    setIsTermsAccepted,
    updateTermsAccepted,
    handleSubmit,
    handleGoogleLoginWithDelay,
    handleFacebookClickWithDelay,
    handleAppleLogin,
    formAction,
    openModal,
    closeModal,
    OtpVerification,
    Signup,
  };
} 