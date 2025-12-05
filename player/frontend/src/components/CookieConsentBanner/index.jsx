/* "use client";
import React from "react";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="ACCEPT"
      declineButtonText="DECLINE"
      cookieName="cookie_consent"
      style={{
        background: "#4a4a4a",
        width: "90%",
        left: "50%",
        translate: "-50% -20px",
        borderRadius: "16px",
        alignItems: "center",
        padding: "16px 25px",
        fontSize: "16px",
      }} // Tailwind's
      enableDeclineButton
      onDecline={() => {
      }}
      expires={365}
      buttonStyle={{
        background: "#007ad0",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "700",
        height: "36px",
        lineHeight: "18px",
        padding: "9px 0",
        textAlign: " center",
        textTransform: " uppercase",
        width: "122px",
        color: "#fff",
      }}
      flipButtons
    >
      <div
        className="text-md text-white font-semibold "
        style={{ lineHeight: "1.3" }}
      >
        This website uses cookies to enhance user experience and to analyze
        performance and traffic on our website. We also share information about
        your use of our site with our social media, advertising, and analytics
        partners.
        <Link href="/cookie-notice" className="ml-1 underline text-blue-400">
          Cookie Notice
        </Link>
      </div>
    </CookieConsent>
  );
};

export default CookieConsentBanner;
 */

"use client";
import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const {
    user,
  } = useUserStore();
  const trackConsentAcceptEvent = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "consent",
        cookie_consent: "accepted",
        user_id: user?.userId || "anonymous",
      });
    }
  };

  const trackConsentDeclineEvent = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "consent",
        cookie_consent: "declined",
      });
    }
  };

  useEffect(() => {
    // Check if cookie consent has been given
    const consentStatus = localStorage.getItem("cookie_consent");
    setShowBanner(!consentStatus);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowBanner(false);
    trackConsentAcceptEvent()
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShowBanner(false);
    trackConsentDeclineEvent()
  };

  return showBanner ? (
    <CookieConsent
      location="bottom"
      buttonText="ACCEPT"
      declineButtonText="DECLINE"
      cookieName="cookie_consent"
      style={{
        background: "#4a4a4a",
        width: "90%",
        left: "50%",
        translate: "-50% -20px",
        borderRadius: "16px",
        alignItems: "center",
        padding: "16px 25px",
        fontSize: "16px",
      }}
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      expires={365}
      buttonStyle={{
        background: "#007ad0",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "700",
        height: "36px",
        lineHeight: "18px",
        padding: "9px 0",
        textAlign: "center",
        textTransform: "uppercase",
        width: "122px",
        color: "#fff",
      }}
      flipButtons
    >
      <div
        className="text-md text-white font-semibold"
        style={{ lineHeight: "1.3" }}
      >
        This website uses cookies to enhance user experience and to analyze
        performance and traffic on our website. We also share information about
        your use of our site with our social media, advertising, and analytics
        partners.
        {/* <Link href="/privacy-policy" className="ml-1 underline text-blue-400">
          Privacy Policy
        </Link> */}
        <Link href="/VCPP1.0.pdf" className="ml-1 underline text-blue-400">
          Privacy Policy
        </Link>
        {/*  <Link href="/VCPP1.0.pdf" className="ml-1 underline text-blue-400">
          Privacy Policy
        </Link> */}
      </div>
    </CookieConsent>
  ) : null;
};

export default CookieConsentBanner;
