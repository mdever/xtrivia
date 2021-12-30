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
        <Outlet />
    )
}