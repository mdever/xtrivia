import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { DenormalizedQuestion } from "trivia-shared";
import { AppContext } from "../context/app.context";
import { chosenQuestion, chosenQuestionId } from "../context/game.context";

export default function QuestionLayout() {
    const { gameId, questionId } = useParams();
    const [qId, setChosenQuestionId] = useRecoilState(chosenQuestionId);
    const question = useRecoilValue(chosenQuestion);

    const { token } = useContext(AppContext);

    useEffect(() => {
        setChosenQuestionId(parseInt(questionId || '0'));
    }, [questionId])

    return (
        <div>
            <div>
                Question outlet: {question?.text}
            </div>
            <Outlet />
        </div>

    
    )
}