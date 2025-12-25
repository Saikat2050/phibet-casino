import AuthCheck from "@/components/AuthCheck/AuthCheck";
import BottomMenuWrapper from "@/components/BottomMenuWrapper";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import FloatingComponent from "@/components/FloatingComponent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Modals from "@/components/Modals";
import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Outfit } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";
import FingerprintProvider from "@/components/FingerprintProvider";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import Loading from "../utils/loading";
const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Online Social Casino - Phibet!",
  description:
    "Phibet is the best US online casino offering over 1,000 social casino games from leading providers like Hacksaw, 3 Oaks, Booming, Novomatic and more!",
  keywords: "online casino, social casino, phibet",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=0",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
    appleBot: { index: true, follow: true },
  },
  // Add this for the favicon
  icons: {
    icon: '/favicon.ico',  // Path to your favicon file in the public folder
  },
};

export const viewport = {
  width: "device-width, shrink-to-fit=no",
  minimumScale: 1,
  initialScale: 1,
  userScalable: 0,
};

export const dynamic = "force-dynamic";

function LoadingFallback() {
  return <Loading />;
}

export default function RootLayout({ children, params: { locale }, pathname }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <html lang={locale}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0"
          />
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WHKXRFKK');`,
            }}
          />
        </Head>
        <body className={`${outfit.className}  -250`}>
          {/* Facebook SDK Script */}
          <Script
            id="facebook-jssdk"
            strategy="beforeInteractive"
            src="https://connect.facebook.net/en_US/sdk.js"
          />
          {/* Facebook SDK Initialization */}
          <Script
            id="facebook-sdk-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.fbAsyncInit = function() {
                  FB.init({
                    appId: '${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}',
                    cookie: true,
                    xfbml: true,
                    version: 'v21.0'
                  });
                  FB.AppEvents.logPageView();
                };
              `,
            }}
          />

          {/* Existing Scripts */}
          <Script
            id="g9904216750-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(g,e,o,t,a,r,ge,tl,y){
                t=g.getElementsByTagName(o)[0];y=g.createElement(e);y.async=true;
                y.src='https://g9904216750.co/gb?id=-OMl2S0fO9Tz5If3Y4MD&refurl='+g.referrer+'&winurl='+encodeURIComponent(window.location);
                t.parentNode.insertBefore(y,t);
              })(document,'script','head');`,
            }}
          />
          <Script
            src="https://js.finix.com/v/1/finix.js"
            strategy="beforeInteractive"
          />
          <Script
            src="https://pay.google.com/gp/p/js/pay.js"
            strategy="beforeInteractive"
          />
          <Script
            src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"
            strategy="beforeInteractive"
          />
       
          <noscript>
            <iframe
              id="gtm_hide"
              src="https://www.googletagmanager.com/ns.html?id=GTM-WHKXRFKK"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          <script src="https://sdk.nsureapi.com/sdk.js" async></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.nSureAsyncInit = function(deviceId) {
                window.nSureSDK.init('9JBW2RHC7JNJN8ZQ');
                window.nSureSDK.init({
                  appId: '9JBW2RHC7JNJN8ZQ',
                  partnerId: 'PHIBET'
                });
              };
            `,
            }}
          />
          <script
            src="https://hosted.paysafe.com/checkout/v2/paysafe.checkout.min.js"
            async
          ></script>
          <Script
            src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
            strategy="beforeInteractive"
          />

            <Suspense fallback={<LoadingFallback />}>
              <ErrorBoundary>
                <FingerprintProvider>
          <MaintenanceGuard>
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                  />
                  <div className="z-[2] relative mx-auto">
                    <Header />
                    <div className="flex flex-col h-dvh pt-header-height">
                      <div className="flex-grow">
                        {children}
                        <FloatingComponent />
                      </div>
                      <Modals />
                      <Footer />
                    </div>
                    {/* <CookieConsentBanner /> */}
                  </div>
          </MaintenanceGuard>
                </FingerprintProvider>
              </ErrorBoundary>
            </Suspense>
          <GoogleTagManager gtmId={"GTM-WHKXRFKK"} />
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}