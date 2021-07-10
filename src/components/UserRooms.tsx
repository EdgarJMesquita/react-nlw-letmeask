import { database } from '../services/firebase';
import { useAuth } from '../hooks/userAuth';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import listIcon from '../assets/images/list.svg';

import '../styles/user-room.scss';

type FirebaseUserRoomsProps = Record<string,{
  roomName: string;
}>;
type UserRoomsProps = {
  id: string,
  name: string
}

export function  UserRooms(){
  const { user } = useAuth();
  const [ userRooms, setUserRooms ] = useState<UserRoomsProps[]>([]);

  useEffect(() => {
    
      const ref = database.ref(`users/${user?.id}`);

      ref?.on('value',(snapshot)=>{
        const data:FirebaseUserRoomsProps = snapshot.val() ?? {};
        const rooms = Object.entries(data).map(([key,value])=>({
          id: key,
          name: value.roomName
        }));
        
        setUserRooms(rooms);
      })
    
    return () => {
      
    }
  },[user?.id])

  return(
    <div className="user-room">
      <img src={listIcon} alt="mostrar salas" />

      <div className="drop-container">
        <div className="drop-down">
          <div></div>
          <ul>
            {userRooms.length>0?(
              userRooms.map(room=>{
                return(
                  <li key={room.id}>
                    <Link className="links" to={`/admin/rooms/${room.id}`}>{room.name}</Link>
                  </li>
                )
              })
            ):(
            <li>Você não tem salas</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}