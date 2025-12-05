"use client";
import useSubCategoryStore from "@/store/useSubCategoryStore";
import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
const RedirectLinkToLobby = ({ children }) => {
  const { clearSearchedGames , setSearchTerm , setSelectedSubcategoryGames, setSelectedProvider,  setSelectedProviderName} = useSubCategoryStore();
  const pathname = usePathname()
  return (
    <Link
      href={"/"}
      onClick={async () => {
        if (pathname !== "/") {
          await clearSearchedGames()
          await setSearchTerm('')
          await setSelectedSubcategoryGames([])
          await setSelectedProvider(null)
          await setSelectedProviderName("");
        }
        
      }
      }
      className="flex items-center"
    >
      {children}
    </Link>
  );
};

export default RedirectLinkToLobby;
