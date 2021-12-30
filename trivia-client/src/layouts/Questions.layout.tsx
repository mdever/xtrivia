import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, Outlet } from "react-router";
import { Link } from 'react-router-dom';
import { DenormalizedGame, DenormalizedQuestion } from "trivia-shared";
import { AppContext } from "../context/app.context";

export default function QuestionsLayout() {

    const { gameId } = useParams();
    const { token }  = useContext(AppContext);
    const [questions, setQuestions] = useState<DenormalizedQuestion[]>()

    useEffect(() => {
        axios.get(`/games/${gameId}/questions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setQuestions(res.data);
        }).catch(err => {
            console.log('Could not fetch game ' + gameId);
            console.log(err);
            setQuestions([]);
        })
    }, [gameId])

    return (
        <div className="grid grid-cols-layout">
    
        <div className="flex flex-col divide-y-2">
            {
                questions?.map(q => {
                    return (
                        <Link key={q.id} to={`${q.id}`} className="min-h-4">{q.text}</Link>
                    );
                })
            }
            <Link to="new" className="min-h-4">New</Link>
        </div>
        <div className="p-2">
            <Outlet />
        </div>
    </div>
    )

}