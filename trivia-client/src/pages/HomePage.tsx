import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/app.context"

export default function HomePage() {
    const [games, setGames] = useState([]);
    const appContext = useContext(AppContext);

    useEffect(() => {
        axios.get('/games', {
            headers: {
                'Authorization': `Bearer ${appContext.token}`
            }
        }).then(res => {
            setGames(res.data);
        }).catch(err => {
            console.log('Encountered an error');
            console.log(err);
            setGames([]);
        })

        return () => {};
    }, []);

    return (
        <h3>Welcome to trivia</h3>
    )
}