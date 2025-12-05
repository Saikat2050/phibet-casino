"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProtectAuth } from "@/store/useProtectAuth";
import AuthModal from "./AuthModal";
import { authSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { EMAIL, NextAuthCheck, PASSWORD } from "@/config/data";

export default function AuthCheck({ children, childrenRender }) {
  const { authData, isAuthorized, setAuthData } = useProtectAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [ErrorMap, setErrorMap] = useState("");

  const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT == "development";

  useEffect(() => {
    const checkAuth = () => {

  
       
      const localStorageAuth = localStorage.getItem("authData");

      if (!isDevelopment) {
        return;
      }

      if (localStorageAuth) {
        try {
          const parsedAuthData = JSON.parse(localStorageAuth);
          authSchema.parse(parsedAuthData);
          setAuthData(parsedAuthData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Invalid auth data in local storage:", error.errors);
            localStorage.removeItem("authData");
          }
        }
      }
    };

    checkAuth();
  }, [setAuthData]);

  const handleSignIn = (username, password) => {
    try {
      authSchema.parse({ username, password });

      if (username === EMAIL && password === PASSWORD) {
        setAuthData({ username, password });
        localStorage.setItem(
          "authData",
          JSON.stringify({ username, password })
        );
        setAuthFailed(false);
      } else {
        setAuthFailed(true);
        router.push("/not-authorized-user");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.errors);
        setErrorMap(error.errors);
        throw new Error(error.errors.map((e) => e.message).join(", "));
      }
    }
  };
  const isNotAuthorizedRoute = pathname === "/not-authorized-user";
  let home = pathname === "/";
  if(!isDevelopment){
    return children;
  }
  if (isNotAuthorizedRoute || ErrorMap) {
    // Render children directly if on 'not-authorized-user' route
 
    return childrenRender;
  }
  if (!isAuthorized && (!authFailed || home)) {
    return <AuthModal handleSignIn={handleSignIn} />;
  }
  if (!isNotAuthorizedRoute) {
    // Render children directly if on 'not-authorized-user' route
    return children;
  }
}
