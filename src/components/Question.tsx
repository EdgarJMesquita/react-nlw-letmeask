import { ReactNode } from 'react';
import '../styles/question.scss';

type QuestionProps = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;

  children?: ReactNode;
}

export function Question({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
  likeCount
}: QuestionProps){
  return(
    <div className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted && !isAnswered ? 'highlighted' : ''}`}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}