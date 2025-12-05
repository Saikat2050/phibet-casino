import { useState, useEffect } from "react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useActionState } from "react";
import { appleLogin, facebookLogin, googleLogin, loginAction } from "@/actions";
import { toast } from 'react-toastify';
import useModalsStore from "@/store/useModalsStore";
import useUserStore from "@/store/useUserStore";
import { useGoogleLogin } from "@react-oauth/google";
import OtpVerification from "@/components/Auth/OtpVerification";
import ForcedEmailModal from "@/components/Auth/ForcedEmailModal";
import { useIP } from "@/utils/ipUtils";
import Signup from "@/components/Auth/Signup";
import Login from "@/components/Auth/Login";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import { getCookie, setBrowserCookie } from "@/utils/clientCookieUtils";

export default function useLogin() {
  const { data: visitorData } = useVisitorData(
    { extendedResult: false, ignoreCache: true },
    { immediate: true },
  );
  const [appleScriptLoaded, setAppleScriptLoaded] = useState(false);
  const { clearModals, openModal, setIsCloseNeed, closeModal } = useModalsStore();
  const [formState, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, user, setIsLoggedIn, setUserIp, userIp, setAuthData } = useUserStore();
  const [isFbSdkReady, setIsFbSdkReady] = useState(false);

  useIP(setUserIp);

  // Remove handleSubmit and loading state for form submission

  useEffect(() => {
    console.log(":::::::formState", formState)
    if (formState?.data) {
      toast.success(formState?.message || "Logged in successfully");
      setAuthData(formState.data);
      if (formState.data.accessToken) {
        setBrowserCookie("accessToken", formState.data.accessToken);
      }
      clearModals();
    } else if (formState?.apiErrors) {
      toast.error(formState?.apiErrors || "Failed to Login. Please try again.");
    }
  }, [formState]);

  useEffect(() => {
    if (user && user?.isEmailVerified == false) {
      openModal(<OtpVerification email={user?.email} />);
    }
  }, [user]);

  // const fetchData = async (data) => {
  //   const res = await googleLogin(data, userIp);
  //   if (res && res?.success) {
  //     setIsLoggedIn(true);
  //     setUser(res?.data?.user);
  //     clearModals();
  //   } else {
  //     toast.error(res?.message || "Failed to login with Google.");
  //   }
  // };

  // const handleGoogleLogin = useGoogleLogin({
  //   onSuccess: (tokenResponse) => {
  //     if (tokenResponse) {
  //       if (!visitorData) {
  //         toast.error("Please disable your ad blocker or privacy shields and refresh the page to continue. Our security system requires device verification.");
  //         return;
  //       }
  //       if (!visitorData?.visitorId || !visitorData?.requestId) {
  //         toast.error("Device verification in progress. Please wait a moment and try again.");
  //         return;
  //       }
  //       const userData = {
  //         credential: tokenResponse.access_token,
  //         isSignup: true,
  //         isTermsAccepted: true,
  //         fingerprintVisitorId: visitorData?.visitorId,
  //         fingerprintRequestId: visitorData?.requestId,
  //       };
  //       fetchData(userData);
  //     }
  //   },
  //   onError: (errorResponse) => console.log(errorResponse),
  // });

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  //   script.onload = () => setAppleScriptLoaded(true);
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  // const handleFacebookClick = () => {
  //   FB.login(
  //     function (response) {
  //       if (response && response.authResponse && response.authResponse.userID) {
  //         FB.api(
  //           `/${response.authResponse.userID}`,
  //           { fields: ["first_name", "last_name", "email"] },
  //           function (_response) {
  //             responseFacebook(_response);
  //           }
  //         );
  //       }
  //     },
  //     { scope: "public_profile,email" }
  //   );
  // };

  // const responseFacebook = (response) => {
  //   if (!visitorData) {
  //     toast.error("Please disable your ad blocker or privacy shields and refresh the page to continue. Our security system requires device verification.");
  //     return;
  //   }
  //   if (!visitorData?.visitorId || !visitorData?.requestId) {
  //     toast.error("Device verification in progress. Please wait a moment and try again.");
  //     return;
  //   }
  //   const userData = {
  //     firstName: response.first_name,
  //     lastName: response.last_name,
  //     userId: response.id,
  //     email: response.email,
  //     isSignup: true,
  //     isTermsAccepted: true,
  //     isForceEmail: false,
  //     fingerprintVisitorId: visitorData?.visitorId,
  //     fingerprintRequestId: visitorData?.requestId,
  //   };
  //   if (response && response.email) {
  //     handleFaceBookLogin(userData);
  //   } else {
  //     closeModal(<Login />);
  //     openModal(
  //       <ForcedEmailModal
  //         userData={userData}
  //         handleFaceBookLogin={handleFaceBookLogin}
  //         isForceEmail={true}
  //         userIp={userIp}
  //       />
  //     );
  //   }
  // };

  // const handleFaceBookLogin = async (userData) => {
  //   const res = await facebookLogin(userData, userIp);
  //   if (res?.data?.data?.user) {
  //     setIsLoggedIn(true);
  //     setUser(res?.data?.data?.user);
  //     clearModals();
  //     setLoading((prev) => !prev);
  //   } else if (Array.isArray(res?.data?.errors) && res?.data?.errors.length > 0) {
  //     const errorMessage = res?.data?.errors[0]?.description || "Failed to login with Facebook.";
  //     toast.error(errorMessage);
  //   } else {
  //     toast.error(res?.message || "Failed to login with Facebook..");
  //   }
  // };

  // const handleAppleLogin = async (response) => {
  //   if (response && !response.error) {
  //     if (!visitorData) {
  //       toast.error("Please disable your ad blocker or privacy shields and refresh the page to continue. Our security system requires device verification.");
  //       return;
  //     }
  //     if (!visitorData?.visitorId || !visitorData?.requestId) {
  //       toast.error("Device verification in progress. Please wait a moment and try again.");
  //       return;
  //     }
  //     const userData = {
  //       ...response,
  //       isSignup: false,
  //       fingerprintVisitorId: visitorData?.visitorId,
  //       fingerprintRequestId: visitorData?.requestId,
  //     };
  //     const result = await appleLogin(userData, userIp);
  //     if (result && result?.success) {
  //       setIsLoggedIn(true);
  //       setUser(result.data.user);
  //       clearModals();
  //       toast.success("Successfully logged in with Apple.");
  //     } else {
  //       toast.error(result?.message || "Failed to login with Apple.");
  //     }
  //   } else {
  //     toast.error("Apple login failed. Please try again.");
  //   }
  // };

  const handleCloseModal = () => {
    clearModals();
  };

  return {
    // appleScriptLoaded,
    formState,
    email,
    setEmail,
    password,
    setPassword,
    isPasswordVisible,
    setIsPasswordVisible,
    isAgreed,
    setIsAgreed,
    // loading, // removed
    // setLoading, // removed
    // handleSubmit, // removed
    formAction, // for use as <form action={formAction}>
    // handleGoogleLogin,
    // handleFacebookClick,
    // handleAppleLogin,
    handleCloseModal,
    user,
    openModal,
    closeModal,
    OtpVerification,
    Signup,
    ForgotPassword,
    // responseFacebook,
    setUser,
    setIsLoggedIn,
    setUserIp,
    userIp,
    isPending,
  };
} 