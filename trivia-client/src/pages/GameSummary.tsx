import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react"
import { NavigateOptions, useNavigate, useParams } from "react-router";
import { createSearchParams, Link } from "react-router-dom";
import { DenormalizedGame } from "trivia-shared";
import { AppContext } from "../context/app.context"
import { CreateRoomResponseDTO } from 'trivia-shared';

export default function GameSummary() {

    const { token } = useContext(AppContext);
    const { gameId } = useParams();
    const [game, setGame] = useState<null | DenormalizedGame>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/games/${gameId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setGame(res.data);
        }).catch(err => {
            console.log(`Could not fetch game id ${gameId}`);
            console.log(err);
            setGame(null);
        });
    }, [gameId]);

    function startGame() {
        axios.post<{ name: string }, AxiosResponse<CreateRoomResponseDTO> >(`/games/${gameId}/rooms`, {
            name: game?.name
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            const { code, tickets, name } = res.data;
            navigate({
                pathname: `/host/${code}`,
                search: `?${createSearchParams({
                    name,
                    ticket: tickets[0].ticket
                })}`
            });
        }).catch(err => {
            console.log(`Could not create room for game ${gameId}`);
            console.log(err);
        });
    }

    return (
        <>
            {
                game ? <div>{game.name}</div> : <div>Loading</div>
            }
            {
                game && <Link to="questions">Questions</Link>
            }
            {
                game && <button className="block" onClick={startGame}>Start</button>
            }
        </>
    )
}