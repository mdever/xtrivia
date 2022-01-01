import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DenormalizedAnswer } from "trivia-shared";
import { AppContext } from "../context/app.context";
import { answersForChosenQuestion } from "../context/game.context";

export default function AnswersLayout() {

    const { token } = useContext(AppContext);
    const { gameId, questionId } = useParams();
    const answers = useRecoilValue(answersForChosenQuestion);
 
    return (
        <div className="grid grid-cols-layout">
            <div className="flex flex-col divide-y-2">
                {
                    answers?.map(a => {
                        return (
                            <Link key={a.id} to={`${a.id}`} className="min-h-[5px]">{a.text}</Link>
                        );
                    })
                }
                <Link to="new" className="min-h-[5px]">New</Link>
            </div>
            <div className="p-2">
                <Outlet />
            </div>
        </div>
    )
}