import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { AppContext } from "../context/app.context";
import { Game } from 'trivia-shared';
import { Link } from "react-router-dom";

export default function GamesLayout() {
    const context = useContext(AppContext);
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        axios.get('/games', {
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
            <div className="flex flex-col divide-y-2">
                {
                    games.map(g => {
                        return (
                            <Link key={g.id} to={`${g.id}`} className="min-h-[5px]">{g.name}</Link>
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