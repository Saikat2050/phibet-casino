'use client';
import { useEffect, useState } from 'react';
import LoggedInPage from "../components/LoggedInPage";
import NotLoggedInPage from "../components/NotLoggedInPage";
import Loading from "../utils/loading";
import useUserStore from '@/store/useUserStore';

function getBrowserCookie(name) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, ...rest] = cookie.split('=');
    const cookieValue = rest.join('=');
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue.trim());
    }
  }
  return null;
}
export default function Home() {
  const { isAuthenticated } = useUserStore();
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    console.log("All cookies:", document.cookie); // Debug: print all cookies
    setToken(getBrowserCookie('accessToken'));
  }, [isAuthenticated]);
  console.log(":::::::token", token)
  if (token === undefined) return <Loading />;

  return token ? <LoggedInPage /> : <NotLoggedInPage />;
}