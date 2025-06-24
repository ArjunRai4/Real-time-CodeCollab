// src/components/VideoPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useSocket } from "../context/SocketContext";

const VideoBox = ({ isCurrentUser, userId, username, localVideoRef, micOn, cameraOn, toggleMic, toggleCamera, remoteStream }) => {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (!isCurrentUser && remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, isCurrentUser]);

  return (
    <div className="relative min-w-[150px] h-[100px] bg-black rounded-lg flex items-center justify-center text-white text-sm overflow-hidden">
      <span className="absolute top-1 left-1 text-xs text-gray-300">
        {isCurrentUser ? "You" : username}
      </span>

      {isCurrentUser ? (
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover rounded"
        />
      ) : remoteStream ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded"
        />
      ) : (
        <div className="text-xs opacity-50">Waiting for stream...</div>
      )}

      {isCurrentUser && (
        <div className="absolute bottom-1 right-1 flex gap-2">
          <button
            onClick={toggleMic}
            className="bg-white text-black rounded p-1 text-xs hover:bg-gray-100"
          >
            {micOn ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
          <button
            onClick={toggleCamera}
            className="bg-white text-black rounded p-1 text-xs hover:bg-gray-100"
          >
            {cameraOn ? <Video size={16} /> : <VideoOff size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};

const VideoPanel = ({ participants = [] }) => {
  const { user } = useAuth();
  const { localStream, remoteStreams } = useSocket();

  const localVideoRef = useRef(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (localStream.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
      setStream(localStream.current);
    }
  }, [localStream.current]);

  useEffect(() => {
    async function getMediaStream() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        userStream.getVideoTracks().forEach((track) => (track.enabled = false));
        userStream.getAudioTracks().forEach((track) => (track.enabled = false));

        setStream(userStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Failed to get media stream", err);
      }
    }

    getMediaStream();
  }, []);

  const toggleMic = () => {
    if (stream) {
        const enabled = !micOn;
        stream.getAudioTracks().forEach((track) => (track.enabled = enabled));
        setMicOn(enabled);
    }
  };

  const toggleCamera = () => {
    if (stream) {
        const enabled = !cameraOn;
        stream.getVideoTracks().forEach((track) => (track.enabled = enabled));
        setCameraOn(enabled);
    }
  };  

  return (
    <div className="w-full bg-base-200 border-t border-base-300 p-2 flex gap-4 overflow-x-auto">
      {participants.map((p) => (
        <VideoBox
          key={p._id}
          isCurrentUser={p.username === user.username}
          userId={p.userId}
          username={p.username}
          localVideoRef={localVideoRef}
          micOn={micOn}
          cameraOn={cameraOn}
          toggleMic={toggleMic}
          toggleCamera={toggleCamera}
          remoteStream={remoteStreams[p._id]}
        />
      ))}
    </div>
  );
};

export default VideoPanel;
