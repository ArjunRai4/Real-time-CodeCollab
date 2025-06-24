// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import PageLoader from "../components/PageLoader";

const SocketContext = createContext();

const useProvideSocket = () => {
  const socketRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState({});
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const userId = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:4000", { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsReady(true);
    });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.disconnect();
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                          
      // Turn off mic and camera immediately
      stream.getTracks().forEach((track) => (track.enabled = false));

      localStream.current = stream;
      return stream;
    } catch (error) {
      console.error("Media access error:", error);
    }
  };

  
  const handleOffer = async ({ from, offer }) => {
    const peer = createPeerConnection(from);

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    localStream.current.getTracks().forEach(track => {
      peer.addTrack(track, localStream.current);
    });

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socketRef.current.emit("answer", { to: from, answer, from: userId.current });
  };

  const handleAnswer = async ({ from, answer }) => {
    const peer = peerConnections.current[from];
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = ({ from, candidate }) => {
    const peer = peerConnections.current[from];
    if (peer) {
      peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createPeerConnection = (peerId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          to: peerId,
          candidate: event.candidate,
          from: userId.current,
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStreams((prev) => ({ ...prev, [peerId]: event.streams[0] }));
    };

    peerConnections.current[peerId] = peer;
    return peer;
  };

  return {
    socket: socketRef.current,
    localStream,
    remoteStreams,
    startLocalStream,
    isReady,
  };
};

// Socket context provider
export const SocketProvider = ({ children }) => {
  const socketValue = useProvideSocket();

  if (!socketValue.isReady) return <PageLoader />;

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook
export const useSocket = () => useContext(SocketContext);
