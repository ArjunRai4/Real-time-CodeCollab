// src/components/VideoPanel.jsx
import React from "react";
import { useUserContext } from "../context/AuthContext";

const VideoPanel = ({ participants = [] }) => {
  const { user } = useUserContext();

  return (
    <div className="w-full bg-base-200 border-t border-base-300 p-2 flex gap-4 overflow-x-auto">
      {participants.map((p) => (
        <div
          key={p._id}
          className="relative min-w-[150px] h-[100px] bg-black rounded-lg flex items-center justify-center text-white text-sm"
        >
          {/* Placeholder for video */}
          <span className="absolute top-1 left-1 text-xs text-gray-300">
            {p.username === user.username ? "You" : p.username}
          </span>
          <div className="text-xs opacity-50">Video Stream</div>

          {/* Controls could go here later */}
        </div>
      ))}
    </div>
  );
};

export default VideoPanel;
