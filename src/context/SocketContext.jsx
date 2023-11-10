/* eslint-disable react/prop-types */
import { createContext, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useSelector } from "react-redux";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { socket, connectSocket, disconnectSocket } = useSocket(
    `${import.meta.env.VITE_APP_SOCKET_URL}/orders/cashier`
  );
  const { token } = useSelector((store) => store.auth);

  useEffect(() => {
    if (token) {
      connectSocket();
    }
  }, [token, connectSocket]);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
    }
  }, [token, disconnectSocket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
