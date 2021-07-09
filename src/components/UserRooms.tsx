import { database } from '../services/firebase';
import { useAuth } from '../hooks/userAuth';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import listIcon from '../assets/images/list-icon.svg';

import '../styles/user-room.scss';

type FirebaseUserRoomsProps = Record<string,{
  key: string;
}>;

export function  UserRooms(){
  const { user } = useAuth();
  const [ userRooms, setUserRooms ] = useState<string[]>([]);

  useEffect(() => {
    
      const ref = database.ref(`users/${user?.id}`);

      ref.on('value',(snapshot)=>{
        const data:FirebaseUserRoomsProps = snapshot.val()
        const rooms = Object.entries(data).map(([key,value])=>value.key);
        
        setUserRooms(rooms);
      })
    
    return () => {
      
    }
  },[user?.id])

  async function fetchUserRooms() {
    /* const ref = database.ref(`users/${user?.id}`);

    ref.on('value',(snapshot)=>{
      const data:FirebaseUserRoomsProps = snapshot.val()
      const rooms = Object.entries(data).map(([key,value])=>value.key);
      
      setUserRooms(rooms);
    }) */
  }

  return(
    <div 
      onMouseOver={fetchUserRooms}
      className="user-room"
    >
      <img src={listIcon} alt="mostrar salas" />

      <div className="drop-down">
        <ul>
          {userRooms.map(key=>{
          return(
            <li key={key}>
              <Link className="links" to={`/admin/rooms/${key}`}>{key}</Link>
            </li>
          )
        })}
        </ul>
      </div>
    </div>
  )
}