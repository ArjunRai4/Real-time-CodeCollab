import React from "react";

const RoomSidebar = ({ participants }) => {
  return (
    <div className="w-64 bg-base-200 p-4 border-r border-base-300">
      <h2 className="font-bold mb-3 text-lg">👥 Participants</h2>
      <ul className="space-y-2 text-sm">
        {participants.map((p, index) => (
        <li key={p.socketId || p.userId || index} className="truncate flex items-center gap-2">
            <span className="text-green-500">●</span>
            {p.username}
        </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomSidebar;
