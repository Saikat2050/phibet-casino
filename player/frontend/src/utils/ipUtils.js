import { useEffect } from "react";

let cachedIP = null;

export async function getIP() {
  if (cachedIP) {
    return cachedIP;
  }
  try {
    try {
      const res = await fetch('/api/ip');
      const data = await res.json();
      console.log(data.ip, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.ip");
      return data.ip;
    } catch (err) {
      console.log('Failed to fetch IP');
      console.error(err);
    }
    // const response = await fetch('https://api.ipify.org?format=json');
    // console.log(response, '::::::::::::::::::::::::::::::get Ip res 2222222222222222222 response')
    // const data = await response.json();
    // cachedIP = data.ip; // Store just the IP string
    // return cachedIP;
  } catch (error) {
    console.error("Failed to fetch IP:", error);
    return "0.0.0.0";
  }
}

export function useIP(setUserIp) {
  useEffect(() => {
    (async () => {
      try {
        const ip = await getIP();
        console.log(ip, '::::::::::::::::::::::::::::::get Ip res 2222222222222222222')
        setUserIp(ip);
      } catch (error) {
        console.error("Failed to fetch IP:", error);
        setUserIp("0.0.0.0");
      }
    })();
  }, [setUserIp]);
} 