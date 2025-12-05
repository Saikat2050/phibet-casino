"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Cross from "../../../assets/images/Cross";

function DemoGame() {
  const pathname = usePathname();
  const router = useRouter();
  const selectedGame = pathname.split("/")[2];
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative h-[calc(100dvh_-_170px)] w-full pt-[56.25%]">
      <div
        className="absolute z-10 top-2 right-2 cursor-pointer"
        onClick={() => router.push("/")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
       
        <button className="text-white px-3 py-1 rounded-lg hover:rotate-90 transition-transform duration-200"> <Cross /></button>
      </div>

      <iframe
        src={`../demoGames/${selectedGame}/index.html`}
        title="HTML Content"
        className="absolute top-0 left-0 w-full h-full border-none"
      />
    </div>
  );
}

export default DemoGame;
