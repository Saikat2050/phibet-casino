"use server";
import { redirect } from "next/navigation";
// import { toast } from 'react-toastify';
import { toast } from 'react-toastify';
import { loginUserSchema, signupSchema } from "./schemas/schema";
import { apiCalls } from "./utils/apiCalls";
import { deleteCookie, setCookie } from "./utils/cookiesHelper";
import { revalidatePath } from 'next/cache'


// export const fetchIp = async () => {
//   try {
//     const data = await fetch("http://api.ipify.org");
//       const IPdata = await data.text();
  
//     return IPdata;
//   } catch (error) {
//     console.error("Error fetching IP address:", error);
//     return null;
//   }
// };

export async function getIP() {
  try {
    const data = await fetch("http://checkip.amazonaws.com/");
    const IPdata = await data.text();
    return {
      data: IPdata,
    };
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export const loginAction = async (prevState, formData) => {
  // Use FormData API to get values
  const email = formData.get('email');
  const password = formData.get('password');

  const validatedFields = loginUserSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      // ...prevState,
      success: false,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      apiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }
  console.log({ email, password }, "::::::::::::::::::::formData")
  const data = {
    email,
    password: btoa(password),
  };
  const headers = {
    "user-ip": formData?.get('userIp'),
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for login")

  try {
    const response = await apiCalls.post("/user/login", { data, headers });

    const accessToken = response.headers.get("accessToken");

    if (accessToken) {
      setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 * 7 });
    }
    // if (response.status === 451) {
    //   throw new Error("redirectToAccessNotAllowed");
    // }

    const result = response.data;

    if (result?.errors[0]?.description) {
      throw new Error(result?.errors[0]?.description);
    }

    return {
      success: true,
      message: "Logged In Successfully",
      data: result.data,
    };
  } catch (error) {
    // if (error?.message === "redirectToAccessNotAllowed") {
    //   redirect("/access-not-allowed");
    // }
    return {
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to Login.",
    };
  }
};

export async function getSignUpPermissions(userIp) {
  const headers = {
    "user-ip": userIp,
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for signup permissions")

  try {
    const response = await apiCalls.get("/user/signup-allowed", { headers });
    const result = response.data;
    return result?.data;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get signup permissions.",
    };
  }
}

export async function submitOtp(data) {
/*   const IP = await getIP();
  const headers = {
    "user-ip": IP?.data,
  }; */

  try {
    const response = await apiCalls.post("/user/login", { data, headers });


    // Create a session with the JWT token
    setCookie("accessToken", response.data.user.accessToken, {
      maxAge: 60 * 60 * 24 * 7,
    }); // 1 week
    setCookie("refreshToken", response.data.user.refreshToken, {
      maxAge: 60 * 60 * 24 * 30,
    }); // 1 month
    return {
      success: true,
      message: "OTP verified and session created",
      data: response?.data,
    };
  } catch (error) {
    console.log("error***", error);
    return { success: false, message: error?.message };
  }
}

export async function resentOtpAction(data) {
  try {
    const response = await apiCalls.post("/user/resendVerifyEmail", { data });
    const result = response.data;


    return {
      success: true,
      message: result?.data?.message || "Otp sent to your email address",
      data: result?.data,
    };
  } catch (error) {
    console.log("error***", error);
    return { success: false, message: error?.message };
  }
}

export async function logoutUser() {
  deleteCookie("accessToken");
  revalidatePath("/");
}

export async function getProfile() {
  try {
    const response = await apiCalls.get("/user/profile");
    const result = response.data;
    return result?.data?.data;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get user profile.",
    };
  }
}

export async function getUserProfile() {
  try {
    const response = await apiCalls.get("/user/profile");
    const result = response.data;
    console.log(result, "  >>>>>>>>>>>> profile result");
    return result;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get user profile.",
    };
  }
}

export const submitProfileAction = async (formData, userIp) => {
  const headers = {
    "user-ip": userIp,
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for profile update")

  const data = {
    ...formData,
    country: 199,
    zipCode: formData?.postalCode,
    dateOfBirth: formData?.dateOfBirth,
    addressLine_1: formData?.address,
    state: formData?.state?.value,
  };

  try {
    console.log(data, ":::::::::::::::::::::::::::::::::data for profile update")
    const response = await apiCalls.post("/user/profile", { data, headers });
    const result = response.data;

    return result;
  } catch (error) {
    console.error("Error during API call:", error);
    return {
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to update profile.",
    };
  }
};

export const getCmsLinks = async () => {
  try {
    const response = await apiCalls.get("/user/cms");
    const result = response.data;
    return result?.data;
  } catch (error) {
    console.error("************/details/cms error", error);
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get footer links.",
    };
  }
};

export const getCmsData = async (data) => {
  try {
    const response = await apiCalls.get(`/user/cms-detail?pageSlug=${data}`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error("************/details/cms-detail error", error);
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get CMS details.",
    };
  }
};

export const getTransactionData = async (params) => {
  try {
    const response = await apiCalls.get("/payment/transactions", { params });
    const result = response.data;
    return result;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      apiErrors: e.message || "Something went wrong.",
      message: "Failed to get Transaction Data",
    };
  }
};

export const getGameHistoryData = async (params) => {
  try {
    const response = await apiCalls.get("/user/bets", { params });
    const result = response.data;
    return result;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      apiErrors: e.message || "Something went wrong.",
      message: "Failed to get Game History Data",
    };
  }
};

export const signupAction = async (prevState, formData) => {
  const validatedFields = signupSchema.safeParse({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    isTermsAccepted: formData.isTermsAccepted,
    browser: formData.browser,
    platform: formData.platform,
    promocode: formData.promocode,
  });

  console.log(formData, "::::::::::::::::::::::::::::::::::formData")

  if (!validatedFields.success) {
    return {
      // ...prevState,
      success: false,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input data",
    };
  }

  const data = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: btoa(formData.password),
    browser: formData.browser,
    isTermsAccepted: formData.isTermsAccepted,
    fingerprintVisitorId: formData.fingerprintVisitorId,
    fingerprintRequestId: formData.fingerprintRequestId,
    platform: formData.platform,
    promocode: formData.promocode,
    sokulId: formData.sokulId,
  };
  console.log(data, "::::::::::::::::::::data simple signup")
  if (formData.affiliateId) data.affiliateId = formData.affiliateId;
  if (formData.affiliateCode) data.affiliateCode = formData.affiliateCode;

  const headers = {
    "user-ip": formData?.userIp,
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for signup")

  try {
    const response = await apiCalls.post("/user/signup", {
      data: data,
      headers,
    });
    console.log(response, "::::::::::::::::signup response")
    const result = response.data;
    console.log(result, "::::::::::::::::signup response result")
    if (result?.errors?.length > 0) {
      throw new Error(result?.errors[0]?.description);
    }
    return {
      success: true,
      message: "Account successfully created!",
      data: result.data,
    };
  } catch (error) {
    console.log("error***", error);
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to create account.",
    };
  }
};

export const verifyEmailAction = async (formData,userIp) => {

  const headers = {
    "user-ip": userIp,
  };
  console.log(headers, "::::::::::::::::::headers of verifyEmailAction")
  const data = {
    otp: formData.otpValue,
    email: formData.email,
  };

  try {
    const response = await apiCalls.post("/user/verifyEmail", {
      data: data,
      headers,
    });

    // Get the accessToken from the headers
    const accessToken = response.headers.get("accessToken");
    const refreshToken = response.headers.get("refresh-token");

    // If accessToken exists, store it in cookies
    if (accessToken) {
      setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 * 7 }); // 1 week
    }

    // If refreshToken exists, store it in cookies
    if (refreshToken) {
      setCookie("refreshToken", refreshToken, { maxAge: 60 * 60 * 24 * 30 }); // 1 month
    }

    if (response.status === 400) {
      throw new Error("The Code you entered is invalid. Please try again.");
    }
    const result = response.data;

    return {
      success: true,
      message: "Email Verified Successfully",
      data: result.data,
    };
  } catch (error) {
    console.log("error***", error);
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to verify email.",
    };
  }
};

export async function revalidateCategory(path) {
  revalidatePath(path)
}

export async function getSubCategories(params) {
  try {
    const response = await apiCalls.get("/user/sub-category", { params });
    // if (response.status === 451) {
    //   throw new Error("redirectToAccessNotAllowed");
    // }
    const result = response.data;

    // revalidatePath('/');
    return result?.data?.data;
  } catch (error) {
    // if (error?.message === "redirectToAccessNotAllowed") {
    //   redirect("/access-not-allowed");
    // }
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get user profile.",
    };
  }
}

export async function launchGame({
  gameId,
  coin,
  // isMobile,
  // isDemo,
  // tournamentId,
}) {
  try {
    const response = await apiCalls.post("/user/launch-game", {
      data: {
        gameId,
        coin,
        // isMobile,
        // isDemo,
        // tournamentId,
      },
    });
    const result = response.data;
    return result;
  } catch (error) {
    let error_ = error?.message || "Something went wrong.";
    toast.error(error_);
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get user profile.",
    };
  }
}

export async function getPackages() {
  try {
    const response = await apiCalls.get("/user/packages?page=1&limit=100");
    const result = response.data;
    return result?.data?.data;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get packages.",
    };
  }
}

export async function fetchKYCSession(params) {
 /*  const IP = await getIP();
  const headers = {
    "user-ip": IP?.data,
  }; */
  try {
    const response = await apiCalls.get("/user/init-kyc", { params, headers });
    const result = response.data;
    return result.data;
  } catch (error) {
    console.error("Error fetching KYC session", error);
    throw new Error("Failed to initialize KYC session");
  }
}

export async function updateFavorite({ request, gameId }) {
  try {
    const response = await apiCalls.post("/user/favorite", {
      data: {
        request,
        gameId,
      },
    });
    const result = response.data;

    toast.success(
      `Successfully updated ${request ? "added to" : "removed from"} favorites`
    );
    // revalidatePath('/category/[slug]', 'page')
    return result;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to update favourite game.",
    };
  }
}

export async function getFavoriteGames(params) {
  try {
    const response = await apiCalls.get("/user/favorite", { params });
    const result = response.data.data;
    return result;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get favourite game",
    };
  }
}

export async function getProviderListing() {
  try {
    const response = await apiCalls.get("/user/get-provider");
    const result = response.data.data;
    return result;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get provider listing",
    };
  }
}

// export async function getGoogleUserProfile({ access_token }) {
//   try {
//     const response = await apiCalls.post(
//       "https://www.googleapis.com/oauth2/v3/userinfo",
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//         },
//       }
//     );
//     return response.json();
//   } catch (error) {
//     console.error("Error fetching Google user profile", error);
//     throw new Error("Failed to fetch Google user profile");
//   }
// }

export async function googleLogin(data,userIp) {

  const headers = {
    "user-ip": userIp,
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for google login")

  try {
    console.log(data, ":::::::::::::::::::::::::::::::::data for google login")
    const response = await apiCalls.post("/user/googleLogin", {
      data: data,
      headers,
    });
    const accessToken = response.headers.get("accessToken");

    if (accessToken) {
      setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 * 7 });
    }

    const result = response.data;

    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to login with google";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Error during Google login", error);
    return { success: false, apiErrors: error?.message || "Something went wrong.", message: "Failed to login with google" };
  }
}

export async function facebookLogin(data, userIp) {

  const headers = {
    "user-ip": userIp,
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for facebook login")

  try {
    console.log(data, ":::::::::::::::::::::::::::::::::data for facebook")
    const response = await apiCalls.post("/user/facebookLogin", {
      data: data,
      headers,
    });
    const accessToken = response.headers.get("accessToken");

    if (accessToken) {
      setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 * 7 });
    }

    const result = response.data;
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error during facebook login", error);
    return { success: false, apiErrors: error?.message || "Something went wrong.", message: "Failed to login with facebook" };
  }
}

export async function appleLogin(data, userIp) {

  const headers = {
    "user-ip": userIp,
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for apple login")

  try {


    console.log(data, ":::::::::::::::::::::::::::::::::data for apple login")
    const response = await apiCalls.post("/user/appleLogin", {
      data: data,
      headers,
    });
    const accessToken = response.headers.get("accessToken");

    if (accessToken) {
      setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 * 7 });
    }

    const result = response.data;

    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to login with Apple";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Error during Apple login", error);
    return { success: false, message: "Apple login failed. Please try again." };
  }
}

export async function getAccessAllowed(userIp) {
  //   const IP = await getIP();
  // const headers = {
  //   "user-ip": IP?.data,
  // };
  // console.log(headers, "::::::::::::::::::::::::::::::headers for access allowed")

  try {
    const response = await apiCalls.get("/user/accessAllowed", { headers });

    if (response.status === 451) {
      throw new Error("redirectToAccessNotAllowed");
    }
    const result = response.data;
    return result?.data?.data;
  } catch (error) {
    if (error?.message === "redirectToAccessNotAllowed") {
      redirect("/access-not-allowed");
    }
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get user profile.",
    };
  }
}

// Forgot password reset

export async function forgotPassword(prevState, formData) {
  const data = {
    email: formData.email,
  };

  try {
    const response = await apiCalls.post("/user/forgetPassword", {
      data: data,
    });
    const result = response.data;
    if (result?.errors?.length > 0) {
      throw new Error(result?.errors[0]?.description);
    }

    return {
      success: true,
      message: "Reset password link sent to your mail",
      data: result?.data,
    };
  } catch (error) {
    console.error("Error during forgot password", error);

    return {
      success: false,
      apiErrors: error.message || "Something went wrong.",
      message: "Failed to get user profile.",
    };
  }
}

export async function resetForgotPassword(prevState, formData) {
  const { password, confirmPassword, newPasswordKey } = formData;
  const data = {
    password: btoa(password),
    confirmPassword: btoa(confirmPassword),
    newPasswordKey,
  };

  try {
    const response = await apiCalls.post("/user/verifyForgetPassword", {
      data: data,
    });
    const result = response.data;

    if (result?.errors?.length > 0) {
      throw new Error(
        result?.errors[0]?.description || "Error resetting password."
      );
    }

    return {
      success: true,
      message: "Password has been reset successfully",
      data: result?.data,
    };
  } catch (error) {
    console.error("Error during reset password", error.message);

    return {
      success: false,
      apiErrors: error.message || "Something went wrong.",
      message: "Failed to reset password.",
    };
  }
}

export async function getCasinoGamesAction(data) {
  try {
    let params = {};
    if (data?.page && data?.limit) {
      params = { ...data };
    } else {
      params = { ...data, page: 1, limit: 10 };
    }
    const response = await apiCalls.get("/user/casino-games", {
      params: params,
    });
    const result = response.data;
    return result?.data?.data;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get casino games.",
    };
  }
}

export async function getVipTiersAction() {
  try {
    const response = await apiCalls.get("/rewards/tiers");
    const result = response.data;
    return result?.data?.tiers;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get VIP tiers.",
    };
  }
}

export async function updateProfilePic(data) {
  try {
    const response = await apiCalls.put("/user/profile", { data });
    const result = response.data;
    return result;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get VIP tiers.",
    };
  }
}

export async function sendOtpMobile(data) {
  try {
    // const response = await apiCalls.post("/user/phoneVerify", data);
    const response = await apiCalls.post("/user/phone", { data });
    const result = response.data;
    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Something went wrong";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to sent otp.",
    };
  }
}

export async function verifyOtpMobile(data, userIp) {
  const headers = {
    "user-ip": userIp,
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for verify otp")
  try {
    const response = await apiCalls.post("/user/phoneVerify", { data, headers });
    const result = response.data;
    return result;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to sent otp.",
    };
  }
}

export async function sendUserFeedback(data) {
  try {
    const response = await apiCalls.post("/user/feedback", { data });
    const result = response.data;
    return result;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to sent otp.",
    };
  }
}

export async function changePassword(data) {
  try {
    const response = await apiCalls.put("/user/changePassword", { data });
    const result = response.data;
    return result;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to changes password.",
    };
  }
}

export async function postRsg(data) {
  try {
    const response = await apiCalls.post("/user/responsible-gaming", {
      data,
    });
    const result = response.data;

    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Something went wrong";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to set self exclusion.",
    };
  }
}

export async function getDailyBonus() {
  try {
    const response = await apiCalls.get("/user/daily-bonus");
    const result = response.data;
    return result?.data?.data;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get Daily bonus.",
    };
  }
}

export async function getWelcomeBonus() {
  try {
    const response = await apiCalls.get("/user/welcome-bonus");
    const result = response.data;
    return result?.data?.data;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get Welcome bonus.",
    };
  }
}
export async function getWelcomePurchaseBonus() {
  try {
    const response = await apiCalls.get("/rewards/welcome-bonus");
    const result = response.data;
    return result?.data?.data;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get Welcome bonus.",
    };
  }
}

export async function claimWelcomeBonusAction(data) {
  const headers = {
    "user-ip": data.userIp,
  };
  console.log(headers, "::::::::::::::::::::::::::::::headers for claim welcome bonus")
  try {
    let response;
    if (data) {
      response = await apiCalls.post("/user/welcome-bonus", { data, headers });
    } else {
      response = await apiCalls.post("/user/welcome-bonus", { headers });
    }
    const result = response.data;


    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      // Check if there are any errors in the result and return the first error
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to claim bonus.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.log("error2323", error);
    return {
      success: false,
      message: "Something went wrong while claiming the bonus.",
    };
  }
}

export async function claimDailyBonusAction(data) {
  const headers = {
    "user-ip": data?.userIp,
  };

  console.log(headers, "::::::::::::::::::::::::::::::headers for claim daily bonus")

  try {
    const response = await apiCalls.post("/user/daily-bonus", {
      data,
      headers,
    });
    const result = response.data;


    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to claim bonus.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.log("error2323", error);
    return {
      success: false,
      message: "Something went wrong while claiming the bonus.",
    };
  }
}

export async function getBanners() {
  try {
    const response = await apiCalls.get("/user/banners");
    const result = response.data;
    return result?.data?.data;
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get Banners.",
    };
  }
}

// const initPay = (data) => postRequest('/payment/init-pay', data)

export async function getCashierAPIData() {
  try {
    const response = await apiCalls.get("/payment/payment-provider");
    const result = response.data;

    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    return {
      success: false,
      apiErrors: error?.message || "Something went wrong.",
      message: "Failed to get cashier data.",
    };
  }
}


export async function initPay(data,userIp) {
 
  const headers = {
    "user-ip": userIp,
  };
  console.log(headers, "::::::::::::::::::::initpay header")
  try {
    const response = await apiCalls.post("/payment/init-pay", {
      data,
      headers,
    });
    const result = response.data;
    console.log(result, ":::::::::::::::::::::::::result")
    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to init payment.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.log("error2323", error);
    return {
      success: false,
      apiErrors: error?.message,
      message: "Something went wrong while init payment.",
    };
  }
}

export async function paysafePay(transactionId) {
  try {
    const response = await apiCalls.get(
      `/payment/transactions/${transactionId}`
    );
    const result = response.data;

    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to retrieve transaction details.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return {
      success: false,
      message: "Something went wrong while retrieving transaction details.",
    };
  }
}

export async function getStateListingAction(data) {
  try {
    const response = await apiCalls.get("/user/state", { params: data });
    const result = response.data;

    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to fetch state listing.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("getStateListingAction error:", error);
    return {
      success: false,
      message: "Something went wrong while fetching state listings.",
    };
  }
}

export async function getCityListingAction(data) {
  try {
    const response = await apiCalls.get("/user/city", { params: data });
    const result = response.data;

    if (response.ok) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to fetch city listing.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("getCityListingAction error:", error);
    return {
      success: false,
      message: "Something went wrong while fetching city listings.",
    };
  }
}


export async function validatePromoCode(data) {
  try {
    const response = await apiCalls.post("/payment/promocode", { params: data });
    const result = response.data;
    if (response.ok) {
      // toast.success("Promo Code Applied Successfully");
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to validate promo code.";
      // toast.error(errorMessage||"Something went wrong.")
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("validatePromoCode error:", error);
    return {
      success: false,
      message: "Something went wrong while validating the promo code.",
    };
  }
}


export async function removePromotionCode(data) {
  try {
    const response = await apiCalls.delete("/payment/promocode", { params: data });
    const result = response.data;
    if (response.ok) {
      // toast.success("Promo Code Applied Successfully");
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to remove promo code.";
      // toast.error(errorMessage||"Something went wrong.")
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("removePromoCode error:", error);
    return {
      success: false,
      message: "Something went wrong while removing the promo code.",
    };
  }
}





export async function getRedemptionRequestsAction(data) {
  try {
    const response = await apiCalls.get("/payment/redeem-request", {
      params: data,
    });
    const result = response.data;
    if (response.ok) {
      return { success: true, data: result?.data?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to fetch redemption requests.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("getRedemptionRequestsAction error:", error);
    return {
      success: false,
      message: "Something went wrong while fetching redemption requests.",
    };
  }
}

export async function cancelRedemptionRequestAction(data) {
  try {
    const response = await apiCalls.put("/payment/redeem-request", { data });
    const result = response.data;

    if (response.ok) {
      return {
        success: true,
        message: result?.message || "Request canceled successfully.",
      };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to cancel redemption request.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("cancelRedemptionRequestAction error:", error);
    return {
      success: false,
      message: "Something went wrong while canceling the redemption request.",
    };
  }
}

export async function getBanksAction() {
  try {
    const response = await apiCalls.get("/payment/redeem/pay-by-bank");
    const result = response.data;

    if (response.ok) {
      const bankDetails = result?.data?.bankDetails || [];
      if (bankDetails.length > 0) {
        return { success: true, data: bankDetails }; // List of banks
      } else {
        return {
          success: false,
          message: "No bank accounts found. Please add a new bank account.",
        };
      }
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to fetch bank accounts.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("getBanksAction error:", error);
    return {
      success: false,
      message: "Something went wrong while fetching bank accounts.",
    };
  }
}

export async function addBankAction(bankDetails) {
  try {
    const response = await apiCalls.post("/payment/redeem/pay-by-bank", {
      data: bankDetails,
    });
    const result = response.data;
    if (response.ok) {
      return {
        success: true,
        data: result?.data,
        message: result?.message || "Bank account added successfully.",
      };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to add the bank account.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("addBankAction error:", error);
    return {
      success: false,
      message: "Something went wrong while adding the bank account.",
    };
  }
}

export const createPaymentInstrument = async (data) => {
  try {
    console.log(data, "::::::::::::::::::::::::::::::data for createPaymentInstrument")
    const response = await apiCalls.post("/payment/finix/create-instrument", { data });
    const result = response.data;
    console.log(result, "result of createPaymentInstrument");
    return result;
  } catch (error) {
    console.error('Error creating payment instrument:', error);
    throw error;
  }
};

export const createApplePaymentInstrument = async (data) => {
  try {
    const response = await apiCalls.post("/payment/finix/create-apple-session", { data });
    const result = response.data; 
    console.log(result, "result of createApplePaymentInstrument");
    return result;
  }
  catch (error) {
    console.error('Error creating Apple payment instrument:', error);
    throw error;
  }
}

export const createApplePaySession = async (data)=>{
  try {
    const response = await apiCalls.post("/payment/finix/apple-pay-session",{data});
    const result = response.data;
    console.log(result, ">>>>>>>>>>>>>>>..apple pay session");
    return result;
  } catch (error) {
    console.log('error while creating apple pay session', error);
    throw error;
  }
}

export const getAppleFinixMerchantIdentity = async () => {
  try {
    const response = await apiCalls.get("/payment/finix/apple-pay-info");
    const result = response.data;
    console.log(result, "result of getAppleFinixMerchantIdentity");
    return result;
  } catch (error) {
    console.error('Error fetching Apple Finix merchant identity:', error);
    throw error;
  }
}

export async function getTermsAndConditionsAction() {
  try {
    const response = await apiCalls.get("/user/get-terms-conditions");
    const result = response.data;
    console.log(result.data, ":::::::::::::::::::::::::this is result")
    if (result.data.success) {
      return { success: true, data: result?.data };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to fetch terms and condition.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("terms error: ", error);
    return {
      success: false,
      message: "Something went wrong while fetching Terms and Conditions.",
    };
  }
}

export async function updateTermsAndConditionsAction(data) {
  try {
    console.log(data, ":::::::::::::::::::::::::::::::data")
    const response = await apiCalls.put("/user/update-terms-conditions", { data });
    const result = response.data;
   
    
    if (response.ok) {
      return { 
        success: true, 
        data: result?.data,
        message: "Terms and conditions updated successfully."
      };
    } else {
      const errorMessage =
        result?.errors?.[0]?.description ||
        result?.message ||
        "Failed to update terms and conditions.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Update terms error: ", error);
    return {
      success: false,
      message: "Something went wrong while updating Terms and Conditions.",
    };
  }
}
