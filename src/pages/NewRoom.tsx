import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import illustration from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { UserRooms } from '../components/UserRooms';
//import { useAuth } from '../hooks/userAuth';

import '../styles/auth.scss'
import { database } from '../services/firebase';
import { useAuth } from '../hooks/userAuth';


export function NewRoom(){
    const history = useHistory();
    const { user } = useAuth();
    const [ newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(newRoom.trim()===''){
            return;
        }

        const roomRef = database.ref('rooms');
        
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
            
        });
        
        await database.ref(`users/${user?.id}/${firebaseRoom.key}`).set({
            key: firebaseRoom.key,
            roomName: newRoom
        });

        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }
    return(
        <div id="page-auth">
            <aside>
                <img src={illustration} alt="ilustração" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text"
                        placeholder="Nome da sala"
                        onChange={event=>setNewRoom(event.target.value)}
                        value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala já existente?  <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
            <div className="user-rooms">
                <UserRooms />
            </div>
        </div>
    )
}