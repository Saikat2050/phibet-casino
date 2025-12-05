import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const walletSocket = io(`${URL}/wallet`, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
  multiplex: true,
  // auth: {
  //   token: accessToken,
  // },
});

export const adminSocket = io(`${URL}/admin_notification`, {
 transports: ['websocket'],
  withCredentials: true,
  autoConnect: false, // Controlled manually
  multiplex: true,
  // auth: {
  //   token: accessToken,
  // },
});
