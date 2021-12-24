import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { AppContext } from "../context/app.context";

export default function GamesLayout() {
    const context = useContext(AppContext);
    const [games, setGames] = useState([]);

    useEffect(() => {
        axios.post('/games', {
            headers: {
                'Authorization': `Bearer ${context.token}`
            }
        }).then(res => {
            setGames(res.data);
        }).catch(err => {
            console.log('Could not fetch games');
            console.log(err);
            setGames([]);
        });
    }, []);

    return (
        <div className="grid grid-cols-layout">
            <div className="flex flex-column">
                {
                    games.map(g => {
                        return (
                            <div>{g.name}</div>
                        );
                    })
                }
                <div>New Game</div>
            </div>
            <div className="p-2">
                Games Layout
                <Outlet />
            </div>
        </div>
    )
}