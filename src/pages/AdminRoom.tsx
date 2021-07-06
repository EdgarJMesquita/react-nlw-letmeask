
import { useHistory, useParams } from 'react-router-dom';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { Button } from '../components/Button';
import { database } from '../services/firebase';
import swal from 'sweetalert';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import emptyQuestions from '../assets/images/empty-questions.svg';
import answerImg from '../assets/images/answer.svg'; 

import '../styles/room.scss';

type ParamsProps = {
    id: string;
}

export function AdminRoom(){
    const history = useHistory();
    const params = useParams<ParamsProps>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleCheckQuestionAsAnswered(questionId:string, isAnswered:boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !isAnswered
        })
    }

    async function handleHightlightQuestion(questionId:string, isHighlighted: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: !isHighlighted
        })
    }

    async function handleDeleteQuestion(questionId: string) {

        const promise = await swal({
            title: 'Deseja excluir essa pergunta?',
            text: 'Uma vez excluída você não poderá recupera-lá.',
            icon: 'warning',
            buttons: {
                cancel:{
                    text: 'Voltar',
                    value: null,
                    visible: true
                },
                confirm: {
                    text: 'Excluir',
                    value: true
                }
            },
            dangerMode: true
        })
        if(promise){
            database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
            .then(res=>{
                swal('Questão excluída',{
                    icon: 'success',
                    timer: 1000,
                    buttons: [false]
                })
                
                
            })
            .catch(err=>{
                swal('Você não tem permissão','Apenas o criador da sala pode excluir perguntas.', 'warning')
                history.push(`/rooms/${roomId}`);
            })           
        }
        
    }

    async function handleEndRoom(){

        const promise = await swal({
            title: 'Deseja encerrar a sala?',
            text: 'Uma vez encerrada você não poderá recupera-lá.',
            icon:'warning',
            buttons: {
                cancel: {
                    text: 'Voltar',
                    value: null,
                    visible: true
                },
                confirm: {
                    text: 'Encerrar',
                    value: true
                }
            },
            dangerMode: true
        })
        if(promise){
            database.ref(`rooms/${roomId}`).update({
                closedAt: new Date()
            })
            .then(res=>{
                swal({
                    title: 'Sala encerrada',
                    icon: 'success',
                    timer: 3000
                })
                history.push('/');
            })
            .catch(err=>{
                swal({
                    title: 'Você não tem permissão',
                    text: 'Apenas o criador da sala pode encerrá-la.',
                    icon: 'error'
                })
                history.push(`/rooms/${roomId}`)
            })
           /*  await database.ref(`rooms/${roomId}`).update({
                endedAt: new Date()
            })
            history.push('/') */
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
                {questions?.length>0?(
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
                             <button onClick={()=>handleCheckQuestionAsAnswered(question.id, question.isAnswered)} type="button">
                                 <img src={checkImg} alt="Marcar como respondida" />
                             </button>
                             <button onClick={()=>handleHightlightQuestion(question.id, question.isHighlighted)} type="button">
                                 <img src={answerImg} alt="Destacar pergunta" />
                             </button>
                             <button 
                             type="button"
                             onClick={()=>{handleDeleteQuestion(question.id)}}>
                                 <img src={deleteImg} alt="Remover pergunta" />
                             </button>
                         </Question>  
                        );
                    })}  
                 </div>
                ):(
                <div className="empty-questions">
                    <img src={emptyQuestions} alt="Não há perguntas ainda." />
                    <p>Nenhuma pergunta por aqui...</p>
                    <span>Envie o código da sala para seus amigos e comece a responder perguntas.</span>
                </div>
                )}
               
                
            </main>
        </div>
    )
}