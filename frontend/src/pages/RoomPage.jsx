import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom'
import PageLoader from '../components/PageLoader';
import { useEffect } from 'react';
import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import AiSidebar from "../components/AiSidebar";
import { Bot } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import RoomSidebar from "../components/RoomSidebar";

const RoomPage = () => {

    const {roomId}=useParams();
    const [room,setRoom]=useState(null);
    const [loading,setLoading]=useState(true);
    const [code, setCode] = useState("");
    const [aiOpen, setAiOpen] = useState(false);
    const {user}=useAuth();
    const socket=useSocket();
    const [participants, setParticipants] = useState([]);

    useEffect(()=>{
        async function fetchRoom(){
            try {
                const res = await axios.get(`http://localhost:4000/api/room/${roomId}`, {
                    withCredentials: true,
                });
                setRoom(res.data.room);
                setCode(res.data.room.code); // prefill with server code
            } catch (error) {
                console.error("Error fetching room:", error);
            }finally{
                setLoading(false);
            }
        }
        fetchRoom();
    },[roomId]);

    useEffect(() => {
        if (!socket || !roomId || !user) return;

        socket.emit("join-room", {
            roomId,
            user: { _id: user._id, username: user.username, socketId: socket.id },
        });

        socket.on("room-users", (users) => {
            setParticipants(users);
        });

        socket.on("code-update", (incomingCode) => {
            setCode(incomingCode);
        });

        return () => {
            socket.emit("leave-room", { roomId, userId: user._id });
            socket.off("code-update");
            socket.off("room-users");
        };
    }, [socket, roomId,user]);

    const handleCodeChange=(newCode)=>{
        setCode(newCode);
        socket.emit("code-change",{roomId,code:newCode});
    }    

    if (loading) return <PageLoader />;

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-4">{room.roomName}</h2>
      <p className="mb-2 text-sm text-gray-500">Language: {room.language}</p>
      <div className="flex-1 overflow-hidden flex">
        <RoomSidebar participants={participants} />
  
        <div className="flex-1 overflow-hidden">
            <CodeEditor language={room.language} value={code} onChange={setCode} />
            <button
                className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 shadow-xl z-50"
                onClick={() => setAiOpen(true)}
            >
            <Bot />
            </button>

            {aiOpen && <AiSidebar onClose={() => setAiOpen(false)} />}
        </div>
      </div>
    </div>
  )
}

export default RoomPage



