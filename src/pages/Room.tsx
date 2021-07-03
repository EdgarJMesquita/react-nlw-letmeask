import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/userAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';

type ParamsProps = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}> 


type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function Room(){
    const { user } = useAuth();
    const params = useParams<ParamsProps>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions,setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');
    
    useEffect(() => {
        const roomRef = database.ref(`rooms/${params.id}`);

        roomRef.once('value',room=>{
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            // Minha solução
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value])=>({
                id: key,
                ...value
            }));
            
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions);

            // Solução aula
            /* const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value])=>({
                id: key,
                content: value.content,
                author: value.author,
                isHighlighted: value.isHighlighted,
                isAnswered: value.isAnswered
            }));
            console.log(parsedQuestions) */
        })


        
    }, [params.id]);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
         
        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
        }
        
        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false
        };

        await database.ref(`rooms/${params.id}/questions`).push(question);

        setNewQuestion('');
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />  
                    <RoomCode code={params.id}/>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions?.length > 0 && <span>{questions.length} perguntas</span> }
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    onChange={event=>setNewQuestion(event.target.value)}
                    value={newQuestion}
                    placeholder="O que você quer perguntar?" />
                    <div className="form-footer">
                        { user? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} /> 
                                <span>{user.name}</span>                               
                            </div>
                        ) : (
                            <span >Para enviar uma pergunta, <button>faça seu login</button>.</span> 
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}