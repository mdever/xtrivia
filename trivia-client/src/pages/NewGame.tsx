import axios from "axios";
import { useContext, useState } from "react"
import { useNavigate } from "react-router";
import { Game } from "trivia-shared";
import { AppContext } from "../context/app.context"

export default function NewGame() {

    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');

    function createGame() {
        axios.post('/games', {
            name
        }, {
            headers: {
                'Authorization': `Bearer ${context.token}`
            }
        }).then(res => {
            const game = res.data as Game;
            navigate(`../${game.id}`)
        }).catch(err => {
            console.log('Could not create game');
            console.log(err);
        })
    }

    return (
        <div className="place-self-center">
            <form>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" onChange={e => setName(e.target.value)}/>
                <button onClick={createGame}>Create</button>
            </form>
        </div>
    )
}