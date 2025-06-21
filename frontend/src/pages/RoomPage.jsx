import React from 'react'
import { useParams } from 'react-router-dom'

const RoomPage = () => {

    const {roomId}=useParams();
    const [room,setRoom]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        async function fetchRoom(){
            try {
                
            } catch (error) {
                
            }
        }
    })

  return (
    <div>
      
    </div>
  )
}

export default RoomPage
