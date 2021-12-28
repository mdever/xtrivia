import axios from "axios";
import { useContext, useEffect } from "react";
import { Outlet, useParams } from "react-router"
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { AppContext } from "../context/app.context";
import { gameState } from "../context/game.context";

export default function GameLayout () {
    const { gameId } = useParams();
    const { token } = useContext(AppContext);
    const [game, setGame] = useRecoilState(gameState);

    useEffect(() => {
        axios.get(`/games/${gameId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setGame(res.data)
        }).catch(err => {
            console.log('Could not fetch games');
            console.log(err);
            setGame(null);
        });
    }, [gameId]);

    return (
    <div className="grid grid-cols-layout">
        <div className="flex flex-col divide-y-2">
            {
                game?.questions?.map(q => {
                    return (
                        <Link key={q.id} to={`questions/${q.id}`} className="min-h-[5px]">{q.text}</Link>
                    );
                })
            }
            <Link to="questions/new" className="min-h-[5px]">New</Link>
        </div>
        <div className="p-2">
            <Outlet />
        </div>
    </div>
    )
}