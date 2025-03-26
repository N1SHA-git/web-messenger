  import { UserId } from "@/kernel/ids";
  import { io } from "socket.io-client";

  const BASE_URL = "http://localhost:8000"; // url for socket in prod: '/'

  export const socket = io(BASE_URL, {
    path: "/socket.io/",
    transports: ["websocket"],
    autoConnect: false,
  });

  export const connectSocket = (userId: UserId) => {
    if (!userId || socket.connected) return;

    socket.io.opts.query = { user_id: userId };
    socket.connect();
  };

  export const disconnectSocket = () => {
    if (socket.connected) socket.disconnect();
  };
