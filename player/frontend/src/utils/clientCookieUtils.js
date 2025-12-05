export function getCookie(name) {
  if (typeof document === "undefined") return null; // Check if we're on client-side

  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

export function deleteAllClientCookies() {
  if (typeof document === "undefined") return; // Check if we're on client-side
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const cookieName = cookie.split("=")[0].trim();
    // Condition to skip deleting cookie with dailyBonus in its name.
    if (
      cookieName.includes("dailyBonus") ||
      cookieName.includes("sokul_X73ysdf4s") ||
      /gcl/i.test(cookieName)
    ) {
      continue;
    }
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export const setBrowserCookie = (name, value, hours = 24) => {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
};

export const getBrowserCookie = (name) => {
  const nameEQ = `${name}=`;
  // const cookies = document.cookie.split(";");

  // for (let cookie of cookies) {
  //     cookie = cookie.trim();
  //     if (cookie.indexOf(nameEQ) === 0) {
  //         return cookie.substring(nameEQ.length);
  //     }
  // }
  return null; // Return null if cookie is not found
};

export const deleteBrowserCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
