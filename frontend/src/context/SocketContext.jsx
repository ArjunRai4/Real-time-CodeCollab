import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import PageLoader from "../components/PageLoader";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
      setIsReady(true);
    });    

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  if (!isReady) return <PageLoader/>;

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
