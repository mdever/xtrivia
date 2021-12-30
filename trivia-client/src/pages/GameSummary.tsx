import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { DenormalizedGame } from "trivia-shared";
import { AppContext } from "../context/app.context"

export default function GameSummary() {

    const { token } = useContext(AppContext);
    const { gameId } = useParams();
    const [game, setGame] = useState<null | DenormalizedGame>(null);

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
        axios.post('/rooms', {
            gameId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {

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