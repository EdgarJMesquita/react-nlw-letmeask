
import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/userAuth';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { UserRooms } from '../components/UserRooms';
import { useRoom } from '../hooks/useRoom';
import { Button } from '../components/Button';
import { database } from '../services/firebase';
import swal from 'sweetalert';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import emptyQuestions from '../assets/images/empty-questions.svg';
import answerImg from '../assets/images/answer.svg';
import like from '../assets/images/like.svg';
import '../styles/room.scss';

type ParamsProps = {
    id: string;
}

export function AdminRoom(){
    const history = useHistory();
    const params = useParams<ParamsProps>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);
    const { user } = useAuth();

    async function handleCheckQuestionAsAnswered(questionId:string) {
        try{
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isAnswered: true
            });
        }catch(e){
            swal('Você não tem permissão','Apenas o criador da sala pode responder perguntas.', 'warning')
            history.push(`/rooms/${roomId}`);
        }
    }

    async function handleHightlightQuestion(questionId:string) {
        try {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: true
            });
        } catch (error) {
            swal('Você não tem permissão','Apenas o criador da sala pode destacar perguntas.', 'warning')
            history.push(`/rooms/${roomId}`);
        }
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
            try {
                await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
                swal('Questão excluída',{
                    icon: 'success',
                    timer: 1000,
                    buttons: [false]
                })
            } catch (error) {
                swal('Você não tem permissão','Apenas o criador da sala pode excluir perguntas.', 'warning');
                history.push(`/rooms/${roomId}`);
            }

            /* database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
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
            });       */     
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

            try {
                await database.ref(`rooms/${roomId}`).update({
                    closedAt: new Date()
                });
                await database.ref(`users/${user?.id}/${roomId}`).remove();
                await swal({
                    title: 'Sala encerrada',
                    icon: 'success',
                    timer: 1000
                });
                history.push('/rooms/new');

            } catch (error) {
                swal({
                    title: 'Você não tem permissão',
                    text: 'Apenas o criador da sala pode encerrá-la.',
                    icon: 'error'
                })
                history.push(`/rooms/${roomId}`);
            }

           /*  database.ref(`rooms/${roomId}`).update({
                closedAt: new Date()
            })
            .then(res=>{
                swal({
                    title: 'Sala encerrada',
                    icon: 'success',
                    timer: 1000
                    
                   
                }).then(res=>{
                    database.ref(`users/${user?.id}/${roomId}`).remove();
                    history.push('/rooms/new');
                })
            })
            .catch(err=>{
                swal({
                    title: 'Você não tem permissão',
                    text: 'Apenas o criador da sala pode encerrá-la.',
                    icon: 'error'
                })
                history.push(`/rooms/${roomId}`)
            }) */
        }
    }

    

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img onClick={()=>history.push('/')} src={logoImg} alt="Letmeask" /> 
                    <div>
                        <RoomCode code={params.id}/>
                        <div>
                            <UserRooms />
                            <Button 
                            onClick={handleEndRoom}
                            isOutlined
                            >
                            Encerrar sala
                            </Button>
                        </div>
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
                            likeCount = {question.likeCount}
                        >   
                            { !question.isAnswered && (
                            <>
                                <button 
                                    type="button"
                                    onClick={()=>handleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="Marcar como respondida" />
                                </button>

                                <button 
                                    type="button"
                                    onClick={()=>handleHightlightQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="Destacar pergunta" />
                                </button>
                            </>
                            ) }

                            <button 
                                type="button"
                                onClick={()=>{handleDeleteQuestion(question.id)}}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                            <div className="likes-count">
                                <span>{question.likeCount}</span>
                                <img src={like} alt="likes" />
                            </div>
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