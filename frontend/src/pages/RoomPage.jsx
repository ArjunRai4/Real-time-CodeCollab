import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom'
import PageLoader from '../components/PageLoader';
import { useEffect } from 'react';
import { useState } from 'react';

const RoomPage = () => {

    const {roomId}=useParams();
    const [room,setRoom]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        async function fetchRoom(){
            try {
                const res = await axios.get(`http://localhost:4000/api/room/${roomId}`, {
                    withCredentials: true,
                });
                setRoom(res.data.room);
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
      <div className="mt-4 bg-white rounded-xl shadow p-4">
        {/* Code Editor will go here */}
        <div className="h-[500px] border border-gray-300 rounded">Code editor placeholder</div>
      </div>
    </div>
  )
}

export default RoomPage
