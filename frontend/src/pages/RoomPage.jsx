import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom'
import PageLoader from '../components/PageLoader';
import { useEffect } from 'react';
import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';

const RoomPage = () => {

    const {roomId}=useParams();
    const [room,setRoom]=useState(null);
    const [loading,setLoading]=useState(true);
    const [code, setCode] = useState("");

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

    if (loading) return <PageLoader />;

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-4">{room.roomName}</h2>
      <p className="mb-2 text-sm text-gray-500">Language: {room.language}</p>
      <CodeEditor language={room.language} code={code} setCode={setCode} />
    </div>
  )
}

export default RoomPage
