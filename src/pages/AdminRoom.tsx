
import { useHistory, useParams } from 'react-router-dom';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { Button } from '../components/Button';
import { database } from '../services/firebase';
import swal from 'sweetalert';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import '../styles/room.scss';

type ParamsProps = {
    id: string;
}

export function AdminRoom(){
    const history = useHistory();
    const params = useParams<ParamsProps>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);
    
    async function handleDeleteQuestion(questionId: string) {

        const promise = await swal({
            title: 'Deseja excluir essa questão?',
            text: 'Uma vez excluída você não poderá recupera-lá.',
            icon: 'warning',
            buttons: ['Voltar',true],
            dangerMode: true
        })
        if(promise){
            swal('Questão excluída',{
                icon: 'success'
            })
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
        
    }

    async function handleEndRoom(){

        const promise = await swal({
            title: 'Deseja encerrar a sala?',
            text: 'Uma vez encerrada você não poderá recupera-lá.',
            icon:'warning',
            buttons: ['Voltar',true],
            dangerMode: true
        })
        if(promise){
            await database.ref(`rooms/${roomId}`).update({
                endedAt: new Date()
            })
            history.push('/')
        }

    }

    
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" /> 
                    <div>
                      <RoomCode code={params.id}/>
                      <Button 
                        onClick={handleEndRoom}
                        isOutlined
                      >
                        Encerrar sala
                      </Button>
                    </div> 
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions?.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>
                
                <div className="question-list">
                   { questions.map(question=>{
					   return(
						<Question 
							key = {question.id}
							id = {question.id}
							content = {question.content}
							author = {question.author}
							isAnswered = {question.isAnswered}
							isHighlighted = {question.isHighlighted}
						>
                            <button 
                                type="button"
                                onClick={()=>{handleDeleteQuestion(question.id)}}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>  
					   );
				   })}  
                </div>
            </main>
        </div>
    )
}