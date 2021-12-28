import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/app.context";

export default function NewAnswer() {
    const { gameId, questionId } = useParams();
    const { token }  = useContext(AppContext);
    const [text, setText] = useState('');
    const [index, setIndex] = useState<number | null>(null)
    const [correct, setCorrect] = useState<boolean>(false);
    const navigate = useNavigate();

    function createAnswer() {
        axios.post(`/games/${gameId}/questions/${questionId}/answers`, {
            text,
            index,
            correct
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            const { id } = res.data;
            navigate(`../${id}`);
        }).catch(err => {
            console.log('Could not create answer');
            console.log(err);
        })
    }

    return (
        <div className="content-center">
            <div className="grid grid-cols-2">
                <label htmlFor="text" className="pr-2">Answer Text</label>
                <input type="text" id="text" name="text" className="border-solid border-2 border-black" onChange={e => setText(e.target.value)} />
                <label htmlFor="index" className="pr-2">Index</label>
                <input type="text" name="index" id="index" className="border-solid border-2 border-black" onChange={e => setIndex(parseInt(e.target.value))} />
                <label htmlFor="correct" className="pr-2">Correct</label>
                <input type="checkbox" name="correct" id="correct" className="border-solid border-2 border-black" onChange={e => setCorrect(e.target.checked)} />
            </div>
            <button onClick={createAnswer}>Create</button>
        </div>
    )
}