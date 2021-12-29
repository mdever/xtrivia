import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { DenormalizedQuestion } from "trivia-shared";
import { AppContext } from "../context/app.context";

export default function QuestionLayout() {
    const { gameId, questionId } = useParams();
    const [question, setQuestion] = useState<DenormalizedQuestion | null>(null);

    const { token } = useContext(AppContext);

    useEffect(() => {
        axios.get(`/games/${gameId}/questions/${questionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {

        }).catch(err => {
            console.log('Could not fetch question');
            setQuestion(null);
        })
    }, [questionId])
    return (
        <div>
            <div>
                Question outlet {question?.text}
            </div>
            <Outlet />
        </div>

    
    )
}