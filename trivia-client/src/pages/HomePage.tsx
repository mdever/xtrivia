import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/app.context";

export default function HomePage() {

    const { token } = useContext(AppContext);
    const [code, setCode] = useState('');

    function joinRoom() {
        axios.post(`/tickets/${code}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {

        }).catch(err => {
            console.log(`Could not join room ${code}`);
            console.log(err);
        })
    }

    return (
        <>
            <h3>Welcome to trivia</h3>
            <Link to="games">View Games</Link>
            <div>
                <h3>Join room</h3>
                <label htmlFor="roomCode">Code: </label>
                <input type="text" onChange={e => setCode(e.target.value)} />
                <button onClick={joinRoom}>Join</button>
            </div>
        </>
    )
}