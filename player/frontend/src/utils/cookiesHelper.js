import { cookies } from "next/headers";
import { revalidatePath } from 'next/cache'

export function setCookie(name, value, options = {}) {
  const cookieOptions = {
    path: "/",
    ...options,
  };

  cookies().set(name, value, cookieOptions);
}

// export function getCookie(name, { req } = {}) {
//   if (req) {
//     return req.cookies.get(name);
//   }
//   return cookies().get(name);
// }

export function deleteCookie(name) {
  cookies().set(name, "", { path: "/", expires: new Date(0) });
  revalidatePath('/', 'layout')
}
export function deleteAllCookies() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  // Delete each cookie by setting it to expire
 /*  allCookies.forEach((cookie) => {
    if (cookie.name !== "sokul_X73ysdf4s" || !/gcl/i.test(cookie.name)) {
      cookieStore.set(cookie.name, "", {
        path: "/",
        expires: new Date(0),
        maxAge: 0,
      });
    }
  }); */
}

export function getCookie(name, { req } = {}) {
  let cookie;

  if (req) {
    cookie = req.cookies.get(name);
  } else {
    cookie = cookies().get(name);
  }

  return cookie;
}
