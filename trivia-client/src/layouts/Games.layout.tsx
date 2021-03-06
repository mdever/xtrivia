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
            <div className="flex flex-col">
                {
                    games.map(g => {
                        return (
                            <div className="h-8 border border-indigo-500">
                                <Link key={g.id} className="pl-2" to={`${g.id}`}>{g.name}</Link>
                            </div>
                        );
                    })
                }
                <div className="h-8 border border-indigo-500">
                    <Link to="new" className="pl-2">New</Link>
                </div>
            </div>
            <div className="p-2">
                <Outlet />
            </div>
        </div>
    )
}